# KeySprint — Multiplayer Typing Racing Platform

> **Type. Race. Have Fun!**  
> A browser-based competitive multiplayer typing racing platform inspired by arcade motorsport, built according to KeySprint SRS v1.0 specifications.

---

## 🏎️ Overview

KeySprint turns keyboard typing training into a high-octane 2D/3D cartoon motorsport experience. Correct sequential keystrokes propel your vehicle forward across multi-lane highways in real-time, competing against other typists worldwide or AI opponents.

* **100% Fair Play:** All vehicles, body kits, and nitro trails are strictly cosmetic with identical progression physics.
* **50+ Complete Screens:** Covers public marketing, onboarding, authentication, real-time racing engine, player dashboard, garage, virtual coin store, achievements, leaderboards, practice drills, system states, and full administration console.
* **Playable Live Race:** Real keystroke engine calculating Net WPM, accuracy %, mistakes, and live progress.

---

## 🛠️ Tech Stack

* **Frontend:** React 18 + TypeScript + Vite
* **Styling:** Custom CSS Design System (Warm cream `#FFF9EF`, Arcade orange `#FF5A1F`, realistic soft shadows, Plus Jakarta Sans & JetBrains Mono typography)
* **Icons & Visuals:** Lucide React + Original Vector SVG Car fleet + 3D Rendered Track Assets
* **Effects:** Canvas Confetti

---

## 🚀 Getting Started

### Prerequisites
* Node.js 18+ (tested on Node v20+)
* npm or yarn

### Installation & Run

```bash
# Clone the repository
git clone https://github.com/hamza-83/keysprint-.git
cd keysprint-

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (or `http://localhost:3001` if 3000 is occupied) in your browser.

---

## 📱 Features & Screen Inventory

### Section A — Public Website
* **Screen 01:** Homepage (Hero with 3D red sports car, live stats cards, How it Works, mini leaderboard, CTA)
* **Screen 02:** How to Play (5-step illustrated rules & mechanics guide)
* **Screen 03:** About KeySprint (Platform story, typing improvement science, fair-play guarantee)

### Section B — Authentication
* **Screen 04:** Sign Up (Split layout with trophy banner & Google/Apple OAuth options)
* **Screen 05:** Login (Email/password, remember me, forgot link)
* **Screen 06:** Forgot Password (Email recovery link dispatch)
* **Screen 07:** Reset Password (Password strength meter)
* **Screen 08:** Email Verification (6-digit token verification)
* **Screen 09:** Guest Entry (Instant play with nickname generator & transient data disclosure)

### Section C — Gameplay
* **Screen 10:** Race Mode Selection (Quick Race, Create Private Room, Play with Bots, Track selector)
* **Screen 11:** Matchmaking Queue (Searching for 2–6 players, countdown timer, slot indicators)
* **Screen 12:** Pre-Race Lobby (Synchronized 3-2-1-GO starting grid)
* **Screen 13:** **Playable Live Multiplayer Race** (Multi-lane track, real-time typing input, live WPM, accuracy, opponent AI cars)
* **Screen 14:** Practice Typing Interface (Solo typing arena with drills)
* **Screen 15:** Bot Racing (Easy, Normal, Advanced AI speed profiles)
* **Screen 16:** Race Results Celebration (1st place podium celebration, coin/XP rewards, play again)
* **Screen 17:** Private Room Creation (Custom 6-character room code, player capacity, track choice)
* **Screen 18:** Private Room Lobby (Host controls, player ready checks, invite link)

### Section D — Account & Progress
* **Screen 19:** User Dashboard (Sidebar, Level & XP progression, best WPM, recent race logs)
* **Screen 20:** Public Profile (Verified badge, player rank, equipped vehicle showcase)
* **Screen 21:** Edit Profile (Avatar picker, nickname change, country representation, privacy toggles)
* **Screen 22:** Statistics & Analytics (WPM progression trend, accuracy, weak keys heatmap keyboard)
* **Screen 23:** Race History (Filterable match log with placement, speed, and rewards)

### Section E — Garage & Shop
* **Screen 24:** Garage (Fleet inspector, rarity tiers, equipped status, nitro trail colors)
* **Screen 25:** Shop (Special Bundle "Racing Legend Pack", featured cars, virtual coin catalog)
* **Screen 26:** Purchase Confirmation Modal (Atomic coin ledger validation & unlock feedback)
* **Screen 27:** Achievements (All, In Progress, Completed, Locked badges)
* **Screen 28:** Daily Challenges (Rotating 24h quests with coin and XP claim buttons)

### Section F — Social & Competition
* **Screen 29:** Global Leaderboard (Top 3 podium crowns, global/country filters, pinned personal rank)
* **Screen 30:** Friends & Social (Friends list, online/in-game status, challenge & invite actions)
* **Screen 31:** Notifications & Invites Center (Race invites, reward deliveries)
* **Screen 32:** Tournaments & Events (Weekend Cup, Speed Challenge, Pro League — SRS V2)

### Section G — Learning & Drills
* **Screen 33:** Practice Mode Selection (Passages, 15s/30s/60s/120s timed tests, numbers & punctuation)
* **Screen 34:** Practice Results (AI typing cadence coaching & targeted drill suggestions)

### Section H — Settings & Support
* **Screen 35:** Settings (Audio effects, engine rumble, reduced motion accessibility, keyboard layouts, account deletion)
* **Screen 36:** Help Center & FAQs (Searchable accordion with typing tips and gameplay rules)
* **Screen 37:** Contact & Report Issue (Bug reports and anti-cheat cadence reporting)
* **Screen 38:** Legal Pages (Privacy Policy, Terms of Service, Fair Play Rules)
* **Screen 39:** System States (404 Not Found, Maintenance Mode, 500 Error, Connection Lost overlay, Empty Data)

### Section I — Complete Administrative Suite
* **Admin 01:** Operations Overview Dashboard (DAU, live rooms, average queue time, latency health)
* **Admin 02:** User Management (Search, inspect, verify, suspend or restore driver accounts)
* **Admin 03:** Passage CMS (Author, review, difficulty tag, and retire race text passages)
* **Admin 04:** Game Configuration (Countdown duration, queue timeout, bot speeds, burst thresholds)
* **Admin 05:** Garage & Catalog SKUs (Vehicle pricing, rarity tiers, active status)
* **Admin 06:** XP & Rewards Engine (Progression matrix, match payouts, placement bonuses)
* **Admin 07:** Anti-Cheat & Telemetry Triage (Flagged race queue, >200 WPM burst detection, ban/pardon)
* **Admin 08:** Analytics & Funnels (Conversion funnels, typing speed curves, device breakdown)
* **Admin 09:** Staff Roles & Audit Logs (RBAC permissions, MFA verification, immutable audit trail)

### Section J & K — Responsive Simulator & Overview Board
* **Responsive Views:** Side-by-side interactive Mobile (390px) and Tablet (834px) device frames.
* **Screen Overview Board:** Master design contact sheet showing all 50+ screens with live navigation.

---

## 📄 License & Specifications
Built according to the **KeySprint Software Requirements Specification (SRS v1.0)**.  
All virtual currency and vehicle items have strictly zero real-world cash value.
