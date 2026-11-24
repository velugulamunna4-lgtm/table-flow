export type OrderStatus = 'sent' | 'accepted' | 'cooking' | 'ready' | 'served' | 'cancelled';

export type VegType = 'veg' | 'non-veg';

export interface MenuItem {
  id: string;
  name: string;
  nameTranslations?: {
    te?: string;
    ta?: string;
    hi?: string;
  };
  description: string;
  descriptionTranslations?: {
    te?: string;
    ta?: string;
    hi?: string;
  };
  price: number;
  costPrice?: number; // Cost price for gross profit calculation
  category: 'specials' | 'starters' | 'mains' | 'biryani' | 'desserts' | 'drinks';
  vegType: VegType;
  spiceLevel: 0 | 1 | 2 | 3; // 0=mild, 3=extra spicy
  isSpecial?: boolean;
  isAvailable: boolean;
  image: string;
  emojiFallback: string;
  preparationTimeMinutes: number;
  station?: 'tandoor' | 'wok' | 'biryani' | 'breads' | 'bar' | 'dessert';
  calories?: number;
  tags?: string[];
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  notes?: string;
}

export interface OrderItem {
  menuItemId: string;
  name: string;
  price: number;
  costPrice?: number;
  quantity: number;
  vegType: VegType;
  notes?: string;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. "#TF-104"
  tableId: string;
  tableNumber: number;
  items: OrderItem[];
  subtotal: number;
  tax: number; // GST 5%
  serviceCharge: number;
  total: number;
  status: OrderStatus;
  createdAt: string; // ISO string
  updatedAt: string;
  estimatedMinutes: number;
  customerNotes?: string;
  paymentStatus: 'unpaid' | 'paid_online' | 'paid_counter';
  paymentMethod?: 'upi' | 'card' | 'wallet' | 'counter';
  rejectionReason?: string;
  qrToken?: string;
}

export interface Table {
  id: string;
  number: number;
  capacity: number;
  status: 'free' | 'occupied' | 'needs_help' | 'bill_pending';
  currentOrderId?: string;
  activeHelpRequest?: {
    type: 'call_waiter' | 'water' | 'bill' | 'cleaning';
    requestedAt: string;
  };
}

export interface RestaurantConfig {
  id: string;
  name: string;
  tagline: string;
  logo: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  currencySymbol: string;
  currencyCode: string;
  gstRatePercent: number;
  serviceChargePercent: number;
  defaultTheme: 'sunny-family' | 'modern-green';
  activeTheme: 'sunny-family' | 'modern-green';
  defaultLanguage: 'en' | 'te' | 'ta' | 'hi';
  splitBillPolicy: 'customer_and_counter' | 'counter_only';
  requireWaiterVerification: boolean;
  openingHours: string;
}

export interface BillSplit {
  type: 'equal' | 'by_item' | 'custom';
  numberOfPeople?: number;
  shares: {
    personId: string;
    personName: string;
    items?: OrderItem[];
    amount: number;
    paid: boolean;
    qrPayload?: string;
  }[];
}

// --- Customer Review & Feedback System ---
export interface OrderReview {
  id: string;
  orderId?: string;
  tableId: string;
  tableNumber: number;
  overallRating: number; // 1 to 5
  foodRating: number;    // 1 to 5
  ambianceRating: number;// 1 to 5
  serviceRating: number; // 1 to 5
  tags: string[];        // e.g. "Fresh & Piping Hot", "Prompt Service"
  customerName?: string;
  comment?: string;
  createdAt: string;
}

// --- Water Tank & Commercial Utility System ---
export interface WaterTankStatus {
  currentLiters: number;
  capacityLiters: number;
  roHealthPercent: number;
  tdsPpm: number;
  lastRefilledAt: string;
  status: 'optimal' | 'moderate' | 'critical';
  dailyConsumptionLiters: number;
}

export interface WaterRequest {
  id: string;
  tableId: string;
  tableNumber: number;
  waterType: 'normal' | 'chilled' | 'warm' | 'mineral';
  status: 'pending' | 'served';
  requestedAt: string;
}

// --- Stock & Inventory Maintenance ---
export interface StockItem {
  id: string;
  name: string;
  category: 'staples' | 'dairy' | 'poultry' | 'spices' | 'beverages' | 'utility';
  currentQty: number;
  minThreshold: number;
  unit: string; // 'kg' | 'L' | 'cylinders' | 'units'
  costPerUnit: number;
  status: 'in_stock' | 'low_stock' | 'critical';
  lastRestocked: string;
}

// --- Table ODG & Session Security ---
export interface TableSessionSecurity {
  tableId: string;
  tableNumber: number;
  isOccupiedUnderODG: boolean; // Active On-Dining Guest session
  sessionToken: string;
  sessionPin: string; // e.g. "4107" to prevent rogue scanning
  guestCount: number;
  sessionStartedAt: string;
  expiresAt: string;
  isLocked: boolean; // Security lock toggle
}
