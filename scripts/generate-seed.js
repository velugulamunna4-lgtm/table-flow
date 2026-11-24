const fs = require('fs');
const path = require('path');

const menuPath = path.join(__dirname, '..', 'data', 'mock', 'menu.json');
const menu = JSON.parse(fs.readFileSync(menuPath, 'utf8'));

function sqlEscape(str) {
  if (str === null || str === undefined) return 'NULL';
  return "'" + String(str).replace(/'/g, "''") + "'";
}

let sql = `-- ==============================================================================
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
`;

for (let i = 1; i <= 12; i++) {
  const tableUuid = `t0000000-0000-0000-0000-${String(i).padStart(12, '0')}`;
  const qrPlaceholder = `table_${i}_token_placeholder`;
  sql += `    INSERT INTO public.tables (id, restaurant_id, table_number, capacity, qr_token, status)
    VALUES ('${tableUuid}', v_rest_id, ${i}, 4, '${qrPlaceholder}', 'free')
    ON CONFLICT (restaurant_id, table_number) DO NOTHING;
`;
}

sql += `
    -- 3. Insert Categories
    INSERT INTO public.menu_categories (id, restaurant_id, name, icon, sort_order) VALUES (v_cat_specials, v_rest_id, 'Specials', 'Sparkles', 1) ON CONFLICT (id) DO NOTHING;
    INSERT INTO public.menu_categories (id, restaurant_id, name, icon, sort_order) VALUES (v_cat_starters, v_rest_id, 'Starters', 'Flame', 2) ON CONFLICT (id) DO NOTHING;
    INSERT INTO public.menu_categories (id, restaurant_id, name, icon, sort_order) VALUES (v_cat_mains, v_rest_id, 'Main Course', 'Utensils', 3) ON CONFLICT (id) DO NOTHING;
    INSERT INTO public.menu_categories (id, restaurant_id, name, icon, sort_order) VALUES (v_cat_biryani, v_rest_id, 'Biryani', 'Bowl', 4) ON CONFLICT (id) DO NOTHING;
    INSERT INTO public.menu_categories (id, restaurant_id, name, icon, sort_order) VALUES (v_cat_desserts, v_rest_id, 'Desserts', 'IceCream', 5) ON CONFLICT (id) DO NOTHING;
    INSERT INTO public.menu_categories (id, restaurant_id, name, icon, sort_order) VALUES (v_cat_drinks, v_rest_id, 'Drinks', 'Coffee', 6) ON CONFLICT (id) DO NOTHING;

    -- 4. Insert Menu Items
`;

const catVarMap = {
  specials: 'v_cat_specials',
  starters: 'v_cat_starters',
  mains: 'v_cat_mains',
  biryani: 'v_cat_biryani',
  desserts: 'v_cat_desserts',
  drinks: 'v_cat_drinks',
};

menu.forEach((item, idx) => {
  const itemUuid = `m0000000-0000-0000-0000-${String(idx + 1).padStart(12, '0')}`;
  const catVar = catVarMap[item.category] || 'v_cat_mains';
  const name = sqlEscape(item.name);
  const nameTrans = sqlEscape(JSON.stringify(item.nameTranslations || {}));
  const desc = sqlEscape(item.description);
  const price = item.price;
  const isVeg = item.vegType === 'veg';
  const spice = item.spiceLevel || 0;
  const img = sqlEscape(item.image);
  const isSpecial = Boolean(item.isSpecial);
  const isAvail = item.isAvailable !== false;

  sql += `    INSERT INTO public.menu_items (id, restaurant_id, category_id, name, name_translations, description, price, is_veg, spice_level, image_url, is_special, is_available)
    VALUES ('${itemUuid}', v_rest_id, ${catVar}, ${name}, ${nameTrans}::jsonb, ${desc}, ${price}, ${isVeg}, ${spice}, ${img}, ${isSpecial}, ${isAvail})
    ON CONFLICT (id) DO UPDATE SET price = EXCLUDED.price, is_available = EXCLUDED.is_available;
`;
});

sql += `
END $$;
`;

const outPath = path.join(__dirname, '..', 'supabase', 'seed.sql');
fs.writeFileSync(outPath, sql, 'utf8');
console.log('Successfully wrote seed.sql to', outPath);
