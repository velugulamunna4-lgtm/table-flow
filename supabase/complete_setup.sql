-- ==============================================================================

-- Table Flow: Complete Database Setup & Seed Migration

-- Paste this entire file into the Supabase SQL Editor and click RUN

-- ==============================================================================



-- PART 1: CORE SCHEMA & TABLES

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




-- PART 2: AUTH TRIGGER FOR AUTOMATIC PROFILE CREATION

-- ==============================================================================
-- Table Flow: 002_auth_trigger.sql
-- Auto-create public.profiles entry when a new user signs up via Supabase Auth
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    default_rest_id UUID;
    user_role TEXT;
    user_name TEXT;
BEGIN
    -- 1. Determine restaurant ID (fallback to first restaurant if not in metadata)
    default_rest_id := (NEW.raw_user_meta_data->>'restaurant_id')::UUID;
    IF default_rest_id IS NULL THEN
        SELECT id INTO default_rest_id FROM public.restaurants WHERE slug = 'aroma-saffron' LIMIT 1;
    END IF;

    -- 2. Extract role and full name from user metadata
    user_role := COALESCE(NEW.raw_user_meta_data->>'role', 'waiter');
    user_name := COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1));

    -- Validate role constraint
    IF user_role NOT IN ('owner', 'admin', 'waiter', 'kitchen') THEN
        user_role := 'waiter';
    END IF;

    -- 3. Insert new staff profile
    INSERT INTO public.profiles (id, restaurant_id, full_name, role)
    VALUES (NEW.id, default_rest_id, user_name, user_role)
    ON CONFLICT (id) DO UPDATE
    SET full_name = EXCLUDED.full_name,
        role = EXCLUDED.role;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger execution after auth.users insert
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();




-- PART 3: STORAGE BUCKETS & POLICIES

-- ==============================================================================
-- Table Flow: 003_storage.sql
-- Storage bucket for menu item food photography with public access policies
-- ==============================================================================

-- 1. Insert food-images storage bucket if not already present
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'food-images',
    'food-images',
    TRUE,
    5242880, -- 5 MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
ON CONFLICT (id) DO UPDATE
SET public = TRUE;

-- 2. Storage Object RLS Policies
CREATE POLICY "Public Food Images Read" ON storage.objects
    FOR SELECT TO public
    USING (bucket_id = 'food-images');

CREATE POLICY "Authenticated Staff Food Images Upload" ON storage.objects
    FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'food-images');

CREATE POLICY "Authenticated Staff Food Images Update" ON storage.objects
    FOR UPDATE TO authenticated
    USING (bucket_id = 'food-images');

CREATE POLICY "Authenticated Staff Food Images Delete" ON storage.objects
    FOR DELETE TO authenticated
    USING (bucket_id = 'food-images');




-- PART 4: SEED RESTAURANT, TABLES, CATEGORIES & MENU ITEMS

-- ==============================================================================
-- Table Flow: seed.sql
-- Seed data for Restaurant Aroma & Saffron, 12 Tables, Categories, and Menu Items
-- ==============================================================================

DO $$
DECLARE
    v_rest_id UUID := 'a0000000-0000-0000-0000-000000000001';
    v_cat_specials UUID := 'c0000000-0000-0000-0000-000000000001';
    v_cat_starters UUID := 'c0000000-0000-0000-0000-000000000002';
    v_cat_mains UUID := 'c0000000-0000-0000-0000-000000000003';
    v_cat_biryani UUID := 'c0000000-0000-0000-0000-000000000004';
    v_cat_desserts UUID := 'c0000000-0000-0000-0000-000000000005';
    v_cat_drinks UUID := 'c0000000-0000-0000-0000-000000000006';
BEGIN

    -- 1. Insert Restaurant
    INSERT INTO public.restaurants (id, slug, name, logo_url, currency, gst_rate, service_charge_rate, theme, address)
    VALUES (
        v_rest_id,
        'aroma-saffron',
        'Aroma & Saffron',
        'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
        'INR',
        5.00,
        0.00,
        'sunny-family',
        'Road No. 36, Jubilee Hills, Hyderabad'
    )
    ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name;

    -- 2. Insert 12 Tables
    INSERT INTO public.tables (id, restaurant_id, table_number, capacity, qr_token, status)
    VALUES ('t0000000-0000-0000-0000-000000000001', v_rest_id, 1, 4, 'table_1_token_placeholder', 'free')
    ON CONFLICT (restaurant_id, table_number) DO NOTHING;
    INSERT INTO public.tables (id, restaurant_id, table_number, capacity, qr_token, status)
    VALUES ('t0000000-0000-0000-0000-000000000002', v_rest_id, 2, 4, 'table_2_token_placeholder', 'free')
    ON CONFLICT (restaurant_id, table_number) DO NOTHING;
    INSERT INTO public.tables (id, restaurant_id, table_number, capacity, qr_token, status)
    VALUES ('t0000000-0000-0000-0000-000000000003', v_rest_id, 3, 4, 'table_3_token_placeholder', 'free')
    ON CONFLICT (restaurant_id, table_number) DO NOTHING;
    INSERT INTO public.tables (id, restaurant_id, table_number, capacity, qr_token, status)
    VALUES ('t0000000-0000-0000-0000-000000000004', v_rest_id, 4, 4, 'table_4_token_placeholder', 'free')
    ON CONFLICT (restaurant_id, table_number) DO NOTHING;
    INSERT INTO public.tables (id, restaurant_id, table_number, capacity, qr_token, status)
    VALUES ('t0000000-0000-0000-0000-000000000005', v_rest_id, 5, 4, 'table_5_token_placeholder', 'free')
    ON CONFLICT (restaurant_id, table_number) DO NOTHING;
    INSERT INTO public.tables (id, restaurant_id, table_number, capacity, qr_token, status)
    VALUES ('t0000000-0000-0000-0000-000000000006', v_rest_id, 6, 4, 'table_6_token_placeholder', 'free')
    ON CONFLICT (restaurant_id, table_number) DO NOTHING;
    INSERT INTO public.tables (id, restaurant_id, table_number, capacity, qr_token, status)
    VALUES ('t0000000-0000-0000-0000-000000000007', v_rest_id, 7, 4, 'table_7_token_placeholder', 'free')
    ON CONFLICT (restaurant_id, table_number) DO NOTHING;
    INSERT INTO public.tables (id, restaurant_id, table_number, capacity, qr_token, status)
    VALUES ('t0000000-0000-0000-0000-000000000008', v_rest_id, 8, 4, 'table_8_token_placeholder', 'free')
    ON CONFLICT (restaurant_id, table_number) DO NOTHING;
    INSERT INTO public.tables (id, restaurant_id, table_number, capacity, qr_token, status)
    VALUES ('t0000000-0000-0000-0000-000000000009', v_rest_id, 9, 4, 'table_9_token_placeholder', 'free')
    ON CONFLICT (restaurant_id, table_number) DO NOTHING;
    INSERT INTO public.tables (id, restaurant_id, table_number, capacity, qr_token, status)
    VALUES ('t0000000-0000-0000-0000-000000000010', v_rest_id, 10, 4, 'table_10_token_placeholder', 'free')
    ON CONFLICT (restaurant_id, table_number) DO NOTHING;
    INSERT INTO public.tables (id, restaurant_id, table_number, capacity, qr_token, status)
    VALUES ('t0000000-0000-0000-0000-000000000011', v_rest_id, 11, 4, 'table_11_token_placeholder', 'free')
    ON CONFLICT (restaurant_id, table_number) DO NOTHING;
    INSERT INTO public.tables (id, restaurant_id, table_number, capacity, qr_token, status)
    VALUES ('t0000000-0000-0000-0000-000000000012', v_rest_id, 12, 4, 'table_12_token_placeholder', 'free')
    ON CONFLICT (restaurant_id, table_number) DO NOTHING;

    -- 3. Insert Categories
    INSERT INTO public.menu_categories (id, restaurant_id, name, icon, sort_order) VALUES (v_cat_specials, v_rest_id, 'Specials', 'Sparkles', 1) ON CONFLICT (id) DO NOTHING;
    INSERT INTO public.menu_categories (id, restaurant_id, name, icon, sort_order) VALUES (v_cat_starters, v_rest_id, 'Starters', 'Flame', 2) ON CONFLICT (id) DO NOTHING;
    INSERT INTO public.menu_categories (id, restaurant_id, name, icon, sort_order) VALUES (v_cat_mains, v_rest_id, 'Main Course', 'Utensils', 3) ON CONFLICT (id) DO NOTHING;
    INSERT INTO public.menu_categories (id, restaurant_id, name, icon, sort_order) VALUES (v_cat_biryani, v_rest_id, 'Biryani', 'Bowl', 4) ON CONFLICT (id) DO NOTHING;
    INSERT INTO public.menu_categories (id, restaurant_id, name, icon, sort_order) VALUES (v_cat_desserts, v_rest_id, 'Desserts', 'IceCream', 5) ON CONFLICT (id) DO NOTHING;
    INSERT INTO public.menu_categories (id, restaurant_id, name, icon, sort_order) VALUES (v_cat_drinks, v_rest_id, 'Drinks', 'Coffee', 6) ON CONFLICT (id) DO NOTHING;

    -- 4. Insert Menu Items
    INSERT INTO public.menu_items (id, restaurant_id, category_id, name, name_translations, description, price, is_veg, spice_level, image_url, is_special, is_available)
    VALUES ('m0000000-0000-0000-0000-000000000001', v_rest_id, v_cat_specials, 'Nawabi Murgh Malai Tikka', '{"te":"నవాబీ ముర్గ్ మలై టిక్కా","ta":"நவாபி முர்க் மலை டிக்கா","hi":"नवाबी मुर्ग मलाई टिक्का"}'::jsonb, 'Tender chicken fillets steeped in rich cashew cream, green cardamom, and smoked over charcoal embers.', 460, false, 1, 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=800&auto=format&fit=crop&q=80', true, true)
    ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, is_available = EXCLUDED.is_available;
    INSERT INTO public.menu_items (id, restaurant_id, category_id, name, name_translations, description, price, is_veg, spice_level, image_url, is_special, is_available)
    VALUES ('m0000000-0000-0000-0000-000000000002', v_rest_id, v_cat_specials, 'Royal Nizami Paneer Pasanda', '{"te":"రాయల్ నిజామీ పన్నీర్ పసందా","ta":"ராயல் நிஸாமி பன்னீர் பசந்தா","hi":"रॉयल निज़ामी पनीर पसंदा"}'::jsonb, 'Stuffed cottage cheese triangles layered with dry fruits and simmered in a velvety saffron gravy.', 420, true, 1, 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&auto=format&fit=crop&q=80', true, true)
    ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, is_available = EXCLUDED.is_available;
    INSERT INTO public.menu_items (id, restaurant_id, category_id, name, name_translations, description, price, is_veg, spice_level, image_url, is_special, is_available)
    VALUES ('m0000000-0000-0000-0000-000000000003', v_rest_id, v_cat_specials, 'Guntur Gongura Mutton Fry', '{"te":"గుంటూరు గోంగూర మటన్ ఫ్రై","ta":"குண்டூர் கோங்குரா மட்டன் ஃப்ரை","hi":"गुंटूर गोंगुरा मटन फ्राई"}'::jsonb, 'Slow-cooked tender Andhra mutton tossed with tangy sorrel leaves and fiery crushed Guntur red chilies.', 540, false, 3, 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&auto=format&fit=crop&q=80', true, true)
    ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, is_available = EXCLUDED.is_available;
    INSERT INTO public.menu_items (id, restaurant_id, category_id, name, name_translations, description, price, is_veg, spice_level, image_url, is_special, is_available)
    VALUES ('m0000000-0000-0000-0000-000000000004', v_rest_id, v_cat_specials, 'Avadhi Dum Kebab Platter', '{"te":"అవధి దమ్ కబాబ్ పళ్ళెం","ta":"அவதி தம் கபாப் தட்டு","hi":"अवधी दम कबाब थाली"}'::jsonb, 'A grand assortment of Kakori kebabs, Galouti melts, and Zafrani paneer with smoked mint chutney.', 680, false, 2, 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80', true, false)
    ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, is_available = EXCLUDED.is_available;
    INSERT INTO public.menu_items (id, restaurant_id, category_id, name, name_translations, description, price, is_veg, spice_level, image_url, is_special, is_available)
    VALUES ('m0000000-0000-0000-0000-000000000005', v_rest_id, v_cat_specials, 'Coastal Prawn Ghee Roast', '{"te":"రొయ్యల నెయ్యి రోస్ట్","ta":"நெய் வறுத்த இறால்","hi":"झींगा घी रोस्ट"}'::jsonb, 'Tiger prawns roasted in pure Mangalorean desi ghee with a fiery, aromatic byadagi chili and garlic paste.', 580, false, 2, 'https://images.unsplash.com/photo-1559742811-822873691df8?w=800&auto=format&fit=crop&q=80', true, true)
    ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, is_available = EXCLUDED.is_available;
    INSERT INTO public.menu_items (id, restaurant_id, category_id, name, name_translations, description, price, is_veg, spice_level, image_url, is_special, is_available)
    VALUES ('m0000000-0000-0000-0000-000000000006', v_rest_id, v_cat_starters, 'Crispy Paneer Kurkure', '{"te":"కుర్కురే పన్నీర్ వేపుడు","ta":"மொருமொரு பன்னீர் குர்குரே","hi":"कुरकुरा पनीर बाइट्स"}'::jsonb, 'Golden spiced paneer cubes encased in crunchy papad crust, dusted with chatpata masala.', 320, true, 1, 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=800&auto=format&fit=crop&q=80', false, true)
    ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, is_available = EXCLUDED.is_available;
    INSERT INTO public.menu_items (id, restaurant_id, category_id, name, name_translations, description, price, is_veg, spice_level, image_url, is_special, is_available)
    VALUES ('m0000000-0000-0000-0000-000000000007', v_rest_id, v_cat_starters, 'Hyderabadi Chicken 65', '{"te":"హైదరాబాదీ చికెన్ 65","ta":"ஹைதராபாதி சிக்கன் 65","hi":"हैदराबादी चिकन 65"}'::jsonb, 'Crisp marinated chicken bites tossed with fresh curry leaves, crushed garlic, and green chilies.', 360, false, 2, 'https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?w=800&auto=format&fit=crop&q=80', false, true)
    ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, is_available = EXCLUDED.is_available;
    INSERT INTO public.menu_items (id, restaurant_id, category_id, name, name_translations, description, price, is_veg, spice_level, image_url, is_special, is_available)
    VALUES ('m0000000-0000-0000-0000-000000000008', v_rest_id, v_cat_starters, 'Dahi Ke Kebab', '{"te":"దహీ కే కబాబ్","ta":"தயிர் கபாப்","hi":"दही के कबाब"}'::jsonb, 'Melt-in-mouth hung yogurt patties infused with roasted cumin, fresh coriander, and pomegranate seeds.', 290, true, 0, 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80', false, true)
    ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, is_available = EXCLUDED.is_available;
    INSERT INTO public.menu_items (id, restaurant_id, category_id, name, name_translations, description, price, is_veg, spice_level, image_url, is_special, is_available)
    VALUES ('m0000000-0000-0000-0000-000000000009', v_rest_id, v_cat_starters, 'Tandoori Malai Broccoli', '{"te":"తందూరీ మలై బ్రకోలీ","ta":"தந்தூரி மலை ப்ரோக்கோலி","hi":"तंदूरी मलाई ब्रोकोली"}'::jsonb, 'Char-grilled broccoli florets marinated in processed cheese, hung curd, and toasted cardamom.', 310, true, 1, 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&auto=format&fit=crop&q=80', false, true)
    ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, is_available = EXCLUDED.is_available;
    INSERT INTO public.menu_items (id, restaurant_id, category_id, name, name_translations, description, price, is_veg, spice_level, image_url, is_special, is_available)
    VALUES ('m0000000-0000-0000-0000-000000000010', v_rest_id, v_cat_starters, 'Amritsari Machhi Fry', '{"te":"అమృత్‌సరి చేప వేపుడు","ta":"அமிர்தசரஸ் மீன் வறுவல்","hi":"अमृतसरी मच्छी फ्राई"}'::jsonb, 'Carom-seed scented crispy river sole fillets tossed in gram flour batter and fried golden.', 440, false, 2, 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800&auto=format&fit=crop&q=80', false, true)
    ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, is_available = EXCLUDED.is_available;
    INSERT INTO public.menu_items (id, restaurant_id, category_id, name, name_translations, description, price, is_veg, spice_level, image_url, is_special, is_available)
    VALUES ('m0000000-0000-0000-0000-000000000011', v_rest_id, v_cat_starters, 'Delhi Chandni Chowk Samosa Chaat', '{"te":"సమోసా చాట్","ta":"சமோசா சாட்","hi":"चांदनी चौक समोसा चाट"}'::jsonb, 'Crushed hot potato samosas smothered in spiced chana masala, chilled yogurt, mint, and saunth chutneys.', 210, true, 1, 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop&q=80', false, true)
    ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, is_available = EXCLUDED.is_available;
    INSERT INTO public.menu_items (id, restaurant_id, category_id, name, name_translations, description, price, is_veg, spice_level, image_url, is_special, is_available)
    VALUES ('m0000000-0000-0000-0000-000000000012', v_rest_id, v_cat_mains, 'Old Delhi Butter Chicken', '{"te":"ఓల్డ్ ఢిల్లీ బటర్ చికెన్","ta":"பட்டர் சிக்கன்","hi":"पुरानी दिल्ली बटर चिकन"}'::jsonb, 'Charcoal grilled chicken simmered in a luscious satin tomato sauce enriched with butter and fenugreek.', 440, false, 1, 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=800&auto=format&fit=crop&q=80', false, true)
    ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, is_available = EXCLUDED.is_available;
    INSERT INTO public.menu_items (id, restaurant_id, category_id, name, name_translations, description, price, is_veg, spice_level, image_url, is_special, is_available)
    VALUES ('m0000000-0000-0000-0000-000000000013', v_rest_id, v_cat_mains, 'Slow-Simmered Dal Makhani', '{"te":"దాల్ మఖనీ","ta":"தால் மக்கானி","hi":"धीमी आंच वाली दाल मखनी"}'::jsonb, 'Whole black lentils slow-cooked over wood embers for 24 hours with churned white butter and cream.', 340, true, 0, 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80', false, true)
    ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, is_available = EXCLUDED.is_available;
    INSERT INTO public.menu_items (id, restaurant_id, category_id, name, name_translations, description, price, is_veg, spice_level, image_url, is_special, is_available)
    VALUES ('m0000000-0000-0000-0000-000000000014', v_rest_id, v_cat_mains, 'Paneer Lababdar', '{"te":"పన్నీర్ లబబ్దార్","ta":"பன்னீர் லபாப்தார்","hi":"पनीर लबाबदार"}'::jsonb, 'Cottage cheese chunks cooked in a chunky onion-tomato gravy with grated paneer and freshly ground spices.', 380, true, 1, 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=800&auto=format&fit=crop&q=80', false, true)
    ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, is_available = EXCLUDED.is_available;
    INSERT INTO public.menu_items (id, restaurant_id, category_id, name, name_translations, description, price, is_veg, spice_level, image_url, is_special, is_available)
    VALUES ('m0000000-0000-0000-0000-000000000015', v_rest_id, v_cat_mains, 'Kadai Gosht', '{"te":"కడాయి మటన్","ta":"கடாய் மட்டன்","hi":"कड़ाही गोश्त"}'::jsonb, 'Tender lamb cuts wok-tossed with crushed coriander seeds, Kashmiri chili, bell peppers, and onion petals.', 520, false, 2, 'https://images.unsplash.com/photo-1545247181-516773ca838b?w=800&auto=format&fit=crop&q=80', false, true)
    ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, is_available = EXCLUDED.is_available;
    INSERT INTO public.menu_items (id, restaurant_id, category_id, name, name_translations, description, price, is_veg, spice_level, image_url, is_special, is_available)
    VALUES ('m0000000-0000-0000-0000-000000000016', v_rest_id, v_cat_mains, 'Amritsari Garlic Butter Naan', '{"te":"వెల్లుల్లి బటర్ నాన్","ta":"கார்லிக் பட்டர் நான்","hi":"लहसुन बटर नान"}'::jsonb, 'Tandoor-baked leavened flatbread brushed with crushed garlic butter and fresh coriander sprigs.', 85, true, 0, 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&auto=format&fit=crop&q=80', false, true)
    ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, is_available = EXCLUDED.is_available;
    INSERT INTO public.menu_items (id, restaurant_id, category_id, name, name_translations, description, price, is_veg, spice_level, image_url, is_special, is_available)
    VALUES ('m0000000-0000-0000-0000-000000000017', v_rest_id, v_cat_biryani, 'Hyderabadi Chicken Dum Biryani', '{"te":"హైదరాబాదీ చికెన్ దమ్ బిర్యానీ","ta":"ஹைதராபாதி சிக்கன் தம் பிரியாணி","hi":"हैदराबादी चिकन दम बिरयानी"}'::jsonb, 'Fragrant long-grain aged basmati rice cooked on sealed dum with spiced marinated chicken and saffron ghee.', 390, false, 2, 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80', true, true)
    ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, is_available = EXCLUDED.is_available;
    INSERT INTO public.menu_items (id, restaurant_id, category_id, name, name_translations, description, price, is_veg, spice_level, image_url, is_special, is_available)
    VALUES ('m0000000-0000-0000-0000-000000000018', v_rest_id, v_cat_biryani, 'Kacche Gosht Ki Mutton Biryani', '{"te":"కచ్చే గోష్ట్ మటన్ బిర్యానీ","ta":"கச்சே கோஷ்ட் மட்டன் பிரியாணி","hi":"कच्चे गोश्त की मटन बिरयानी"}'::jsonb, 'Succulent lamb pieces marinated overnight, layered with saffron basmati and slow cooked on charcoal embers.', 490, false, 2, 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=800&auto=format&fit=crop&q=80', false, true)
    ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, is_available = EXCLUDED.is_available;
    INSERT INTO public.menu_items (id, restaurant_id, category_id, name, name_translations, description, price, is_veg, spice_level, image_url, is_special, is_available)
    VALUES ('m0000000-0000-0000-0000-000000000019', v_rest_id, v_cat_biryani, 'Nawabi Subz Paneer Biryani', '{"te":"నవాబీ పన్నీర్ వెజ్ బిర్యానీ","ta":"பன்னீர் காய்கறி பிரியாணி","hi":"नवाबी पनीर वेज बिरयानी"}'::jsonb, 'Carrot, beans, cauliflower and marinated tandoori paneer layered with mint, brown onions, and fragrant rice.', 320, true, 1, 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800&auto=format&fit=crop&q=80', false, true)
    ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, is_available = EXCLUDED.is_available;
    INSERT INTO public.menu_items (id, restaurant_id, category_id, name, name_translations, description, price, is_veg, spice_level, image_url, is_special, is_available)
    VALUES ('m0000000-0000-0000-0000-000000000020', v_rest_id, v_cat_desserts, 'Saffron Angoori Rasmalai', '{"te":"కుంకుమపువ్వు రసమలై","ta":"குங்குமப்பூ ரசமலாய்","hi":"केसर अंगूरी रसमलाई"}'::jsonb, 'Feather-soft cottage cheese dumplings soaked in saffron infused cardamom clotted milk, topped with pistachios.', 180, true, 0, 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800&auto=format&fit=crop&q=80', false, true)
    ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, is_available = EXCLUDED.is_available;
    INSERT INTO public.menu_items (id, restaurant_id, category_id, name, name_translations, description, price, is_veg, spice_level, image_url, is_special, is_available)
    VALUES ('m0000000-0000-0000-0000-000000000021', v_rest_id, v_cat_desserts, 'Hot Gulab Jamun with Malai Rabri', '{"te":"గులాబ్ జామున్ రబ్రీ తో","ta":"குலாப் ஜாமுன் ரப்ரி","hi":"गरम गुलाब जामुन मलाई रबड़ी"}'::jsonb, 'Warm golden khoya dumplings soaked in rose water syrup, served over chilled slow-reduced thickened rabri.', 190, true, 0, 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80', false, true)
    ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, is_available = EXCLUDED.is_available;
    INSERT INTO public.menu_items (id, restaurant_id, category_id, name, name_translations, description, price, is_veg, spice_level, image_url, is_special, is_available)
    VALUES ('m0000000-0000-0000-0000-000000000022', v_rest_id, v_cat_desserts, 'Alphonso Mango Kulfi Pop', '{"te":"మామిడి కుల్ఫీ","ta":"மாம்பழ குல்ஃபி","hi":"आम कुल्फी स्टिक"}'::jsonb, 'Traditional pot-frozen clotted milk pop infused with Ratnagiri Alphonso mango pulp and cardamom.', 140, true, 0, 'https://images.unsplash.com/photo-1505394033641-40c6ad1178d7?w=800&auto=format&fit=crop&q=80', false, true)
    ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, is_available = EXCLUDED.is_available;
    INSERT INTO public.menu_items (id, restaurant_id, category_id, name, name_translations, description, price, is_veg, spice_level, image_url, is_special, is_available)
    VALUES ('m0000000-0000-0000-0000-000000000023', v_rest_id, v_cat_drinks, 'Thick Alphonso Mango Lassi', '{"te":"మామిడి లస్సీ","ta":"மாம்பழ லஸ்ஸி","hi":"गाढ़ा आम की लस्सी"}'::jsonb, 'Creamy churned farm yogurt blended with sweet Alphonso pulp, green cardamom, and crushed pistachios.', 150, true, 0, 'https://images.unsplash.com/photo-1546173159-315724a31696?w=800&auto=format&fit=crop&q=80', false, true)
    ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, is_available = EXCLUDED.is_available;
    INSERT INTO public.menu_items (id, restaurant_id, category_id, name, name_translations, description, price, is_veg, spice_level, image_url, is_special, is_available)
    VALUES ('m0000000-0000-0000-0000-000000000024', v_rest_id, v_cat_drinks, 'Spiced Tadka Buttermilk (Chaas)', '{"te":"పోపు మజ్జిగ","ta":"மசாலா மோர்","hi":"तड़का छाछ"}'::jsonb, 'Refreshing chilled buttermilk tempered with roasted cumin, mustard seeds, ginger, and fresh mint leaves.', 90, true, 1, 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=800&auto=format&fit=crop&q=80', false, true)
    ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, is_available = EXCLUDED.is_available;
    INSERT INTO public.menu_items (id, restaurant_id, category_id, name, name_translations, description, price, is_veg, spice_level, image_url, is_special, is_available)
    VALUES ('m0000000-0000-0000-0000-000000000025', v_rest_id, v_cat_drinks, 'Masala Shikanji Soda', '{"te":"మసాలా లెమన్ సోడా","ta":"மசாலா லெமன் சோடா","hi":"मसाला शिकंजी सोडा"}'::jsonb, 'Freshly squeezed Meyer lemons, rock salt, roasted cumin, and mint topped with sparkling soda water.', 110, true, 0, 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=800&auto=format&fit=crop&q=80', false, true)
    ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, is_available = EXCLUDED.is_available;
    INSERT INTO public.menu_items (id, restaurant_id, category_id, name, name_translations, description, price, is_veg, spice_level, image_url, is_special, is_available)
    VALUES ('m0000000-0000-0000-0000-000000000026', v_rest_id, v_cat_drinks, 'Dum Irani Chai', '{"te":"దమ్ ఇరానీ ఛాయ్","ta":"ஈரானி டீ","hi":"दम ईरानी चाय"}'::jsonb, 'Authentic Hyderabadi slow-steamed tea decoction poured over rich evaporated mawa milk.', 60, true, 0, 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=800&auto=format&fit=crop&q=80', false, true)
    ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, is_available = EXCLUDED.is_available;

END $$;
