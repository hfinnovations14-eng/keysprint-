# KeySprint — Full-Stack Multiplayer Typing Racing Platform

> **Type. Race. Have Fun!**  
> A browser-based competitive multiplayer typing racing platform inspired by arcade motorsport, built strictly according to **KeySprint SRS v1.0 specifications**.

---

## 🏎️ Platform Overview

**KeySprint** transforms touch typing practice into an electrifying cartoon motorsport championship. Real-time sequential keystrokes propel high-performance sports cars across synchronized asphalt tracks against live online racers or intelligent bot drivers.

* **100% Fair Play:** All vehicles, nitro trails, and cosmetic kits share identical progression mechanics — victory depends solely on typing speed, rhythm, and accuracy.
* **Full-Stack Monorepo:** Integrated client-server architecture with React 18, Express, Prisma ORM, SQLite database, and low-latency Socket.IO WebSockets.
* **50+ Complete Screens:** Public marketing, authentication, real-time multiplayer racing, progression dashboard, garage fleet, virtual coin store, achievements, leaderboards, practice drills, and full administrative suite.
* **Anti-Cheat Cadence Guard:** Deterministic burst speed detection flagging submissions exceeding 200 WPM with automated review triage.

---

## 🛠️ Monorepo Architecture & Tech Stack

```
keysprint/
├── frontend/                   # Client application (Vite + React 18 + TypeScript)
│   ├── src/
│   │   ├── components/         # Shared UI, Header, Footer, SvgCar, Toolbar
│   │   ├── context/            # AuthContext (JWT) & RaceContext (WebSockets)
│   │   ├── data/               # Car fleet catalog, tracks, challenges data
│   │   ├── screens/            # 50+ Screen components across 10 functional modules
│   │   └── services/           # REST API client & Socket.IO connector
│   └── package.json
├── backend/                    # Game Server & Engine (Node.js + Express + Prisma)
│   ├── prisma/
│   │   ├── schema.prisma       # SQLite Database models (Users, Stats, Races, Wallet)
│   │   └── seed.ts             # Default administrator, passages & achievements
│   ├── src/
│   │   ├── config/             # Prisma client connection
│   │   ├── controllers/        # Auth, Race, User/Garage, Leaderboard, Admin
│   │   ├── middlewares/        # JWT Authentication & RBAC guards
│   │   ├── routes/             # Versioned REST API endpoints (/api/v1)
│   │   ├── sockets/            # Real-time Socket.IO room manager & broadcast
│   │   └── server.ts           # HTTP server bootstrapping
│   └── package.json
└── README.md
```

### Core Technologies
* **Frontend:** React 18, TypeScript, Vite, Socket.IO Client, Lucide React, Canvas Confetti.
* **Backend:** Node.js, Express, Socket.IO (WebSockets), JSON Web Tokens (JWT), Bcrypt.js.
* **Database & ORM:** Prisma ORM with SQLite (`dev.db`), atomic wallet ledger transactions.
* **Styling & Aesthetics:** Custom CSS Design System (Arcade Orange `#FF5A1F`, Cream `#FFF9EF`, JetBrains Mono & Plus Jakarta Sans typography).

---

## 🚀 Quick Start Guide

### Prerequisites
* **Node.js:** v18.0.0 or higher (v20+ recommended)
* **npm:** v9.0.0 or higher

### 1. Installation
Clone the repository and install all monorepo dependencies:

```bash
# Clone repository
git clone https://github.com/hfinnovations14-eng/keysprint-.git
cd keysprint-

# Install root & workspace packages
npm install
npm run install:all
```

### 2. Database Setup & Seeding
Initialize the SQLite database and seed the default administrator, curated passages, and initial achievements:

```bash
# Push database schema
npm run db:push

# Seed database with demo admin and curated passages
npm run db:seed
```

### 3. Running Development Servers
Run the backend API and frontend client:

```bash
# Terminal 1 — Start Backend Server (Port 5000)
npm run dev:backend

# Terminal 2 — Start Frontend Client (Port 3000 / 3001)
npm run dev:frontend
```

Once running:
* **Frontend Application:** [http://localhost:3000](http://localhost:3000) (or `http://localhost:3001`)
* **Backend API & WebSockets:** [http://localhost:5000](http://localhost:5000)
* **Database Studio:** Run `npm run db:studio` to inspect database records visually.

---

## 🔑 Default Credentials

| Role | Email | Password | Initial Coins | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **Administrator** | `admin@keysprint.io` | `admin123` | 15,000 🪙 | Full access to Admin Console (Screens Admin 01–09) |
| **Guest Access** | *N/A (Instant)* | *N/A* | 2,500 🪙 | Generated on-the-fly via Screen 09 Guest Entry |

---

## 🌐 API & Real-Time Protocol Reference

### REST Endpoints (`/api/v1`)

| Module | Method | Endpoint | Description |
| :--- | :--- | :--- | :--- |
| **Auth** | `POST` | `/auth/register` | Create account with email, password & nickname |
| **Auth** | `POST` | `/auth/login` | Authenticate driver and issue JWT session token |
| **Auth** | `POST` | `/auth/guest` | Instant transient session with random guest tag |
| **Auth** | `GET` | `/auth/me` | Retrieve authenticated profile, stats & inventory |
| **Race** | `GET` | `/race/passage` | Fetch random typing passage by difficulty |
| **Race** | `POST` | `/race/result` | Submit race score, calculate XP/coins & update stats |
| **Race** | `GET` | `/race/history` | Retrieve user's personal match audit trail |
| **User** | `PUT` | `/user/profile` | Update driver nickname, avatar, and country |
| **User** | `POST` | `/user/garage/equip` | Equip vehicle as active race-day car |
| **User** | `POST` | `/user/store/purchase` | Atomic coin deduction & car fleet unlock |
| **Social** | `GET` | `/leaderboard` | Verified WPM rankings with country filters |
| **Admin** | `GET` | `/admin/metrics` | Real-time active users, lobbies & latency stats |
| **Admin** | `GET` | `/admin/users` | Driver directory inspection & role management |
| **Admin** | `PUT` | `/admin/users/:id/status` | Account suspension and sanction enforcement |
| **Admin** | `GET` | `/admin/passages` | CMS listing of all match text passages |
| **Admin** | `POST` | `/admin/passages` | Author and publish new race passage |
| **Admin** | `PUT` | `/admin/passages/:id/retire` | Retire outdated text passage from rotation |
| **Admin** | `GET` | `/admin/anticheat` | Triage flagged runs exceeding 200 WPM |
| **Admin** | `GET` | `/admin/audit` | Tamper-evident staff & wallet transaction logs |

### WebSocket Events (Socket.IO)

* `join_matchmaking`: Register client into regional matchmaking pool.
* `match_found`: Broadcast match room ID, passage text, and participant roster.
* `countdown_tick`: Synchronized 3-2-1 starting grid countdown.
* `race_start`: Trigger typing input activation across all racers simultaneously.
* `race_progress`: Broadcast typing completion %, live WPM, and accuracy per player.
* `player_finished`: Announce player placement and duration time.

---

## 📱 Complete Screen Inventory (50+ Screens)

### Section A — Public Showcase & Marketing
* **Screen 01:** Homepage (Hero with cartoon red supercar, live stats cards, How it Works, CTA)
* **Screen 02:** How to Play (5-step illustrated rules & keyboard guide)
* **Screen 03:** About KeySprint (Story, typing science, fair-play guarantee)

### Section B — Authentication & Onboarding
* **Screen 04:** Sign Up (Split layout with trophy banner & OAuth options)
* **Screen 05:** Login (Email/password, remember me, error guards)
* **Screen 06:** Forgot Password (Recovery link dispatch)
* **Screen 07:** Reset Password (Password strength meter)
* **Screen 08:** Email Verification (6-digit token verification)
* **Screen 09:** Guest Entry (Instant play with nickname generator & transient data disclosure)

### Section C — Gameplay Engine
* **Screen 10:** Race Mode Selection (Quick Race, Private Room, Bot Race, Track Selector)
* **Screen 11:** Matchmaking Queue (Searching for 2–6 players, countdown timer, slot indicators)
* **Screen 12:** Pre-Race Lobby (Synchronized 3-2-1 starting grid)
* **Screen 13:** **Playable Live Multiplayer Race** (Multi-lane track, real-time typing input, live WPM, accuracy, opponent AI cars)
* **Screen 14:** Practice Typing Interface (Solo typing arena with cadence coaching)
* **Screen 15:** Bot Racing (Easy, Normal, Advanced AI speed profiles)
* **Screen 16:** Race Results Celebration (1st place podium celebration, coin/XP rewards, play again)
* **Screen 17:** Private Room Creation (Custom 6-character room code, capacity, track choice)
* **Screen 18:** Private Room Lobby (Host controls, player ready checks, invite link)

### Section D — Account & Driver Telemetry
* **Screen 19:** User Dashboard (Sidebar, Level & XP progression, best WPM, recent race logs)
* **Screen 20:** Public Profile (Verified badge, player rank, equipped vehicle showcase)
* **Screen 21:** Edit Profile (Avatar picker, nickname change, country representation)
* **Screen 22:** Statistics & Analytics (WPM progression trend, accuracy, weak keys heatmap keyboard)
* **Screen 23:** Race History (Filterable match log with placement, speed, and rewards)

### Section E — Garage & Shop Economy
* **Screen 24:** Garage (Fleet inspector, rarity tiers, equipped status, nitro trail colors)
* **Screen 25:** Shop (Special Bundle "Racing Legend Pack", featured cars, virtual coin catalog)
* **Screen 26:** Purchase Confirmation Modal (Atomic coin ledger validation & unlock feedback)
* **Screen 27:** Achievements (All, In Progress, Completed, Locked badges)
* **Screen 28:** Daily Challenges (Rotating 24h quests with coin and XP claim buttons)

### Section F — Social & Competition
* **Screen 29:** Global Leaderboard (Top 3 podium crowns, global/country filters, pinned personal rank)
* **Screen 30:** Friends & Social (Friends list, online/in-game status, challenge & invite actions)
* **Screen 31:** Notifications & Invites Center (Race invites, reward deliveries)
* **Screen 32:** Tournaments & Events (Weekend Cup, Speed Challenge, Pro League)

### Section G — Learning & Drills
* **Screen 33:** Practice Mode Selection (Passages, 15s/30s/60s/120s timed tests, numbers & punctuation)
* **Screen 34:** Practice Results (AI typing cadence coaching & targeted drill suggestions)

### Section H — Settings & System States
* **Screen 35:** Settings (Audio effects, engine rumble, reduced motion accessibility, keyboard layouts)
* **Screen 36:** Help Center & FAQs (Searchable accordion with typing tips and gameplay rules)
* **Screen 37:** Contact & Report Issue (Bug reports and anti-cheat cadence reporting)
* **Screen 38:** Legal Pages (Privacy Policy, Terms of Service, Fair Play Rules)
* **Screen 39:** System States (404 Not Found, Maintenance Mode, 500 Error, Connection Lost overlay)

### Section I — Complete Administrative Suite
* **Admin 01:** Operations Overview Dashboard (Active users, live rooms, average queue time, gateway latency)
* **Admin 02:** User Management (Search, inspect, verify, suspend or restore driver accounts)
* **Admin 03:** Passage CMS (Author, review, difficulty tag, and retire race text passages)
* **Admin 04:** Game Configuration (Countdown duration, queue timeout, bot speeds, burst thresholds)
* **Admin 05:** Garage & Catalog SKUs (Vehicle pricing, rarity tiers, active status)
* **Admin 06:** XP & Rewards Engine (Progression matrix, match payouts, placement bonuses)
* **Admin 07:** Anti-Cheat & Telemetry Triage (Flagged race queue, >200 WPM burst detection, ban/pardon)
* **Admin 08:** Analytics & Funnels (Conversion funnels, typing speed curves, device breakdown)
* **Admin 09:** Staff Roles & Audit Logs (RBAC permissions, MFA verification, immutable audit trail)

### Section J & K — Developer Tools
* **Screen Switcher Toolbar:** Fixed bottom toolbar allowing instant navigation to any of the 50+ screens.
* **Responsive Simulator:** Toggle between Desktop, Tablet (834px), and Mobile (390px) viewpoints.
* **Overview Board:** Master design contact sheet showing all screens simultaneously.

---

## 🔒 Security & Data Integrity

1. **Password Protection:** Cryptographic hashing with `bcryptjs` (salt factor 10).
2. **Stateless Sessions:** Cryptographically signed JSON Web Tokens (`HS256`, 7-day expiration).
3. **Atomic Transactions:** All wallet deductions and rewards execute inside Prisma `$transaction` blocks to prevent double-spending.
4. **Input Sanitization:** Real-time speed calculations validate elapsed time vs character count; speeds exceeding 250 WPM trigger anti-cheat quarantine.

---

## 📄 License & Specifications
Built according to the **KeySprint Software Requirements Specification (SRS v1.0)**.  
All virtual currency and vehicle items are strictly virtual gameplay assets with zero real-world cash value.
