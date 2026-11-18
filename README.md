# RideShare — Live Instant Ride-Sharing Platform

**RideShare** is a next-generation, on-demand ride-booking web application featuring an intelligent dynamic corridor-sharing layer.

Unlike traditional pre-planned carpooling, **RideShare is 100% on-demand**: passengers request rides right now, guaranteed drivers are dispatched immediately, and passengers can optionally allow live compatible commuters along their route to join—reducing fares while algorithmically enforcing detour caps under 5 minutes.

---

## 🚀 Key Architectural Pillars

### 1. True Multi-Page Architecture (No Single-Page Scrolling)
This is a genuine multi-page application powered by **React Router v7** and **Framer Motion 3D Transitions**. Each workflow step is a dedicated route with its own layout, purpose, and state:
- `/` — **Home**: 3D interactive cyber-city hero visualization, live corridor statistics, and "How RideShare Works" interactive modal.
- `/book` — **Book Ride**: Pickup & destination selectors (Pune tech corridor: Hinjawadi, Wakad, Baner, Kharadi, Viman Nagar, etc.), distance/time/fare estimators, and sharing opt-in switches.
- `/finding-driver` — **Finding Driver**: 3D radar search animation scanning nearby verified EV drivers.
- `/driver-found` — **Driver Found**: Driver profile, vehicle specifications, capacity meters, and sharing opt-in decision.
- `/live-sharing` — **Live Sharing**: Real-time corridor scanner showing candidate requests with Smart Match Scores (e.g., 94% Match, +2 min detour, Save ₹55).
- `/match-details` — **Match Details**: Side-by-side corridor comparison, detour breakdown (+1.7 km, +2 min), and transparent fare redistribution.
- `/ride` — **Live Ride**: Interactive 3D tracking map with moving vehicle, headlights, multi-passenger manifest, and dynamic stop sequence.
- `/fare-summary` — **Fare Summary**: Transparent economic line-item breakdown (solo fare, corridor discount, driver bonus, platform fee).
- `/payment` — **Payment**: UPI (GPay, PhonePe, Paytm), Credit/Debit Card, RideShare Wallet, and Cash options with 3D confetti celebration.
- `/ride-completed` — **Ride Completed**: 3D completion badge, 5-star driver rating system, compliment tags, and receipt overview.
- `/history` — **Ride History**: Filterable list (All / Shared / Solo) with detailed modal receipts.
- `/profile` — **Profile**: User stats, eco-savings (CO₂ reduced), saved locations, and payment methods.
- `/settings` — **Settings**: Maximum detour slider (2–12 min), auto-sharing preferences, privacy phone masking, and 3D tactile audio toggle.

---

### 2. 3D Design & Transitions
- **Interactive Three.js 3D Hero Scene**: Ambient lighting, procedural futuristic city buildings, glowing Catmull-Rom route curves, and animated vehicles.
- **Interactive 3D Perspective Map Engine**: Custom Canvas WebGL/isometric renderer supporting camera pan, tilt (0°–65°), rotation, and zoom; 3D building extrusions, animated headlights, glowing multi-colored routes (Cyan for solo, Purple for match, Emerald Green for merged shared corridor), and floating waypoint pins.
- **Smooth 3D Page Transitions**: Depth perspective scaling (`transformPerspective: 1200`), slight rotation on X/Y axes, smooth spring physics, and full respect for `prefers-reduced-motion`.

---

### 3. Smart Matching & Smart Fare Engines (Decoupled from UI)
- **`src/services/matchingEngine.ts`**:
  - Route overlap (40%)
  - Detour impact (25%)
  - Corridor proximity (15%)
  - Vector heading cosine alignment (10%)
  - Temporal departure synchronization (10%)
- **`src/services/fareEngine.ts`**:
  - Non-trivial economic model: primary passenger saves 15%–30%, joining passenger pays less than solo estimate, driver earns higher total revenue than solo trips, and the platform retains a sustainable fee.

---

### 4. Multi-Device Real-Time Architecture & Demo Hub
- **BroadcastChannel Real-Time Bus (`src/services/realtimeService.ts`)**: Enables real-time synchronization across multiple open browser tabs or windows on the same origin (simulating Passenger 1, Passenger 2, and Driver).
- **Interactive Demo Hub**: Click **Demo Hub** in the header to:
  - Jump directly to any of the 12 pages
  - Simulate an incoming compatible passenger request on the fly
  - Adjust simulation speed (1x, 2x, 5x, 10x)
  - Pause or fast-forward vehicle movement
  - Reset state to a clean demo

---

## 🛠️ Local Development & Scripts

```bash
# Install dependencies
npm install

# Run Vite development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```
