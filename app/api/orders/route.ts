import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { verifyTableToken } from '@/lib/qrToken';
import { getSupabaseAdminClient } from '@/lib/supabase/admin';
import { isSupabaseConfigured } from '@/lib/env';
import menuMockData from '@/data/mock/menu.json';

const orderPayloadSchema = z.object({
  tableId: z.string().min(1),
  tableNumber: z.number().int().positive(),
  token: z.string().optional(),
  items: z.array(
    z.object({
      id: z.string(),
      quantity: z.number().int().positive(),
      notes: z.string().optional(),
    })
  ).min(1, 'Order must contain at least 1 item'),
  customerNotes: z.string().optional(),
  source: z.enum(['customer', 'waiter']).default('customer'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = orderPayloadSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid order payload', details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { tableId, tableNumber, token, items, customerNotes, source } = parsed.data;

    // 1. Verify Table Token (if token is provided or secret is enforced)
    if (token) {
      const tokenVerification = verifyTableToken(tableId, token);
      if (!tokenVerification.valid) {
        return NextResponse.json(
          {
            error: 'This table code has expired. Please ask our staff for help.',
            reason: tokenVerification.reason,
          },
          { status: 403 }
        );
      }
    }

    // 2. Fetch official menu items to recalculate prices securely
    let officialItems: Array<{ id: string; name: string; price: number; isAvailable: boolean }> = [];

    if (isSupabaseConfigured() && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const supabase = getSupabaseAdminClient();
        const { data: dbItems, error: dbErr } = await supabase
          .from('menu_items')
          .select('id, name, price, is_available');

        if (!dbErr && dbItems && dbItems.length > 0) {
          officialItems = dbItems.map((it: any) => ({
            id: it.id,
            name: it.name,
            price: Number(it.price),
            isAvailable: Boolean(it.is_available),
          }));
        }
      } catch (err) {
        console.warn('[API /api/orders] Supabase fetch fallback to mock catalogue:', err);
      }
    }

    // Fallback to local catalogue if database is offline
    if (officialItems.length === 0) {
      officialItems = menuMockData.map((m) => ({
        id: m.id,
        name: m.name,
        price: m.price,
        isAvailable: m.isAvailable !== false,
      }));
    }

    // 3. Recalculate price and verify availability
    let subtotal = 0;
    const verifiedOrderItems: Array<{
      menuItemId: string;
      name: string;
      unitPrice: number;
      quantity: number;
      notes?: string;
    }> = [];

    for (const reqItem of items) {
      const match = officialItems.find((o) => o.id === reqItem.id || o.name.toLowerCase() === reqItem.id.toLowerCase());
      if (!match) {
        return NextResponse.json(
          { error: `Item with id ${reqItem.id} not found in restaurant menu catalogue.` },
          { status: 400 }
        );
      }

      if (!match.isAvailable) {
        return NextResponse.json(
          { error: `Item "${match.name}" is currently sold out and cannot be ordered.` },
          { status: 400 }
        );
      }

      const itemTotal = match.price * reqItem.quantity;
      subtotal += itemTotal;

      verifiedOrderItems.push({
        menuItemId: match.id,
        name: match.name,
        unitPrice: match.price,
        quantity: reqItem.quantity,
        notes: reqItem.notes,
      });
    }

    const tax = Math.round(subtotal * 0.05);
    const total = subtotal + tax;
    const orderNumber = `#TF-${Math.floor(100 + Math.random() * 900)}`;
    const now = new Date().toISOString();

    // 4. If Supabase is active, record in database
    let createdOrderId = `order_${Date.now()}`;

    if (isSupabaseConfigured() && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const supabase = getSupabaseAdminClient();

        // Get restaurant
        const { data: rest } = await supabase
          .from('restaurants')
          .select('id')
          .eq('slug', 'aroma-saffron')
          .single();
        const restaurantId = (rest as any)?.id;

        // Ensure Table Session exists
        const { data: session } = await supabase
          .from('table_sessions')
          .select('id')
          .eq('table_id', tableId)
          .eq('status', 'open')
          .maybeSingle();

        let sessionId = (session as any)?.id;
        if (!sessionId && restaurantId) {
          const { data: newSession } = await supabase
            .from('table_sessions')
            .insert({
              restaurant_id: restaurantId,
              table_id: tableId,
              status: 'open',
            })
            .select('id')
            .single();
          sessionId = (newSession as any)?.id;
        }

        // Insert Order
        const { data: dbOrder, error: orderErr } = await supabase
          .from('orders')
          .insert({
            restaurant_id: restaurantId,
            table_session_id: sessionId || null,
            table_id: tableId,
            order_number: orderNumber,
            status: 'sent',
            source,
            notes: customerNotes || null,
          })
          .select('id')
          .single();

        if (dbOrder) {
          createdOrderId = (dbOrder as any).id;

          // Insert Order Items
          const dbOrderItems = verifiedOrderItems.map((it) => ({
            order_id: createdOrderId,
            menu_item_id: it.menuItemId.includes('-') && it.menuItemId.length > 30 ? it.menuItemId : null,
            name_snapshot: it.name,
            unit_price: it.unitPrice,
            quantity: it.quantity,
            notes: it.notes || null,
            item_status: 'pending',
          }));

          await supabase.from('order_items').insert(dbOrderItems);

          // Update table status
          await supabase
            .from('tables')
            .update({ status: 'occupied' })
            .eq('id', tableId);
        }
      } catch (dbErr) {
        console.warn('[API /api/orders] Database write fallback:', dbErr);
      }
    }

    return NextResponse.json(
      {
        success: true,
        order: {
          id: createdOrderId,
          orderNumber,
          tableId,
          tableNumber,
          status: 'sent',
          items: verifiedOrderItems,
          subtotal,
          tax,
          total,
          customerNotes,
          createdAt: now,
        },
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error('[API /api/orders] Error processing order:', err);
    return NextResponse.json(
      { error: 'Internal server error processing order', message: err.message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const tableId = request.nextUrl.searchParams.get('tableId');

    if (isSupabaseConfigured() && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const supabase = getSupabaseAdminClient();
        let query = supabase
          .from('orders')
          .select(`
            id,
            order_number,
            table_id,
            status,
            source,
            notes,
            created_at,
            order_items (
              id,
              menu_item_id,
              name_snapshot,
              unit_price,
              quantity,
              notes,
              item_status
            ),
            tables (
              table_number
            )
          `)
          .order('created_at', { ascending: false });

        if (tableId) {
          query = query.eq('table_id', tableId);
        }

        const { data, error } = await query;
        if (!error && data) {
          return NextResponse.json({ orders: data });
        }
      } catch (err) {
        console.warn('[API /api/orders GET] Fallback:', err);
      }
    }

    return NextResponse.json({ orders: [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
