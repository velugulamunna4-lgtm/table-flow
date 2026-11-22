import { create } from 'zustand';
import { MenuItem, CartItem, VegType } from '@/types';
import menuData from '@/data/mock/menu.json';
import { restaurantConfig } from '@/config/restaurant.config';
import { Language } from '@/lib/i18n';

// --- Cart Store (Persisted per tableId in localStorage) ---
interface CartState {
  activeTableId: string | null;
  items: CartItem[];
  initForTable: (tableId: string) => void;
  addItem: (menuItem: MenuItem, notes?: string) => void;
  removeItem: (menuItemId: string) => void;
  updateQuantity: (menuItemId: string, quantity: number) => void;
  updateItemNotes: (menuItemId: string, notes: string) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getTax: () => number;
  getServiceCharge: () => number;
  getTotal: () => number;
  getItemCount: () => number;
}

const getStorageKey = (tableId: string) => `tableflow_cart_${tableId}`;

export const useCartStore = create<CartState>((set, get) => ({
  activeTableId: null,
  items: [],

  initForTable: (tableId: string) => {
    if (typeof window === 'undefined') return;
    try {
      const stored = localStorage.getItem(getStorageKey(tableId));
      const parsedItems = stored ? JSON.parse(stored) : [];
      set({ activeTableId: tableId, items: parsedItems });
    } catch (e) {
      console.error('Failed to load cart from localStorage', e);
      set({ activeTableId: tableId, items: [] });
    }
  },

  addItem: (menuItem: MenuItem, notes?: string) => {
    const { activeTableId, items } = get();
    const existingIndex = items.findIndex((i) => i.menuItem.id === menuItem.id);
    let updated: CartItem[];

    if (existingIndex > -1) {
      updated = items.map((item, idx) =>
        idx === existingIndex
          ? { ...item, quantity: item.quantity + 1, notes: notes || item.notes }
          : item
      );
    } else {
      updated = [...items, { menuItem, quantity: 1, notes }];
    }

    set({ items: updated });
    if (activeTableId && typeof window !== 'undefined') {
      localStorage.setItem(getStorageKey(activeTableId), JSON.stringify(updated));
    }
  },

  removeItem: (menuItemId: string) => {
    const { activeTableId, items } = get();
    const updated = items.filter((i) => i.menuItem.id !== menuItemId);
    set({ items: updated });
    if (activeTableId && typeof window !== 'undefined') {
      localStorage.setItem(getStorageKey(activeTableId), JSON.stringify(updated));
    }
  },

  updateQuantity: (menuItemId: string, quantity: number) => {
    const { activeTableId, items } = get();
    let updated: CartItem[];
    if (quantity <= 0) {
      updated = items.filter((i) => i.menuItem.id !== menuItemId);
    } else {
      updated = items.map((i) => (i.menuItem.id === menuItemId ? { ...i, quantity } : i));
    }
    set({ items: updated });
    if (activeTableId && typeof window !== 'undefined') {
      localStorage.setItem(getStorageKey(activeTableId), JSON.stringify(updated));
    }
  },

  updateItemNotes: (menuItemId: string, notes: string) => {
    const { activeTableId, items } = get();
    const updated = items.map((i) => (i.menuItem.id === menuItemId ? { ...i, notes } : i));
    set({ items: updated });
    if (activeTableId && typeof window !== 'undefined') {
      localStorage.setItem(getStorageKey(activeTableId), JSON.stringify(updated));
    }
  },

  clearCart: () => {
    const { activeTableId } = get();
    set({ items: [] });
    if (activeTableId && typeof window !== 'undefined') {
      localStorage.removeItem(getStorageKey(activeTableId));
    }
  },

  getSubtotal: () => {
    return get().items.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);
  },

  getTax: () => {
    const subtotal = get().getSubtotal();
    return Math.round((subtotal * restaurantConfig.gstRatePercent) / 100);
  },

  getServiceCharge: () => {
    const subtotal = get().getSubtotal();
    return Math.round((subtotal * restaurantConfig.serviceChargePercent) / 100);
  },

  getTotal: () => {
    return get().getSubtotal() + get().getTax() + get().getServiceCharge();
  },

  getItemCount: () => {
    return get().items.reduce((count, item) => count + item.quantity, 0);
  },
}));

// --- Theme Store ---
interface ThemeState {
  currentTheme: 'sunny-family' | 'modern-green';
  setTheme: (theme: 'sunny-family' | 'modern-green') => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  currentTheme: restaurantConfig.defaultTheme,
  setTheme: (theme) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('tableflow_theme', theme);
      document.documentElement.setAttribute('data-theme', theme);
    }
    set({ currentTheme: theme });
  },
}));

// --- Language Store ---
interface LanguageState {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const useLanguageStore = create<LanguageState>((set) => ({
  language: restaurantConfig.defaultLanguage,
  setLanguage: (lang) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('tableflow_lang', lang);
    }
    set({ language: lang });
  },
}));

// --- Menu Store (with live 86 / Sold Out synchronization) ---
interface MenuState {
  menuItems: MenuItem[];
  searchQuery: string;
  selectedCategory: string;
  dietaryFilter: 'all' | 'veg' | 'non-veg';
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string) => void;
  setDietaryFilter: (filter: 'all' | 'veg' | 'non-veg') => void;
  setItemAvailability: (itemId: string, available: boolean) => void;
  updateMenuItems: (items: MenuItem[]) => void;
}

export const useMenuStore = create<MenuState>((set) => ({
  menuItems: menuData as MenuItem[],
  searchQuery: '',
  selectedCategory: 'specials',
  dietaryFilter: 'all',

  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
  setDietaryFilter: (dietaryFilter) => set({ dietaryFilter }),

  setItemAvailability: (itemId: string, available: boolean) => {
    set((state) => ({
      menuItems: state.menuItems.map((item) =>
        item.id === itemId ? { ...item, isAvailable: available } : item
      ),
    }));
  },

  updateMenuItems: (items: MenuItem[]) => set({ menuItems: items }),
}));

// --- Game & Points Store ---
interface GameState {
  spicePoints: number;
  unlockedDiscountPercent: number;
  addPoints: (points: number) => void;
}

export const useGameStore = create<GameState>((set) => ({
  spicePoints: 0,
  unlockedDiscountPercent: 0,
  addPoints: (points) =>
    set((state) => {
      const newTotal = state.spicePoints + points;
      const discount = newTotal >= 100 ? 15 : newTotal >= 50 ? 10 : 0;
      return { spicePoints: newTotal, unlockedDiscountPercent: discount };
    }),
}));
