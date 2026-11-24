# Table Flow - Full-Stack Supabase Backend Plan

## 1. System Overview
Table Flow is a high-performance digital ordering and restaurant management platform built with Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion, and Supabase. This plan defines the migration from local mock data to an end-to-end Supabase PostgreSQL backend with authentication, real-time live synchronization, row-level security (RLS), and database persistence.

---

## 2. Inferred Entities & Relational Schema

### Core Tables
1. **`restaurants`**: Multi-tenant or single-tenant restaurant configuration (name, slug, currency, GST rate, service charge, operating hours, theme).
2. **`profiles`**: Staff profiles linked directly to `auth.users(id)` with auto-create trigger on signup. Roles: `owner`, `admin`, `waiter`, `kitchen`.
3. **`tables`**: Dining floor tables (1–12), capacities, HMAC-signed QR tokens, and real-time floor statuses (`free`, `occupied`, `needs_help`, `bill_pending`, `clean_table`).
4. **`menu_categories`**: Menu sections with sort order, icons, and restaurant association.
5. **`menu_items`**: Complete dish catalogue with prices, multilingual translation JSONB, dietary flags (`is_veg`), spice levels, preparation times, and real-time availability toggles.
6. **`table_sessions`**: Customer table dining sessions managing active occupancy and bills.
7. **`orders`**: Customer and waiter orders tracked through live kitchen stages (`sent`, `accepted`, `cooking`, `ready`, `served`, `cancelled`).
8. **`order_items`**: Itemized lines per order with cooking status (`pending`, `accepted`, `cooking`, `ready`, `rejected`) and chef notes.
9. **`bills` & `payments` & `bill_splits`**: Invoicing, automated 5% GST calculations, split-bill tracking, and payment reconciliations (UPI, card, counter).
10. **`waiter_requests`**: Real-time floor calls from diners (`call_waiter`, `water`, `bill`, `clean_table`) with resolution status.
11. **`reviews`**: Post-meal customer ratings (food, service, ambiance) and feedback tags.
12. **`stock_items`**: Inventory management, ingredient stock levels, and automated low-stock alerts.
13. **`water_tanks`**: Live water level tracking for dining water services.
14. **`security_sessions`**: Table QR anti-tampering and ODG protection sessions.

---

## 3. Database Security & Policies (RLS)
- **Public Read Access**: Anonymous diners scanning QR codes can read `restaurants`, `menu_categories`, `menu_items`, and their active `tables` record.
- **Diner Write Access**: Diners create orders and waiter requests via authenticated/secured endpoints or validated table sessions.
- **Staff Access (Authenticated)**:
  - `kitchen`: View and update active orders, item cooking statuses, and view menu items.
  - `waiter`: View all floor tables, manage active table sessions, approve orders, and resolve waiter calls.
  - `owner` / `admin`: Full CRUD access over menu items, tables, staff profiles, pricing, stock, analytics, and bills.

---

## 4. Implementation Steps
1. **Database Migrations (`/supabase/migrations`)**:
   - `001_init.sql`: Table definitions, foreign keys, check constraints, indexes, `updated_at` trigger, and RLS policies.
   - `002_auth_trigger.sql`: Automatic profile creation on `auth.users` insert with role mapping.
2. **Seed Data (`/supabase/seed.sql`)**:
   - Seed restaurant `Aroma & Saffron`, 12 floor tables, 6 categories, and 32 rich Indian cuisine menu items.
3. **Supabase Client & Service Layer**:
   - Unified typed client (`/lib/supabase/client.ts`, `/lib/supabase/server.ts`).
   - High-level data service (`/lib/services/supabaseService.ts`) providing typed query methods with error handling and Zod validation.
   - Live Supabase Realtime channel integration in `/lib/orderService.ts` for instant updates across customer, kitchen, and waiter tabs.
4. **Authentication & Route Protection**:
   - Staff login page at `/app/login/page.tsx` with role switching, password authentication, and session cookie persistence.
   - Next.js middleware to guard `/kitchen`, `/waiter`, and `/admin`.
5. **Frontend Integration**:
   - Connect Customer Menu (`/t/[tableId]`) to fetch real categories and menu items from Supabase.
   - Connect Order Checkout to create real orders and order items in Supabase.
   - Connect Order Tracking (`/t/[tableId]/status`) to listen to live order status transitions.
   - Connect Waiter Hub (`/waiter`) to fetch live floor tables, orders, and waiter calls.
   - Connect Kitchen KDS (`/kitchen`) to fetch live tickets and update cooking/ready states.
   - Connect Admin Dashboard (`/admin`) to perform real-time menu management, stock updates, and live metrics.
6. **Verification & Delivery**:
   - Run type checks and production build (`npm run build`).
   - Test end-to-end data flow and document setup instructions.
