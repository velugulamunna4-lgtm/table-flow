import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { verifyTableToken } from '@/lib/qrToken';
import { getSupabaseAdminClient } from '@/lib/supabase/admin';
import { isSupabaseConfigured } from '@/lib/env';

const waiterRequestSchema = z.object({
  tableId: z.string().min(1),
  tableNumber: z.number().int().positive(),
  token: z.string().optional(),
  type: z.enum(['water', 'bill', 'help', 'clean_table', 'call_waiter']),
  waterType: z.string().optional(),
  cleanDetails: z.string().optional(),
  details: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = waiterRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid waiter request', details: parsed.error.issues },
        { status: 400 }
      );
    }

    const { tableId, tableNumber, token, type, waterType, cleanDetails, details } = parsed.data;

    // Verify token if present
    if (token) {
      const verification = verifyTableToken(tableId, token);
      if (!verification.valid) {
        return NextResponse.json(
          {
            error: 'This table code has expired. Please ask our staff for help.',
            reason: verification.reason,
          },
          { status: 403 }
        );
      }
    }

    let requestDetails = details || 'Customer requested assistance';
    if (type === 'water') {
      requestDetails = `Water: ${waterType || 'Normal'}`;
    } else if (type === 'clean_table') {
      requestDetails = cleanDetails || 'Table Cleaning';
    }

    let createdId = `req_${Date.now()}`;

    if (isSupabaseConfigured() && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const supabase = getSupabaseAdminClient();
        const { data: rest } = await supabase
          .from('restaurants')
          .select('id')
          .eq('slug', 'aroma-saffron')
          .single();

        const { data: newReq, error: reqErr } = await supabase
          .from('waiter_requests')
          .insert({
            restaurant_id: (rest as any)?.id,
            table_id: tableId,
            type,
            details: requestDetails,
            status: 'open',
          })
          .select('id')
          .single();

        if (newReq) createdId = (newReq as any).id;

        // Update table status
        await supabase
          .from('tables')
          .update({ status: type === 'clean_table' ? 'clean_table' : 'needs_help' })
          .eq('id', tableId);
      } catch (err) {
        console.warn('[API /api/waiter-requests] Supabase write error:', err);
      }
    }

    return NextResponse.json(
      {
        success: true,
        request: {
          id: createdId,
          tableId,
          tableNumber,
          type,
          details: requestDetails,
          waterType,
          cleanDetails,
          timestamp: new Date().toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    if (isSupabaseConfigured() && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const supabase = getSupabaseAdminClient();
        const { data, error } = await supabase
          .from('waiter_requests')
          .select('*, tables(table_number)')
          .eq('status', 'open')
          .order('created_at', { ascending: false });

        if (!error && data) {
          return NextResponse.json({ requests: data });
        }
      } catch (err) {
        console.warn('[API /api/waiter-requests GET] Fallback:', err);
      }
    }

    return NextResponse.json({ requests: [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
