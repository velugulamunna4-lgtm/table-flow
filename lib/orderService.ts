import {
  Order,
  OrderStatus,
  OrderReview,
  WaterTankStatus,
  WaterRequest,
  StockItem,
  TableSessionSecurity,
} from '@/types';
import initialOrders from '@/data/mock/orders.json';
import initialReviews from '@/data/mock/reviews.json';
import initialStockData from '@/data/mock/stock.json';

const STORAGE_ORDERS_KEY = 'tableflow_orders_db';
const STORAGE_WAITER_CALLS_KEY = 'tableflow_waiter_calls';
const STORAGE_REVIEWS_KEY = 'tableflow_reviews_db';
const STORAGE_STOCK_KEY = 'tableflow_stock_db';
const STORAGE_WATER_TANK_KEY = 'tableflow_water_tank';
const STORAGE_SECURITY_KEY = 'tableflow_security_sessions';
const BROADCAST_CHANNEL_NAME = 'tableflow_rms_broadcast';

export interface WaiterCall {
  tableId: string;
  tableNumber: number;
  type: 'call_waiter' | 'water' | 'bill' | 'clean_table';
  timestamp: string;
  waterType?: string;
  cleanDetails?: string;
}

type OrderEvent =
  | { type: 'ORDERS_UPDATED'; payload: Order[] }
  | { type: 'WAITER_CALL_CREATED'; payload: WaiterCall }
  | { type: 'WAITER_CALL_CLEARED'; payload: { tableId: string } }
  | { type: 'ITEM_AVAILABILITY_CHANGED'; payload: { itemId: string; available: boolean } }
  | { type: 'REVIEWS_UPDATED'; payload: OrderReview[] }
  | { type: 'STOCK_UPDATED'; payload: StockItem[] }
  | { type: 'WATER_TANK_UPDATED'; payload: WaterTankStatus }
  | { type: 'SECURITY_UPDATED'; payload: Record<string, TableSessionSecurity> };

class OrderService {
  private channel: BroadcastChannel | null = null;
  private orderListeners: Array<(orders: Order[]) => void> = [];
  private waiterCallListeners: Array<(calls: WaiterCall[]) => void> = [];
  private itemAvailabilityListeners: Array<(data: { itemId: string; available: boolean }) => void> = [];
  private reviewListeners: Array<(reviews: OrderReview[]) => void> = [];
  private stockListeners: Array<(stock: StockItem[]) => void> = [];
  private waterTankListeners: Array<(tank: WaterTankStatus) => void> = [];
  private securityListeners: Array<(sessions: Record<string, TableSessionSecurity>) => void> = [];

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

      window.addEventListener('storage', (e) => {
        if (e.key === STORAGE_ORDERS_KEY && e.newValue) {
          this.notifyOrderListeners(JSON.parse(e.newValue));
        } else if (e.key === STORAGE_WAITER_CALLS_KEY && e.newValue) {
          this.notifyWaiterListeners(JSON.parse(e.newValue));
        } else if (e.key === STORAGE_REVIEWS_KEY && e.newValue) {
          this.notifyReviewListeners(JSON.parse(e.newValue));
        } else if (e.key === STORAGE_WATER_TANK_KEY && e.newValue) {
          this.notifyWaterTankListeners(JSON.parse(e.newValue));
        } else if (e.key === STORAGE_STOCK_KEY && e.newValue) {
          this.notifyStockListeners(JSON.parse(e.newValue));
        } else if (e.key === STORAGE_SECURITY_KEY && e.newValue) {
          this.notifySecurityListeners(JSON.parse(e.newValue));
        }
      });
    }
  }

  private handleBroadcastMessage(data: OrderEvent) {
    switch (data.type) {
      case 'ORDERS_UPDATED':
        this.notifyOrderListeners(data.payload);
        break;
      case 'WAITER_CALL_CREATED':
      case 'WAITER_CALL_CLEARED':
        this.notifyWaiterListeners(this.getWaiterCallsSync());
        break;
      case 'ITEM_AVAILABILITY_CHANGED':
        this.notifyItemAvailabilityListeners(data.payload);
        break;
      case 'REVIEWS_UPDATED':
        this.notifyReviewListeners(data.payload);
        break;
      case 'STOCK_UPDATED':
        this.notifyStockListeners(data.payload);
        break;
      case 'WATER_TANK_UPDATED':
        this.notifyWaterTankListeners(data.payload);
        break;
      case 'SECURITY_UPDATED':
        this.notifySecurityListeners(data.payload);
        break;
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
  private notifyReviewListeners(reviews: OrderReview[]) {
    this.reviewListeners.forEach((fn) => fn(reviews));
  }
  private notifyStockListeners(stock: StockItem[]) {
    this.stockListeners.forEach((fn) => fn(stock));
  }
  private notifyWaterTankListeners(tank: WaterTankStatus) {
    this.waterTankListeners.forEach((fn) => fn(tank));
  }
  private notifySecurityListeners(sessions: Record<string, TableSessionSecurity>) {
    this.securityListeners.forEach((fn) => fn(sessions));
  }

  // --- Orders Database Operations ---
  public async getOrders(): Promise<Order[]> {
    if (typeof window === 'undefined') return initialOrders as Order[];
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
    return orders.find(
      (o) => o.tableId === tableId && o.status !== 'served' && o.status !== 'cancelled'
    );
  }

  public async getTableOrderHistory(tableId: string): Promise<Order[]> {
    const orders = await this.getOrders();
    return orders.filter((o) => o.tableId === tableId);
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

    // Register active ODG (On-Dining Guest) Table Security Session
    await this.initTableSecuritySession(order.tableId, order.tableNumber);

    this.postMessage({ type: 'ORDERS_UPDATED', payload: updatedOrders });
    this.notifyOrderListeners(updatedOrders);

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
  }

  public async rejectOrderItem(orderId: string, itemId: string, reason: string): Promise<void> {
    const orders = await this.getOrders();
    const updatedOrders = orders.map((o) =>
      o.id === orderId ? { ...o, rejectionReason: reason, updatedAt: new Date().toISOString() } : o
    );

    this.persistOrders(updatedOrders);
    this.postMessage({ type: 'ORDERS_UPDATED', payload: updatedOrders });
    this.notifyOrderListeners(updatedOrders);
  }

  public subscribeToOrders(callback: (orders: Order[]) => void): () => void {
    this.orderListeners.push(callback);
    this.getOrders().then(callback);
    return () => {
      this.orderListeners = this.orderListeners.filter((cb) => cb !== callback);
    };
  }

  // --- Waiter Call & Water Request Operations ---
  public async callWaiter(
    tableId: string,
    tableNumber: number,
    type: 'call_waiter' | 'water' | 'bill' | 'clean_table',
    waterType?: string,
    cleanDetails?: string
  ): Promise<void> {
    const calls = this.getWaiterCallsSync();
    const existingIdx = calls.findIndex((c) => c.tableId === tableId);
    const newCall: WaiterCall = {
      tableId,
      tableNumber,
      type,
      timestamp: new Date().toISOString(),
      waterType,
      cleanDetails,
    };

    const updated = existingIdx > -1
      ? calls.map((c, i) => (i === existingIdx ? newCall : c))
      : [newCall, ...calls];

    this.persistWaiterCalls(updated);
    this.postMessage({ type: 'WAITER_CALL_CREATED', payload: newCall });
    this.notifyWaiterListeners(updated);
  }

  public async requestTableCleaning(
    tableId: string,
    tableNumber: number,
    cleanDetails?: string
  ): Promise<void> {
    return this.callWaiter(tableId, tableNumber, 'clean_table', undefined, cleanDetails);
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
  }

  public subscribeToItemAvailability(callback: (data: { itemId: string; available: boolean }) => void): () => void {
    this.itemAvailabilityListeners.push(callback);
    return () => {
      this.itemAvailabilityListeners = this.itemAvailabilityListeners.filter((cb) => cb !== callback);
    };
  }

  // --- Reviews & Feedback Operations ---
  public async getReviews(): Promise<OrderReview[]> {
    if (typeof window === 'undefined') return initialReviews as OrderReview[];
    const cached = localStorage.getItem(STORAGE_REVIEWS_KEY);
    if (!cached) {
      localStorage.setItem(STORAGE_REVIEWS_KEY, JSON.stringify(initialReviews));
      return initialReviews as OrderReview[];
    }
    try {
      return JSON.parse(cached) as OrderReview[];
    } catch {
      return initialReviews as OrderReview[];
    }
  }

  public async submitReview(newReview: Omit<OrderReview, 'id' | 'createdAt'>): Promise<OrderReview> {
    const reviews = await this.getReviews();
    const review: OrderReview = {
      ...newReview,
      id: `rev-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    const updated = [review, ...reviews];
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_REVIEWS_KEY, JSON.stringify(updated));
    }
    this.postMessage({ type: 'REVIEWS_UPDATED', payload: updated });
    this.notifyReviewListeners(updated);
    return review;
  }

  public subscribeToReviews(callback: (reviews: OrderReview[]) => void): () => void {
    this.reviewListeners.push(callback);
    this.getReviews().then(callback);
    return () => {
      this.reviewListeners = this.reviewListeners.filter((cb) => cb !== callback);
    };
  }

  // --- Stock Maintenance & Commercial Water Tank System ---
  public async getWaterTankStatus(): Promise<WaterTankStatus> {
    if (typeof window === 'undefined') return initialStockData.waterTank as WaterTankStatus;
    const cached = localStorage.getItem(STORAGE_WATER_TANK_KEY);
    if (!cached) {
      localStorage.setItem(STORAGE_WATER_TANK_KEY, JSON.stringify(initialStockData.waterTank));
      return initialStockData.waterTank as WaterTankStatus;
    }
    try {
      return JSON.parse(cached) as WaterTankStatus;
    } catch {
      return initialStockData.waterTank as WaterTankStatus;
    }
  }

  public async refillWaterTank(litersToAdd: number): Promise<WaterTankStatus> {
    const current = await this.getWaterTankStatus();
    const newLiters = Math.min(current.capacityLiters, current.currentLiters + litersToAdd);
    const updated: WaterTankStatus = {
      ...current,
      currentLiters: newLiters,
      lastRefilledAt: new Date().toISOString(),
      status: newLiters / current.capacityLiters > 0.4 ? 'optimal' : 'moderate',
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_WATER_TANK_KEY, JSON.stringify(updated));
    }
    this.postMessage({ type: 'WATER_TANK_UPDATED', payload: updated });
    this.notifyWaterTankListeners(updated);
    return updated;
  }

  public async modifyWaterTankCapacity(newCapacity: number): Promise<WaterTankStatus> {
    const current = await this.getWaterTankStatus();
    const updated: WaterTankStatus = {
      ...current,
      capacityLiters: newCapacity,
      currentLiters: Math.min(current.currentLiters, newCapacity),
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_WATER_TANK_KEY, JSON.stringify(updated));
    }
    this.postMessage({ type: 'WATER_TANK_UPDATED', payload: updated });
    this.notifyWaterTankListeners(updated);
    return updated;
  }

  public subscribeToWaterTank(callback: (tank: WaterTankStatus) => void): () => void {
    this.waterTankListeners.push(callback);
    this.getWaterTankStatus().then(callback);
    return () => {
      this.waterTankListeners = this.waterTankListeners.filter((cb) => cb !== callback);
    };
  }

  public async getStockItems(): Promise<StockItem[]> {
    if (typeof window === 'undefined') return initialStockData.stockItems as StockItem[];
    const cached = localStorage.getItem(STORAGE_STOCK_KEY);
    if (!cached) {
      localStorage.setItem(STORAGE_STOCK_KEY, JSON.stringify(initialStockData.stockItems));
      return initialStockData.stockItems as StockItem[];
    }
    try {
      return JSON.parse(cached) as StockItem[];
    } catch {
      return initialStockData.stockItems as StockItem[];
    }
  }

  public async restockItem(itemId: string, addQty: number): Promise<StockItem[]> {
    const stock = await this.getStockItems();
    const updated = stock.map((item) => {
      if (item.id === itemId) {
        const nextQty = item.currentQty + addQty;
        return {
          ...item,
          currentQty: nextQty,
          status: (nextQty > item.minThreshold ? 'in_stock' : 'low_stock') as 'in_stock' | 'low_stock',
          lastRestocked: new Date().toISOString(),
        };
      }
      return item;
    });

    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_STOCK_KEY, JSON.stringify(updated));
    }
    this.postMessage({ type: 'STOCK_UPDATED', payload: updated });
    this.notifyStockListeners(updated);
    return updated;
  }

  public subscribeToStock(callback: (stock: StockItem[]) => void): () => void {
    this.stockListeners.push(callback);
    this.getStockItems().then(callback);
    return () => {
      this.stockListeners = this.stockListeners.filter((cb) => cb !== callback);
    };
  }

  // --- Table ODG & Session Security ---
  public async getSecuritySessions(): Promise<Record<string, TableSessionSecurity>> {
    if (typeof window === 'undefined') return {};
    const cached = localStorage.getItem(STORAGE_SECURITY_KEY);
    if (!cached) return {};
    try {
      return JSON.parse(cached);
    } catch {
      return {};
    }
  }

  public async getTableSecurity(tableId: string): Promise<TableSessionSecurity> {
    const sessions = await this.getSecuritySessions();
    if (sessions[tableId]) return sessions[tableId];

    // Default open session
    return {
      tableId,
      tableNumber: parseInt(tableId, 10) || 7,
      isOccupiedUnderODG: false,
      sessionToken: `token_${tableId}`,
      sessionPin: `410${tableId}`,
      guestCount: 1,
      sessionStartedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 1000 * 60 * 90).toISOString(),
      isLocked: false,
    };
  }

  public async initTableSecuritySession(tableId: string, tableNumber: number): Promise<TableSessionSecurity> {
    const sessions = await this.getSecuritySessions();
    const session: TableSessionSecurity = {
      tableId,
      tableNumber,
      isOccupiedUnderODG: true,
      sessionToken: `token_${tableId}_${Date.now()}`,
      sessionPin: `${Math.floor(1000 + Math.random() * 9000)}`,
      guestCount: 1,
      sessionStartedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 1000 * 60 * 90).toISOString(),
      isLocked: true,
    };

    const updated = { ...sessions, [tableId]: session };
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_SECURITY_KEY, JSON.stringify(updated));
    }
    this.postMessage({ type: 'SECURITY_UPDATED', payload: updated });
    this.notifySecurityListeners(updated);
    return session;
  }

  public async setTableLock(tableId: string, isLocked: boolean): Promise<void> {
    const sessions = await this.getSecuritySessions();
    const current = sessions[tableId] || (await this.getTableSecurity(tableId));
    const updated = {
      ...sessions,
      [tableId]: { ...current, isLocked },
    };
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_SECURITY_KEY, JSON.stringify(updated));
    }
    this.postMessage({ type: 'SECURITY_UPDATED', payload: updated });
    this.notifySecurityListeners(updated);
  }

  public async resetTableSession(tableId: string): Promise<void> {
    const sessions = await this.getSecuritySessions();
    const updated = { ...sessions };
    delete updated[tableId];
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_SECURITY_KEY, JSON.stringify(updated));
    }
    this.postMessage({ type: 'SECURITY_UPDATED', payload: updated });
    this.notifySecurityListeners(updated);
  }

  public subscribeToSecurity(callback: (sessions: Record<string, TableSessionSecurity>) => void): () => void {
    this.securityListeners.push(callback);
    this.getSecuritySessions().then(callback);
    return () => {
      this.securityListeners = this.securityListeners.filter((cb) => cb !== callback);
    };
  }

  // --- Internal Helpers ---
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
