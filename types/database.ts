export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      restaurants: {
        Row: {
          id: string;
          slug: string;
          name: string;
          logo_url: string | null;
          currency: string;
          gst_rate: number;
          service_charge_rate: number;
          theme: string;
          hours: Json | null;
          address: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          logo_url?: string | null;
          currency?: string;
          gst_rate?: number;
          service_charge_rate?: number;
          theme?: string;
          hours?: Json | null;
          address?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          logo_url?: string | null;
          currency?: string;
          gst_rate?: number;
          service_charge_rate?: number;
          theme?: string;
          hours?: Json | null;
          address?: string | null;
          created_at?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          restaurant_id: string;
          full_name: string;
          role: 'owner' | 'admin' | 'waiter' | 'kitchen';
          created_at: string;
        };
        Insert: {
          id: string;
          restaurant_id: string;
          full_name: string;
          role: 'owner' | 'admin' | 'waiter' | 'kitchen';
          created_at?: string;
        };
        Update: {
          id?: string;
          restaurant_id?: string;
          full_name?: string;
          role?: 'owner' | 'admin' | 'waiter' | 'kitchen';
          created_at?: string;
        };
      };
      tables: {
        Row: {
          id: string;
          restaurant_id: string;
          table_number: number;
          capacity: number;
          qr_token: string | null;
          token_expires_at: string | null;
          status: 'free' | 'occupied' | 'needs_help' | 'bill_pending' | 'clean_table';
          created_at: string;
        };
        Insert: {
          id?: string;
          restaurant_id: string;
          table_number: number;
          capacity?: number;
          qr_token?: string | null;
          token_expires_at?: string | null;
          status?: 'free' | 'occupied' | 'needs_help' | 'bill_pending' | 'clean_table';
          created_at?: string;
        };
        Update: {
          id?: string;
          restaurant_id?: string;
          table_number?: number;
          capacity?: number;
          qr_token?: string | null;
          token_expires_at?: string | null;
          status?: 'free' | 'occupied' | 'needs_help' | 'bill_pending' | 'clean_table';
          created_at?: string;
        };
      };
      menu_categories: {
        Row: {
          id: string;
          restaurant_id: string;
          name: string;
          icon: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          restaurant_id: string;
          name: string;
          icon?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          restaurant_id?: string;
          name?: string;
          icon?: string | null;
          sort_order?: number;
          created_at?: string;
        };
      };
      menu_items: {
        Row: {
          id: string;
          restaurant_id: string;
          category_id: string | null;
          name: string;
          name_translations: Json | null;
          description: string | null;
          price: number;
          is_veg: boolean;
          spice_level: number;
          image_url: string | null;
          is_special: boolean;
          is_available: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          restaurant_id: string;
          category_id?: string | null;
          name: string;
          name_translations?: Json | null;
          description?: string | null;
          price: number;
          is_veg?: boolean;
          spice_level?: number;
          image_url?: string | null;
          is_special?: boolean;
          is_available?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          restaurant_id?: string;
          category_id?: string | null;
          name?: string;
          name_translations?: Json | null;
          description?: string | null;
          price?: number;
          is_veg?: boolean;
          spice_level?: number;
          image_url?: string | null;
          is_special?: boolean;
          is_available?: boolean;
          created_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          restaurant_id: string;
          table_session_id: string | null;
          table_id: string;
          order_number: string;
          status: 'sent' | 'accepted' | 'cooking' | 'ready' | 'served' | 'cancelled';
          source: 'customer' | 'waiter';
          notes: string | null;
          created_at: string;
          updated_at: string;
          accepted_at: string | null;
          ready_at: string | null;
        };
        Insert: {
          id?: string;
          restaurant_id: string;
          table_session_id?: string | null;
          table_id: string;
          order_number: string;
          status?: 'sent' | 'accepted' | 'cooking' | 'ready' | 'served' | 'cancelled';
          source?: 'customer' | 'waiter';
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
          accepted_at?: string | null;
          ready_at?: string | null;
        };
        Update: {
          id?: string;
          restaurant_id?: string;
          table_session_id?: string | null;
          table_id?: string;
          order_number?: string;
          status?: 'sent' | 'accepted' | 'cooking' | 'ready' | 'served' | 'cancelled';
          source?: 'customer' | 'waiter';
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
          accepted_at?: string | null;
          ready_at?: string | null;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          menu_item_id: string | null;
          name_snapshot: string;
          unit_price: number;
          quantity: number;
          notes: string | null;
          item_status: 'pending' | 'accepted' | 'rejected' | 'cooking' | 'ready';
          rejection_reason: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          menu_item_id?: string | null;
          name_snapshot: string;
          unit_price: number;
          quantity: number;
          notes?: string | null;
          item_status?: 'pending' | 'accepted' | 'rejected' | 'cooking' | 'ready';
          rejection_reason?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          menu_item_id?: string | null;
          name_snapshot?: string;
          unit_price?: number;
          quantity?: number;
          notes?: string | null;
          item_status?: 'pending' | 'accepted' | 'rejected' | 'cooking' | 'ready';
          rejection_reason?: string | null;
          created_at?: string;
        };
      };
      waiter_requests: {
        Row: {
          id: string;
          restaurant_id: string;
          table_id: string;
          type: 'water' | 'bill' | 'help' | 'clean_table' | 'call_waiter';
          details: string | null;
          status: 'open' | 'resolved';
          created_at: string;
          resolved_at: string | null;
        };
        Insert: {
          id?: string;
          restaurant_id: string;
          table_id: string;
          type: 'water' | 'bill' | 'help' | 'clean_table' | 'call_waiter';
          details?: string | null;
          status?: 'open' | 'resolved';
          created_at?: string;
          resolved_at?: string | null;
        };
        Update: {
          id?: string;
          restaurant_id?: string;
          table_id?: string;
          type?: 'water' | 'bill' | 'help' | 'clean_table' | 'call_waiter';
          details?: string | null;
          status?: 'open' | 'resolved';
          created_at?: string;
          resolved_at?: string | null;
        };
      };
      reviews: {
        Row: {
          id: string;
          restaurant_id: string;
          order_id: string | null;
          table_number: number;
          food_rating: number;
          service_rating: number;
          ambiance_rating: number;
          overall_rating: number;
          comment: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          restaurant_id: string;
          order_id?: string | null;
          table_number: number;
          food_rating: number;
          service_rating: number;
          ambiance_rating: number;
          overall_rating: number;
          comment?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          restaurant_id?: string;
          order_id?: string | null;
          table_number?: number;
          food_rating?: number;
          service_rating?: number;
          ambiance_rating?: number;
          overall_rating?: number;
          comment?: string | null;
          created_at?: string;
        };
      };
    };
  };
}
