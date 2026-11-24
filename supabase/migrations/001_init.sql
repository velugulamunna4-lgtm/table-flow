-- ==============================================================================
-- Table Flow: 001_init.sql
-- Production Database Schema Migration (Supabase PostgreSQL / Region ap-south-1)
-- ==============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Restaurants Table
CREATE TABLE IF NOT EXISTS public.restaurants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    logo_url TEXT,
    currency TEXT DEFAULT 'INR',
    gst_rate NUMERIC(5,2) DEFAULT 5.00,
    service_charge_rate NUMERIC(5,2) DEFAULT 0.00,
    theme TEXT DEFAULT 'sunny-family',
    hours JSONB DEFAULT '{"open": "11:00 AM", "close": "11:00 PM"}'::jsonb,
    address TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Staff Profiles (Linked to auth.users in Supabase)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    restaurant_id UUID REFERENCES public.restaurants(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'waiter', 'kitchen')),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Tables
CREATE TABLE IF NOT EXISTS public.tables (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    table_number INT NOT NULL,
    capacity INT DEFAULT 4,
    qr_token TEXT UNIQUE,
    token_expires_at TIMESTAMPTZ,
    status TEXT NOT NULL CHECK (status IN ('free', 'occupied', 'needs_help', 'bill_pending', 'clean_table')) DEFAULT 'free',
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE (restaurant_id, table_number)
);

-- 5. Menu Categories
CREATE TABLE IF NOT EXISTS public.menu_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    icon TEXT,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. Menu Items
CREATE TABLE IF NOT EXISTS public.menu_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    category_id UUID REFERENCES public.menu_categories(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    name_translations JSONB DEFAULT '{}'::jsonb,
    description TEXT,
    price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
    is_veg BOOLEAN DEFAULT TRUE,
    spice_level INT CHECK (spice_level BETWEEN 0 AND 3) DEFAULT 0,
    image_url TEXT,
    is_special BOOLEAN DEFAULT FALSE,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 7. Table Sessions (Customer Dining Visit)
CREATE TABLE IF NOT EXISTS public.table_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    table_id UUID NOT NULL REFERENCES public.tables(id) ON DELETE CASCADE,
    started_at TIMESTAMPTZ DEFAULT now(),
    ended_at TIMESTAMPTZ,
    status TEXT NOT NULL CHECK (status IN ('open', 'closed')) DEFAULT 'open',
    guest_count INT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 8. Orders
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    table_session_id UUID REFERENCES public.table_sessions(id) ON DELETE SET NULL,
    table_id UUID NOT NULL REFERENCES public.tables(id) ON DELETE CASCADE,
    order_number TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('sent', 'accepted', 'cooking', 'ready', 'served', 'cancelled')) DEFAULT 'sent',
    source TEXT NOT NULL CHECK (source IN ('customer', 'waiter')) DEFAULT 'customer',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    accepted_at TIMESTAMPTZ,
    ready_at TIMESTAMPTZ
);

-- 9. Order Items
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    menu_item_id UUID REFERENCES public.menu_items(id) ON DELETE SET NULL,
    name_snapshot TEXT NOT NULL,
    unit_price NUMERIC(10,2) NOT NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    notes TEXT,
    item_status TEXT NOT NULL CHECK (item_status IN ('pending', 'accepted', 'rejected', 'cooking', 'ready')) DEFAULT 'pending',
    rejection_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 10. Bills
CREATE TABLE IF NOT EXISTS public.bills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_session_id UUID UNIQUE REFERENCES public.table_sessions(id) ON DELETE CASCADE,
    subtotal NUMERIC(10,2) NOT NULL,
    gst_amount NUMERIC(10,2) NOT NULL,
    service_charge_amount NUMERIC(10,2) DEFAULT 0.00,
    total NUMERIC(10,2) NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('open', 'paid')) DEFAULT 'open',
    created_at TIMESTAMPTZ DEFAULT now(),
    paid_at TIMESTAMPTZ
);

-- 11. Payments
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bill_id UUID NOT NULL REFERENCES public.bills(id) ON DELETE CASCADE,
    amount NUMERIC(10,2) NOT NULL,
    method TEXT NOT NULL CHECK (method IN ('upi', 'card', 'wallet', 'cash', 'counter')),
    provider_order_id TEXT,
    provider_payment_id TEXT,
    status TEXT NOT NULL CHECK (status IN ('created', 'captured', 'failed')) DEFAULT 'created',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 12. Bill Splits
CREATE TABLE IF NOT EXISTS public.bill_splits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bill_id UUID NOT NULL REFERENCES public.bills(id) ON DELETE CASCADE,
    label TEXT NOT NULL,
    amount NUMERIC(10,2) NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('unpaid', 'paid')) DEFAULT 'unpaid',
    payment_id UUID REFERENCES public.payments(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 13. Waiter Requests (Assistance, Water, Bill, Clean Table)
CREATE TABLE IF NOT EXISTS public.waiter_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
    table_id UUID NOT NULL REFERENCES public.tables(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('water', 'bill', 'help', 'clean_table', 'call_waiter')),
    details TEXT,
    status TEXT NOT NULL CHECK (status IN ('open', 'resolved')) DEFAULT 'open',
    created_at TIMESTAMPTZ DEFAULT now(),
    resolved_at TIMESTAMPTZ
);

-- 14. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_orders_restaurant_status ON public.orders(restaurant_id, status);
CREATE INDEX IF NOT EXISTS idx_orders_table_session ON public.orders(table_session_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_restaurant_cat ON public.menu_items(restaurant_id, category_id);
CREATE INDEX IF NOT EXISTS idx_waiter_requests_rest_status ON public.waiter_requests(restaurant_id, status);
CREATE INDEX IF NOT EXISTS idx_tables_restaurant ON public.tables(restaurant_id);

-- 15. Trigger for updated_at on orders
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_set_orders_updated_at ON public.orders;
CREATE TRIGGER trigger_set_orders_updated_at
    BEFORE UPDATE ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 16. Helper Function: current_restaurant_id()
CREATE OR REPLACE FUNCTION public.current_restaurant_id()
RETURNS UUID AS $$
    SELECT restaurant_id FROM public.profiles WHERE id = auth.uid() LIMIT 1;
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- 17. Row Level Security (RLS) Configuration
ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.table_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bill_splits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waiter_requests ENABLE ROW LEVEL SECURITY;

-- 18. Public Read Policies for Customer Ordering
CREATE POLICY "Public Read Restaurants" ON public.restaurants
    FOR SELECT TO anon, authenticated
    USING (true);

CREATE POLICY "Public Read Menu Categories" ON public.menu_categories
    FOR SELECT TO anon, authenticated
    USING (true);

CREATE POLICY "Public Read Menu Items" ON public.menu_items
    FOR SELECT TO anon, authenticated
    USING (true);

CREATE POLICY "Public Read Tables" ON public.tables
    FOR SELECT TO anon, authenticated
    USING (true);

-- 19. Staff Policies: Profiles can read and write within their restaurant
CREATE POLICY "Staff Manage Profiles" ON public.profiles
    FOR ALL TO authenticated
    USING (id = auth.uid() OR restaurant_id = public.current_restaurant_id());

CREATE POLICY "Staff Manage Tables" ON public.tables
    FOR ALL TO authenticated
    USING (restaurant_id = public.current_restaurant_id());

CREATE POLICY "Staff Manage Categories" ON public.menu_categories
    FOR ALL TO authenticated
    USING (restaurant_id = public.current_restaurant_id());

CREATE POLICY "Staff Manage Menu Items" ON public.menu_items
    FOR ALL TO authenticated
    USING (restaurant_id = public.current_restaurant_id());

CREATE POLICY "Staff Manage Orders" ON public.orders
    FOR ALL TO authenticated
    USING (restaurant_id = public.current_restaurant_id());

CREATE POLICY "Staff Manage Order Items" ON public.order_items
    FOR ALL TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.orders o
        WHERE o.id = order_items.order_id
        AND o.restaurant_id = public.current_restaurant_id()
    ));

CREATE POLICY "Staff Manage Waiter Requests" ON public.waiter_requests
    FOR ALL TO authenticated
    USING (restaurant_id = public.current_restaurant_id());

CREATE POLICY "Staff Manage Bills" ON public.bills
    FOR ALL TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.table_sessions ts
        WHERE ts.id = bills.table_session_id
        AND ts.restaurant_id = public.current_restaurant_id()
    ));

CREATE POLICY "Staff Manage Payments" ON public.payments
    FOR ALL TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.bills b
        JOIN public.table_sessions ts ON ts.id = b.table_session_id
        WHERE b.id = payments.bill_id
        AND ts.restaurant_id = public.current_restaurant_id()
    ));

-- 20. Supabase Realtime Publication
DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
EXCEPTION WHEN duplicate_object THEN
    NULL;
END $$;

DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.order_items;
EXCEPTION WHEN duplicate_object THEN
    NULL;
END $$;

DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.waiter_requests;
EXCEPTION WHEN duplicate_object THEN
    NULL;
END $$;

DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.menu_items;
EXCEPTION WHEN duplicate_object THEN
    NULL;
END $$;

DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.tables;
EXCEPTION WHEN duplicate_object THEN
    NULL;
END $$;
