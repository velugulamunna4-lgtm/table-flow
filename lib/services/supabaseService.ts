import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { isSupabaseConfigured } from '@/lib/env';
import { Order, OrderStatus, OrderReview, StockItem, WaterTankStatus, MenuItem as UIItem } from '@/types';
import { z } from 'zod';

export const createOrderSchema = z.object({
  tableId: z.string().min(1),
  tableNumber: z.number().int().positive(),
  items: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      price: z.number().nonnegative(),
      quantity: z.number().int().positive(),
      vegType: z.enum(['veg', 'non-veg']),
      notes: z.string().optional(),
    })
  ).min(1, 'Order must contain at least one item'),
  notes: z.string().optional(),
  source: z.enum(['customer', 'waiter']).default('customer'),
  qrToken: z.string().optional(),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;

export const waiterRequestSchema = z.object({
  tableId: z.string().min(1),
  tableNumber: z.number().int().positive(),
  type: z.enum(['call_waiter', 'water', 'bill', 'clean_table', 'help']),
  details: z.string().optional(),
  waterType: z.string().optional(),
  cleanDetails: z.string().optional(),
});

export type WaiterRequestInput = z.infer<typeof waiterRequestSchema>;

export const reviewSchema = z.object({
  tableNumber: z.number().int().positive(),
  orderId: z.string().optional(),
  foodRating: z.number().min(1).max(5),
  serviceRating: z.number().min(1).max(5),
  ambianceRating: z.number().min(1).max(5),
  overallRating: z.number().min(1).max(5),
  comment: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export type ReviewInput = z.infer<typeof reviewSchema>;

export class SupabaseService {
  private get client() {
    return getSupabaseBrowserClient();
  }

  get isEnabled(): boolean {
    return isSupabaseConfigured();
  }

  // ============================================================================
  // Menu & Categories
  // ============================================================================

  async getCategories() {
    if (!this.isEnabled) return null;
    try {
      const { data, error } = await this.client
        .from('menu_categories')
        .select('*')
        .order('sort_order', { ascending: true });
      if (error) throw error;
      return data;
    } catch (err) {
      console.warn('[SupabaseService] getCategories failed, falling back:', err);
      return null;
    }
  }

  async getMenuItems(): Promise<UIItem[] | null> {
    if (!this.isEnabled) return null;
    try {
      const { data, error } = await this.client
        .from('menu_items')
        .select('*, menu_categories(name)')
        .order('name', { ascending: true });

      if (error) throw error;
      if (!data) return null;

      return data.map((d: any) => ({
        id: d.id,
        name: d.name,
        nameTranslations: d.name_translations || {},
        description: d.description || '',
        price: Number(d.price),
        category: (d.menu_categories?.name || 'mains').toLowerCase(),
        vegType: d.is_veg ? 'veg' : 'non-veg',
        spiceLevel: d.spice_level || 0,
        isSpecial: Boolean(d.is_special),
        isAvailable: Boolean(d.is_available),
        image: d.image_url || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800',
        tags: d.tags || [],
      }));
    } catch (err) {
      console.warn('[SupabaseService] getMenuItems failed, falling back:', err);
      return null;
    }
  }

  async setItemAvailability(itemId: string, isAvailable: boolean) {
    if (!this.isEnabled) return false;
    try {
      const { error } = await this.client
        .from('menu_items')
        .update({ is_available: isAvailable })
        .eq('id', itemId);
      if (error) throw error;
      return true;
    } catch (err) {
      console.warn('[SupabaseService] setItemAvailability error:', err);
      return false;
    }
  }

  // ============================================================================
  // Tables
  // ============================================================================

  async getTables() {
    if (!this.isEnabled) return null;
    try {
      const { data, error } = await this.client
        .from('tables')
        .select('*')
        .order('table_number', { ascending: true });
      if (error) throw error;
      return data;
    } catch (err) {
      console.warn('[SupabaseService] getTables error:', err);
      return null;
    }
  }

  async updateTableStatus(tableId: string, status: string) {
    if (!this.isEnabled) return false;
    try {
      const { error } = await this.client
        .from('tables')
        .update({ status })
        .eq('id', tableId);
      if (error) throw error;
      return true;
    } catch (err) {
      console.warn('[SupabaseService] updateTableStatus error:', err);
      return false;
    }
  }

  // ============================================================================
  // Orders
  // ============================================================================

  async getOrders(): Promise<Order[] | null> {
    if (!this.isEnabled) return null;
    try {
      const { data, error } = await this.client
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

      if (error) throw error;
      if (!data) return null;

      return data.map((o: any) => {
        const items = (o.order_items || []).map((it: any) => ({
          menuItemId: it.menu_item_id,
          name: it.name_snapshot,
          price: Number(it.unit_price),
          quantity: it.quantity,
          vegType: 'veg' as const,
          notes: it.notes || '',
        }));

        const subtotal = items.reduce((acc: number, it: any) => acc + it.price * it.quantity, 0);
        const tax = Math.round(subtotal * 0.05);

        return {
          id: o.id,
          orderNumber: o.order_number,
          tableId: o.table_id,
          tableNumber: o.tables?.table_number || 7,
          status: o.status as OrderStatus,
          items,
          subtotal,
          tax,
          serviceCharge: 0,
          estimatedMinutes: 18,
          total: subtotal + tax,
          customerNotes: o.notes,
          paymentStatus: 'unpaid' as const,
          createdAt: o.created_at,
          updatedAt: o.created_at,
        };
      });
    } catch (err) {
      console.warn('[SupabaseService] getOrders error:', err);
      return null;
    }
  }

  async createOrder(input: CreateOrderInput): Promise<Order | null> {
    const validated = createOrderSchema.parse(input);

    if (!this.isEnabled) return null;

    try {
      // 1. Get default restaurant
      const { data: rest } = await this.client
        .from('restaurants')
        .select('id')
        .eq('slug', 'aroma-saffron')
        .single();
      const restaurantId = rest?.id;

      // 2. Insert order
      const orderNumber = `#TF-${Math.floor(100 + Math.random() * 900)}`;
      const { data: newOrder, error: orderErr } = await this.client
        .from('orders')
        .insert({
          restaurant_id: restaurantId,
          table_id: validated.tableId,
          order_number: orderNumber,
          status: 'sent',
          source: validated.source,
          notes: validated.notes || null,
        })
        .select()
        .single();

      if (orderErr) throw orderErr;

      // 3. Insert order items
      const itemsToInsert = validated.items.map((it) => ({
        order_id: newOrder.id,
        menu_item_id: it.id.includes('-') && it.id.length > 30 ? it.id : null,
        name_snapshot: it.name,
        unit_price: it.price,
        quantity: it.quantity,
        notes: it.notes || null,
        item_status: 'pending',
      }));

      const { error: itemsErr } = await this.client
        .from('order_items')
        .insert(itemsToInsert);

      if (itemsErr) console.warn('[SupabaseService] order items insert warning:', itemsErr);

      // 4. Update table status to occupied
      await this.client
        .from('tables')
        .update({ status: 'occupied' })
        .eq('id', validated.tableId);

      const subtotal = validated.items.reduce((acc, it) => acc + it.price * it.quantity, 0);
      const tax = Math.round(subtotal * 0.05);

      const orderItems = validated.items.map((it) => ({
        menuItemId: it.id,
        name: it.name,
        price: it.price,
        quantity: it.quantity,
        vegType: it.vegType,
        notes: it.notes,
      }));

      return {
        id: newOrder.id,
        orderNumber,
        tableId: validated.tableId,
        tableNumber: validated.tableNumber,
        status: 'sent',
        items: orderItems,
        subtotal,
        tax,
        serviceCharge: 0,
        estimatedMinutes: 18,
        total: subtotal + tax,
        customerNotes: validated.notes,
        paymentStatus: 'unpaid',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    } catch (err) {
      console.warn('[SupabaseService] createOrder failed:', err);
      return null;
    }
  }

  async updateOrderStatus(orderId: string, status: OrderStatus) {
    if (!this.isEnabled) return false;
    try {
      const updates: any = { status };
      if (status === 'cooking') updates.accepted_at = new Date().toISOString();
      if (status === 'ready') updates.ready_at = new Date().toISOString();

      const { error } = await this.client
        .from('orders')
        .update(updates)
        .eq('id', orderId);

      if (error) throw error;
      return true;
    } catch (err) {
      console.warn('[SupabaseService] updateOrderStatus error:', err);
      return false;
    }
  }

  // ============================================================================
  // Waiter Calls
  // ============================================================================

  async getWaiterCalls() {
    if (!this.isEnabled) return null;
    try {
      const { data, error } = await this.client
        .from('waiter_requests')
        .select('*, tables(table_number)')
        .eq('status', 'open')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map((r: any) => ({
        tableId: r.table_id,
        tableNumber: r.tables?.table_number || 7,
        type: r.type,
        timestamp: r.created_at,
        waterType: r.details?.includes('Water') ? r.details.split(': ')[1] : undefined,
        cleanDetails: r.type === 'clean_table' ? r.details : undefined,
      }));
    } catch (err) {
      console.warn('[SupabaseService] getWaiterCalls error:', err);
      return null;
    }
  }

  async createWaiterCall(input: WaiterRequestInput) {
    if (!this.isEnabled) return false;
    try {
      const { data: rest } = await this.client
        .from('restaurants')
        .select('id')
        .eq('slug', 'aroma-saffron')
        .single();

      const details = input.type === 'water'
        ? `Water: ${input.waterType || 'Normal'}`
        : input.type === 'clean_table'
        ? input.cleanDetails || 'Table Cleaning'
        : input.details || 'Customer requested assistance';

      const { error } = await this.client
        .from('waiter_requests')
        .insert({
          restaurant_id: rest?.id,
          table_id: input.tableId,
          type: input.type,
          details,
          status: 'open',
        });

      if (error) throw error;

      await this.client
        .from('tables')
        .update({ status: input.type === 'clean_table' ? 'clean_table' : 'needs_help' })
        .eq('id', input.tableId);

      return true;
    } catch (err) {
      console.warn('[SupabaseService] createWaiterCall error:', err);
      return false;
    }
  }

  async resolveWaiterCall(tableId: string) {
    if (!this.isEnabled) return false;
    try {
      await this.client
        .from('waiter_requests')
        .update({ status: 'resolved', resolved_at: new Date().toISOString() })
        .eq('table_id', tableId)
        .eq('status', 'open');

      await this.client
        .from('tables')
        .update({ status: 'occupied' })
        .eq('id', tableId)
        .in('status', ['needs_help', 'clean_table']);

      return true;
    } catch (err) {
      console.warn('[SupabaseService] resolveWaiterCall error:', err);
      return false;
    }
  }

  // ============================================================================
  // Reviews
  // ============================================================================

  async getReviews(): Promise<OrderReview[] | null> {
    if (!this.isEnabled) return null;
    try {
      const { data, error } = await this.client
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (!data) return null;

      return data.map((r: any) => ({
        id: r.id,
        orderId: r.order_id || 'general',
        tableNumber: r.table_number,
        foodRating: r.food_rating,
        serviceRating: r.service_rating,
        ambianceRating: r.ambiance_rating,
        overallRating: r.overall_rating,
        comment: r.comment || '',
        createdAt: r.created_at,
      }));
    } catch (err) {
      console.warn('[SupabaseService] getReviews error:', err);
      return null;
    }
  }

  async submitReview(input: ReviewInput) {
    if (!this.isEnabled) return false;
    try {
      const { data: rest } = await this.client
        .from('restaurants')
        .select('id')
        .eq('slug', 'aroma-saffron')
        .single();

      const { error } = await this.client
        .from('reviews')
        .insert({
          restaurant_id: rest?.id,
          order_id: input.orderId || null,
          table_number: input.tableNumber,
          food_rating: input.foodRating,
          service_rating: input.serviceRating,
          ambiance_rating: input.ambianceRating,
          overall_rating: input.overallRating,
          comment: input.comment || null,
        });

      if (error) throw error;
      return true;
    } catch (err) {
      console.warn('[SupabaseService] submitReview error:', err);
      return false;
    }
  }
}

export const supabaseService = new SupabaseService();
