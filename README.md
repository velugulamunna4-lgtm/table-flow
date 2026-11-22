# Table Flow · Modern Digital Restaurant Operating System

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvelugulamunna4-lgtm%2Ftable-flow)

> **A high-converting, demo-ready frontend prototype for restaurant digital ordering, live kitchen display sync, waiter management, and bill splitting.**

Built with Next.js (App Router), TypeScript, Tailwind CSS, Framer Motion, Zustand, and BroadcastChannel real-time sync.

---

## 🌟 Key Highlights

- **Warm "Sunny Family" Design System**: 24px soft card radii, 999px pills, layered warm shadows, and vibrant coral/sun accents. No generic blue or SaaS template aesthetic.
- **Cross-Tab Real-time Sync**: Orders placed on the customer screen immediately arrive on the Dark Kitchen Display and Waiter Tablet via a swappable `BroadcastChannel` service layer (`lib/orderService.ts`).
- **4-Language Support**: Seamless instant switching between English, Telugu (తెలుగు), Tamil (தமிழ்), and Hindi (हिंदी).
- **Interactive Waiting Mini-Games**: 3 touch-friendly 30-second games (Memory Match, Catch The Dish, Food Trivia) awarding "Spice Points" to unlock dessert rewards while food is being cooked.
- **Smart Bill Splitting**: Split equally with person steppers, split by tapping specific ordered dishes, custom contribution, and dynamic UPI QR generation.
- **Live 86 / Sold-Out Management**: Kitchen toggle immediately disables sold-out items across all open customer phones.

---

## 🚀 Quick Setup & Run

### Prerequisites
- Node.js `v18+` or `v20+` (Tested on Node `v24` and `v20`)
- npm `v9+`

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

Visit **`http://localhost:3000`** in your browser.

---

## 🗺️ Route Directory

| Route | Description | Best Viewport |
| :--- | :--- | :--- |
| **`/`** | **Marketing Landing Page** — Pitch, live 3-screen switcher mockup, ROI stats & pricing | Desktop / Tablet |
| **`/t/[tableId]`** *(e.g. `/t/7`)* | **Customer Menu App** — Category pills, search, dietary toggles, morphing `+ Add` steppers, bottom cart sheet | Mobile (360px+) / Phone |
| **`/t/[tableId]/status`** | **Order Tracker** — 5-stage live journey (Sent → Accepted → Cooking → Ready → Served) with plain-language updates & ETA | Mobile / Phone |
| **`/t/[tableId]/play`** | **Waiting Mini-Games** — Memory Match, Catch The Dish, Food Trivia with Spice Points badge | Mobile / Phone |
| **`/t/[tableId]/bill`** | **Bill & Split Hub** — Itemized bill, Split Equally, Split by Item, Custom Amount, UPI/Card/Counter | Mobile / Phone |
| **`/kitchen`** | **Kitchen Display System (KDS)** — Dark mode, 3 columns (New, Cooking, Ready), >15m urgency terracotta warnings, instant 86 drawer | Tablet / 1080p Monitor (2m readable) |
| **`/waiter`** | **Captain & Waiter Hub** — Color-coded table floor (Free, Occupied, Needs Help, Bill Pending), Sent approvals, Waiter-assisted punch | Tablet / iPad |
| **`/admin`** | **Owner Portal** — Hourly revenue charts (Recharts), Menu item CRUD & 86 toggles, Printable QR tent-card generator, Settings | Desktop / Tablet |
| **`/site/[restaurantSlug]`** | **Public Brand Website** — Hero, chef specials showcase, opening hours, location map, table reservation form | Desktop / Mobile |
| **`/design-system`** | **Design Tokens Preview** — Live color chip tokens, typography showcase, buttons, steppers, and theme switcher | Desktop / Tablet |

---

## 🎨 How to Change Theme & Restaurant Name

### 1. Changing Restaurant Name & Branding
Open `config/restaurant.config.ts`:
```typescript
export const restaurantConfig = {
  name: "Table Flow",                       // Change to your restaurant's name
  tagline: "Authentic Indian Flavors & Modern Comfort",
  currencySymbol: "₹",
  gstRatePercent: 5.0,
  splitBillPolicy: "customer_and_counter", // 'customer_and_counter' | 'counter_only'
  // ...
};
```

### 2. Switching Themes Live
You can change the active theme live in `/admin` (under **Store Settings**) or in `config/restaurant.config.ts`:
```typescript
defaultTheme: 'sunny-family', // Options: 'sunny-family' (Default) | 'modern-green'
```

Theme definitions reside in `config/themes.ts`:
- **Sunny Family (Default)**:
  - `--bg-canvas`: `#FFF9F2` (Warm Cream)
  - `--accent-primary`: `#FF7A45` (Warm Vibrant Coral)
  - `--accent-sun`: `#FFC233` (Sun Yellow)
  - `--success`: `#2DBE7E` (Sage Green)
  - `--alert`: `#FF5A6E` (Terracotta Alert)
  - `--text-primary`: `#3A2A22` (Deep Espresso)
- **Modern Green**:
  - Botanical garden aesthetic with sage (`#2D7A58`), lime (`#A3E635`), and fresh mint.

---

## 📱 How to Demo to Restaurant Owners (3 Browser Windows)

1. **Window 1 (Customer Phone View)**: Open `http://localhost:3000/t/7` in a mobile-sized browser window or on your actual smartphone connected to local Wi-Fi.
2. **Window 2 (Kitchen Display)**: Open `http://localhost:3000/kitchen` on laptop screen in dark mode.
3. **Window 3 (Waiter Hub)**: Open `http://localhost:3000/waiter` on another tab.

### The Live Magic Moment:
- On Window 1 (Customer), add **Hyderabadi Chicken Dum Biryani** and **Mango Lassi**, add cooking note *"Extra onions"*, and tap **"Place Order Now"**.
- Watch Window 2 (Kitchen) and Window 3 (Waiter) **instantly receive the ticket** with zero page reload.
- On Kitchen, tap **"Accept & Cook"** — customer's phone switches from *Sent* to *Cooking* in real time!
- On Kitchen, open **"86 / Sold Out"** and toggle an item off — it disables immediately on the customer phone!

---

## 🔌 Architecture & Backend Swappability

All state and data access is isolated inside `/lib/orderService.ts` and `/lib/store.ts`. The UI components never communicate directly with local storage or BroadcastChannel.

When connecting a real backend (e.g. Node.js, NestJS, FastAPI, Supabase, Firebase, or PostgreSQL):
1. Keep the UI screens and component interfaces identical.
2. Replace the methods inside `lib/orderService.ts` (`placeOrder`, `updateOrderStatus`, `toggleItemAvailability`) with your HTTP `fetch('/api/orders')` or WebSocket/Pusher events as noted by the explicit `/* TODO [Phase 2 Backend Integration] */` comments in the file.
