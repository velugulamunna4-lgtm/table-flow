import { Order, OrderStatus } from '@/types';
import initialOrders from '@/data/mock/orders.json';

const STORAGE_ORDERS_KEY = 'tableflow_orders_db';
const STORAGE_WAITER_CALLS_KEY = 'tableflow_waiter_calls';
const BROADCAST_CHANNEL_NAME = 'tableflow_rms_broadcast';

export interface WaiterCall {
  tableId: string;
  tableNumber: number;
  type: 'call_waiter' | 'water' | 'bill';
  timestamp: string;
}

type OrderEvent =
  | { type: 'ORDERS_UPDATED'; payload: Order[] }
  | { type: 'WAITER_CALL_CREATED'; payload: WaiterCall }
  | { type: 'WAITER_CALL_CLEARED'; payload: { tableId: string } }
  | { type: 'ITEM_AVAILABILITY_CHANGED'; payload: { itemId: string; available: boolean } };

class OrderService {
  private channel: BroadcastChannel | null = null;
  private orderListeners: Array<(orders: Order[]) => void> = [];
  private waiterCallListeners: Array<(calls: WaiterCall[]) => void> = [];
  private itemAvailabilityListeners: Array<(data: { itemId: string; available: boolean }) => void> = [];

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        this.channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
        this.channel.onmessage = (event: MessageEvent<OrderEvent>) => {
          this.handleBroadcastMessage(event.data);
        };
      } catch (e) {
        console.warn('BroadcastChannel not supported in this environment, falling back to local storage events', e);
      }

      // Also listen to window storage event for cross-tab fallback
      window.addEventListener('storage', (e) => {
        if (e.key === STORAGE_ORDERS_KEY && e.newValue) {
          const orders = JSON.parse(e.newValue);
          this.notifyOrderListeners(orders);
        } else if (e.key === STORAGE_WAITER_CALLS_KEY && e.newValue) {
          const calls = JSON.parse(e.newValue);
          this.notifyWaiterListeners(calls);
        }
      });
    }
  }

  private handleBroadcastMessage(data: OrderEvent) {
    if (data.type === 'ORDERS_UPDATED') {
      this.notifyOrderListeners(data.payload);
    } else if (data.type === 'WAITER_CALL_CREATED' || data.type === 'WAITER_CALL_CLEARED') {
      this.notifyWaiterListeners(this.getWaiterCallsSync());
    } else if (data.type === 'ITEM_AVAILABILITY_CHANGED') {
      this.notifyItemAvailabilityListeners(data.payload);
    }
  }

  private notifyOrderListeners(orders: Order[]) {
    this.orderListeners.forEach((fn) => fn(orders));
  }

  private notifyWaiterListeners(calls: WaiterCall[]) {
    this.waiterCallListeners.forEach((fn) => fn(calls));
  }

  private notifyItemAvailabilityListeners(payload: { itemId: string; available: boolean }) {
    this.itemAvailabilityListeners.forEach((fn) => fn(payload));
  }

  // --- Orders Database Operations ---
  public async getOrders(): Promise<Order[]> {
    if (typeof window === 'undefined') {
      return initialOrders as Order[];
    }
    const cached = localStorage.getItem(STORAGE_ORDERS_KEY);
    if (!cached) {
      localStorage.setItem(STORAGE_ORDERS_KEY, JSON.stringify(initialOrders));
      return initialOrders as Order[];
    }
    try {
      return JSON.parse(cached) as Order[];
    } catch {
      return initialOrders as Order[];
    }
  }

  public async getOrderById(orderId: string): Promise<Order | undefined> {
    const orders = await this.getOrders();
    return orders.find((o) => o.id === orderId);
  }

  public async getOrderByTable(tableId: string): Promise<Order | undefined> {
    const orders = await this.getOrders();
    // Return latest active order for this table
    return orders.find(
      (o) => o.tableId === tableId && o.status !== 'served' && o.status !== 'cancelled'
    );
  }

  public async placeOrder(newOrder: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt'>): Promise<Order> {
    const orders = await this.getOrders();
    const orderNumber = `#TF-${100 + orders.length + 1}`;
    const id = `order_${Date.now()}`;
    const now = new Date().toISOString();

    const order: Order = {
      ...newOrder,
      id,
      orderNumber,
      createdAt: now,
      updatedAt: now,
    };

    const updatedOrders = [order, ...orders];
    this.persistOrders(updatedOrders);

    // Broadcast live event to Kitchen & Waiter displays
    this.postMessage({ type: 'ORDERS_UPDATED', payload: updatedOrders });
    this.notifyOrderListeners(updatedOrders);

    /* 
     * TODO [Phase 2 Backend Integration]:
     * Replace with:
     * const response = await fetch('/api/orders', {
     *   method: 'POST',
     *   headers: { 'Content-Type': 'application/json' },
     *   body: JSON.stringify(order)
     * });
     * return await response.json();
     */
    return order;
  }

  public async updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
    const orders = await this.getOrders();
    const updatedOrders = orders.map((o) =>
      o.id === orderId ? { ...o, status, updatedAt: new Date().toISOString() } : o
    );

    this.persistOrders(updatedOrders);
    this.postMessage({ type: 'ORDERS_UPDATED', payload: updatedOrders });
    this.notifyOrderListeners(updatedOrders);

    /* 
     * TODO [Phase 2 Backend Integration]:
     * await fetch(`/api/orders/${orderId}/status`, {
     *   method: 'PATCH',
     *   headers: { 'Content-Type': 'application/json' },
     *   body: JSON.stringify({ status })
     * });
     */
  }

  public async rejectOrderItem(orderId: string, itemId: string, reason: string): Promise<void> {
    const orders = await this.getOrders();
    const updatedOrders = orders.map((o) => {
      if (o.id === orderId) {
        return {
          ...o,
          rejectionReason: reason,
          updatedAt: new Date().toISOString(),
        };
      }
      return o;
    });

    this.persistOrders(updatedOrders);
    this.postMessage({ type: 'ORDERS_UPDATED', payload: updatedOrders });
    this.notifyOrderListeners(updatedOrders);
  }

  public subscribeToOrders(callback: (orders: Order[]) => void): () => void {
    this.orderListeners.push(callback);
    // Initial emission
    this.getOrders().then(callback);

    return () => {
      this.orderListeners = this.orderListeners.filter((cb) => cb !== callback);
    };
  }

  // --- Waiter Call Operations ---
  public async callWaiter(tableId: string, tableNumber: number, type: 'call_waiter' | 'water' | 'bill'): Promise<void> {
    const calls = this.getWaiterCallsSync();
    const existingIdx = calls.findIndex((c) => c.tableId === tableId);
    const newCall: WaiterCall = {
      tableId,
      tableNumber,
      type,
      timestamp: new Date().toISOString(),
    };

    let updated: WaiterCall[];
    if (existingIdx > -1) {
      updated = calls.map((c, i) => (i === existingIdx ? newCall : c));
    } else {
      updated = [newCall, ...calls];
    }

    this.persistWaiterCalls(updated);
    this.postMessage({ type: 'WAITER_CALL_CREATED', payload: newCall });
    this.notifyWaiterListeners(updated);
  }

  public async clearWaiterCall(tableId: string): Promise<void> {
    const calls = this.getWaiterCallsSync();
    const updated = calls.filter((c) => c.tableId !== tableId);
    this.persistWaiterCalls(updated);
    this.postMessage({ type: 'WAITER_CALL_CLEARED', payload: { tableId } });
    this.notifyWaiterListeners(updated);
  }

  public subscribeToWaiterCalls(callback: (calls: WaiterCall[]) => void): () => void {
    this.waiterCallListeners.push(callback);
    callback(this.getWaiterCallsSync());

    return () => {
      this.waiterCallListeners = this.waiterCallListeners.filter((cb) => cb !== callback);
    };
  }

  // --- Kitchen 86 / Sold-Out Operations ---
  public async toggleItemAvailability(itemId: string, available: boolean): Promise<void> {
    this.postMessage({
      type: 'ITEM_AVAILABILITY_CHANGED',
      payload: { itemId, available },
    });
    this.notifyItemAvailabilityListeners({ itemId, available });

    /* 
     * TODO [Phase 2 Backend Integration]:
     * await fetch(`/api/menu/${itemId}/availability`, {
     *   method: 'PATCH',
     *   headers: { 'Content-Type': 'application/json' },
     *   body: JSON.stringify({ available })
     * });
     */
  }

  public subscribeToItemAvailability(callback: (data: { itemId: string; available: boolean }) => void): () => void {
    this.itemAvailabilityListeners.push(callback);
    return () => {
      this.itemAvailabilityListeners = this.itemAvailabilityListeners.filter((cb) => cb !== callback);
    };
  }

  // --- Helpers ---
  private getWaiterCallsSync(): WaiterCall[] {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(STORAGE_WAITER_CALLS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private persistOrders(orders: Order[]) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_ORDERS_KEY, JSON.stringify(orders));
    }
  }

  private persistWaiterCalls(calls: WaiterCall[]) {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_WAITER_CALLS_KEY, JSON.stringify(calls));
    }
  }

  private postMessage(event: OrderEvent) {
    if (this.channel) {
      try {
        this.channel.postMessage(event);
      } catch (err) {
        console.warn('Failed to post message on BroadcastChannel', err);
      }
    }
  }
}

export const orderService = new OrderService();
