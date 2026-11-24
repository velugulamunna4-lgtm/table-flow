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
