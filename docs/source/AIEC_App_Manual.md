# ALL INDIA ELEVATORS COMPANY
## Platform Operating Manual — Start to End
**Version 3.0 · Owner: Mr. Prashant Vasant Wable · Region: Pune, Maharashtra (India)**

---

## HOW TO READ THIS DOCUMENT

This is not a feature list. It is a **usage manual** — it tells you what happens on screen, in what order, who touches what, what the system does silently in the background, and what happens when something goes wrong.

It is organised the way the money moves:

> **Rider finds the shaft → Bot sells the lift → Customer pays token → QC clears the shaft → Container ships → Customer pays 90% → Technician installs → QC audits → Handover → Final 10% → NOC → AMC**

Every role's chapter has the same five blocks, so you can jump anywhere:

| Block | What it answers |
|---|---|
| **A. Who & What They See** | Theme, language, screen list |
| **B. Start-to-End Walkthrough** | Hour by hour, tap by tap |
| **C. Section A Laws Applied Here** | Explicit mapping of every rule to this role |
| **D. Money for This Role** | Exact earning triggers and amounts |
| **E. What Blocks You** | Failure modes and how the system reacts |

**Symbols used throughout:**
`👤` human action · `🤖` AI/system action · `🔒` hard block (cannot proceed) · `💰` money event · `📍` GPS-verified · `📷` camera-verified · `⚠️` risk flag

---

# PART 0 — THE 12 LAWS
### (Section A, converted into enforceable system behaviour)

These 12 laws are not documentation. They are compiled into the app. **Every screen in Parts 1–10 obeys all 12.** If a screen breaks a law, it is a bug, not a design choice.

---

### LAW 1 — Every Single Thing Has a Location-Aware Unique ID

Nothing exists in this system without an ID. No lead, no bolt, no chat message, no rupee.

**Format:**

```
MH - PUN - KOT - LIFT - 0089 - K
 │     │     │      │      │     │
 │     │     │      │      │     └─ Check character (Damm algorithm, catches typos & verbal errors)
 │     │     │      │      └─────── Serial, 4-digit, unique per zone + per entity type
 │     │     │      └────────────── Entity type code (4 letters, table below)
 │     │     └───────────────────── Zone / locality code (3 letters, from GIS ward polygon)
 │     └─────────────────────────── City code (3 letters)
 └───────────────────────────────── State code (2 letters, ISO 3166-2:IN)
```

**Entity type codes:**

| Code | Entity | Created when |
|---|---|---|
| `LEAD` | Raw site lead | Rider taps Capture |
| `CUST` | Customer account | Token payment succeeds |
| `LIFT` | The physical lift unit | Deal won |
| `QUOT` | Quotation version | Bot generates price |
| `AGMT` | Digital agreement | Customer e-signs |
| `CONT` | Smart IoT container | Supplier seals it |
| `KITB` | Barcoded material pouch | Packed at supplier |
| `RIDR` | Field rider | Onboarding approved |
| `TECH` | Technician | Level 1 certification |
| `QCIN` | QC inspector | Level 5 promotion |
| `SUPP` | Supplier | Vendor agreement signed |
| `PART` | City partner / franchise | Royalty agreement signed |
| `PAYT` | Any payment | Transaction initiated |
| `WLET` | Wallet ledger entry | Any credit/debit |
| `CMPL` | Complaint | Customer or system raises |
| `CHAT` | Conversation thread | First message |
| `SOPX` | SOP step execution record | Technician opens a step |
| `EVID` | Photo/video evidence | Shutter pressed |
| `AMCX` | AMC contract | NOC issued |

**The three-layer consequence of this law:**

1. **Layer 1 — Search:** Type `KOT-LIFT-0089` anywhere in the app and you land on that lift.
2. **Layer 2 — Auto-tagging:** Every photo, chat, GPS ping, rupee and SOP step is stamped with the parent ID at creation. **There is no "attach to job" step.** The app knows where you are, so it knows what you are working on.
3. **Layer 3 — Forensic reconstruction:** Any dispute is settled by pulling one ID and replaying its complete timeline — who stood where, at what minute, with what photo, and which rupee moved. This is what makes the liability model defensible.

**QR everywhere:** Every ID renders as a QR sticker. Containers, material pouches, the lift machine-room plate, the technician's badge, the customer's welcome card. Scanning a QR = opening that record.

---

### LAW 2 — The Map Is the App

There is no "list view first" screen anywhere in this product. Every role opens onto a live GIS map.

- **Rider** opens to: their captured pins + heatmap of unworked zones
- **Sales** opens to: lead pins coloured by funnel stage
- **Customer** opens to: their own site pin + the live container moving toward it
- **Technician** opens to: their assigned sites + route + today's SOP step
- **QC** opens to: sites awaiting inspection, sorted by distance
- **Admin** opens to: everything, everyone, live, with filters
- **Owner** opens to: revenue density heatmap of Maharashtra

Lists exist only as a *toggle* on top of the map (`☰ List` in the top-right), never as the default.

**Map legend (universal, same colours for every role):**

| Colour | Meaning |
|---|---|
| ⚪ Grey | New lead, untouched |
| 🔵 Blue | In sales / negotiation |
| 🟣 Purple | Won, awaiting shaft readiness |
| 🟠 Orange | Container in transit |
| 🟡 Yellow | Installation in progress |
| 🟢 Green | Handover complete, NOC issued |
| 🔴 Red | Blocked / SLA breach / alert |
| ⚫ Black | Lost / cancelled |

**Tap any pin → the Entity Card slides up.** Same card structure everywhere: photo strip, ID, status, next action button, money position, timeline.

---

### LAW 3 — The AI Is the Supervisor, Not an Assistant

The app does not wait to be used. It runs the day.

**Every role has a Daily Routine Schedule** — a timed sequence pushed by the AI Master Controller. The user does not decide what to do next; the app tells them, and the clock is visible.

The controller does five things continuously:

1. **Dispatch** — pushes the next task with a countdown at the scheduled minute
2. **Verify** — checks GPS, timestamp, photo content, and SOP order before allowing "Done"
3. **Escalate** — nudge at T+15 min → warning at T+30 → auto-reassign at T+60 → admin alert
4. **Gate money** — no verified step, no wallet credit. This is absolute.
5. **Learn** — adjusts route suggestions, lead scoring, and ETA predictions from actual outcomes

**Escalation ladder (identical for every role):**

| Stage | Trigger | System response |
|---|---|---|
| Nudge | Task 15 min late | Push notification + voice prompt in user's language |
| Warning | 30 min late | Banner turns amber, supervisor notified, streak bonus at risk |
| Penalty | 60 min late | Streak broken, task released to open pool |
| Reassign | 90 min late | 🤖 Broadcast to nearest qualified worker within 5–10 km, surge bonus attached |
| Flag | 3 reassigns in 30 days | Account auto-suspended, admin review queue |

---

### LAW 4 — Micro-Money After Every Task (The Motivation Engine)

Small amounts of real money hit the wallet the *instant* a task passes verification. Not weekly. Not at project end. **Instantly, with sound and animation.**

**The three-layer psychology:**

1. **Layer 1 — Immediate reward:** ₹5 to ₹200 credits with a coin-drop animation and a rising counter. The gap between effort and reward is under 3 seconds.
2. **Layer 2 — Visible progress:** Every screen carries a "Money Meter" — today's earnings, week's earnings, and a progress bar to the next tier bonus. The user always knows how far ₹500 more is.
3. **Layer 3 — Loss aversion:** Streaks, tier progress, and zero-wastage bonuses can be *lost*. Losing an earned streak hurts more than gaining one feels good — this is what sustains the habit after novelty dies.

**⚠️ Hard constraint — the Gamification Budget Cap:**
Total micro-rewards on any job are capped at a fixed percentage of that job's gross margin (recommended: **2.5%**, hard ceiling **4%**). The app computes the cap at deal-won and will *not* issue credits beyond it — it converts surplus into non-cash rewards (badges, rank, priority job access) instead. **Without this cap, gamification eats the business.**

**Wallet rules:**
- Micro-credits land in **Pending** state, become **Cleared** after QC or AI verification
- Cleared balance auto-pays out **every Friday** to the linked bank account
- Penalties (material shortfall, SOP violation) deduct from **Pending first**, then Cleared
- Full ledger visible to the worker; every line carries a `WLET` ID and a tap-through to the evidence that earned it

---

### LAW 5 — Every Role Knows Exactly What to Do and Exactly What It Pays

Before any task is accepted, the worker sees a **Task Card** with four lines and nothing else:

```
┌────────────────────────────────────────┐
│  📍 Kothrud, 2.4 km · 8 min ride       │
│  Install: Bracket Row 3 (SOP Step 7)   │
│  ⏱ Est. 45 min                         │
│  💰 ₹180 on approval                   │
│         [ ACCEPT ]   [ SKIP ]          │
└────────────────────────────────────────┘
```

Work, distance, time, money. Four facts. No paragraphs. This card format is identical for rider, technician, QC and helper — only the content changes.

---

### LAW 6 — Three Languages, Everywhere, Instantly

**English · मराठी (Marathi) · हिंदी (Hindi)**

The switch lives in the top bar of every screen (a small globe icon) and in Settings. Switching is **instant and does not restart the app or lose form data.**

What switches (this is the part most apps get wrong — it must be *all* of it):

- All UI labels, buttons, menus
- All SOP step text and safety warnings
- All AI voice prompts and the outbound sales voice bot
- All WhatsApp message templates (pre-approved per language)
- All push notifications
- The floating Help Button's explanations
- Training video subtitles and audio tracks
- Generated PDFs: quotations, agreements, NOC, AMC certificates
- Number and date formatting (Indian numbering: ₹1,50,000 not ₹150,000)

**Default language is auto-set by role and device locale:** Rider and Technician default to Marathi, Customer to English, Admin/Owner to English — all overridable.

---

### LAW 7 — A Different Beautiful Theme for Every Role

The UI is not one skin with a colour variable. Each role gets layout complexity, contrast, and control size matched to its physical working conditions.

| Role | Theme | Why it is built that way |
|---|---|---|
| **Rider** | *Sunlight* — high-contrast white/orange, 72px buttons, 22pt minimum text, one action per screen, voice input on every field | Used outdoors, in glare, on a bike, often with one hand and a helmet on |
| **Technician / QC** | *Slate* — dark grey/cyan, checklist-first, camera occupies 60% of screen, big tick targets | Used in dim shafts, with dirty or gloved hands, needs low glare in enclosed space |
| **Customer** | *Premium* — white/gold, generous whitespace, large photography, elegant serif headings | This is the brand. It must feel like a ₹8-lakh purchase, not a ticketing app |
| **Admin** | *Command* — dark mode, dense data, multi-panel, keyboard shortcuts, built for 2–3 monitors | One person monitors an entire city. Density is the feature |
| **Owner** | *Executive* — dark mode, very few numbers, very large type, charts over tables | Strategy only. If it takes more than 10 seconds to read, it does not belong here |

Each theme also ships a **high-contrast accessibility variant** and a **night mode**.

---

### LAW 8 — The Floating Help Button (Screen-Aware)

A `?` bubble floats on the bottom-right of **every screen**, draggable, never covering a primary action.

Tapping it opens a sheet with **four tabs**:

1. **"What is this screen?"** — 3 lines, plain language, in the active language
2. **"Show me"** — a 20–40 second screen-recorded walkthrough of *this exact screen*
3. **"Ask AI"** — a context-aware chatbot that already knows the user's role, current screen, current job ID, and current blocker. It answers with a tappable action, not a paragraph.
4. **"Call Admin"** — one tap, connects to the on-duty admin line; the call auto-attaches the current screen, job ID and last error

**Layer 3 detail:** Every Help open is logged with `screen_id`. If 15+ users open Help on the same screen in a week, Admin gets a **"Confusing Screen" alert** — the help button doubles as a live UX defect detector.

---

### LAW 9 — Adaptive on Every Screen Size (VIMP)

One codebase, five breakpoints:

| Breakpoint | Device | Layout behaviour |
|---|---|---|
| < 360px | Old budget Android | Single column, essential actions only, images degraded |
| 360–480px | Standard phone (most riders/technicians) | Single column, bottom nav, map full-bleed |
| 481–834px | Tablet / large phone | Map + side panel |
| 835–1440px | Laptop | Map + two panels + persistent filters |
| > 1440px | Admin desktop / TV wall | 3–4 panel command view, live alert ticker |

**Non-negotiables:** works in portrait and landscape; survives font scaling to 200%; survives one-handed use; survives a cracked screen with a dead zone (no critical control within 8px of any edge); **works offline** (see Law 12).

---

### LAW 10 — Two Doors: Demo and Real, Never Mixed

The login screen has exactly two buttons:

```
┌──────────────────────────────────────┐
│      ALL INDIA ELEVATORS COMPANY     │
│                                      │
│   [  🔵 Continue with Google  ]      │
│   [  🟠 Try Demo — No Signup  ]      │
│                                      │
│         Language: EN | मर | हि        │
└──────────────────────────────────────┘
```

**Real login (Google OAuth):** → phone OTP → role detection → KYC where required (Aadhaar/PAN for workers, GST for suppliers) → live production data.

**Demo login:** → pick any role from a grid → instantly inside a **fully populated sandbox city** with 40 fake leads, 12 fake jobs, 3 containers in transit, and a fake wallet with ₹4,320.

**Demo mode isolation — the hard rules:**

| Rule | Implementation |
|---|---|
| Separate database | Demo runs on a distinct schema/tenant with `is_demo = true`; no shared tables |
| No real money | Payment SDK swapped for a mock provider; no gateway keys loaded |
| No real messages | WhatsApp/SMS/voice calls simulated in-app only; outbound APIs disabled at network layer |
| Visually obvious | A persistent orange "DEMO MODE" ribbon on every screen |
| Auto-reset | Demo tenant resets to a clean seeded state every 24 hours |
| One-way door | A demo account can convert to real (data does not carry over); a real account can never enter demo |
| Real map, real GPS | The map, GPS and camera are **genuinely live** even in demo — only money and messaging are simulated |

---

### LAW 11 — Real Map, Real GPS, Real Camera — From Day One

No mock data in production paths. Ever.

**Permissions requested at first run, with a plain-language reason screen before the OS dialog:**

| Permission | Why | If denied |
|---|---|---|
| Location (Always, for field roles) | Route tracking, geofenced check-in, auto-address | 🔒 Field roles cannot capture leads or check in |
| Camera | All evidence, QR scans, handover proof | 🔒 No SOP step can be completed |
| Storage | Offline photo queue | Photos held in RAM only, risk of loss |
| Notifications | Task dispatch, alerts | Daily schedule cannot be enforced |
| Microphone | Voice input, voice notes on complaints | Text fallback |

**Anti-spoofing (this protects the entire payment model):**

- **Mock-location detection:** `isFromMockProvider` checked on every ping; detected → account auto-suspended
- **Camera-only capture:** photos must come from the in-app camera. Gallery upload is disabled for all evidence. There is no "choose from gallery" button on evidence screens.
- **EXIF + server timestamp binding:** device time is ignored; the server stamps the time on receipt
- **Geofence tolerance:** evidence must be captured within a 50 m radius of the site pin
- **Sequence lock:** SOP Step 8 photo cannot be taken before Step 7 is verified
- **Perceptual hash duplicate check:** re-submitting the same photo on a different job is detected and flagged
- **Liveness for handovers:** front-camera face capture at digital-signature moments

---

### LAW 12 — Enterprise Grade, Asset-Light, Aggregator, Automated, Zero-Risk

The operating doctrine, stated as system behaviour:

- **Asset-light:** The company owns no lifts, no inventory, no vehicles, no warehouses. It owns the platform and the customer relationship. Material sits with the supplier until paid; labour is aggregated, not employed.
- **Aggregator:** Suppliers and technicians are onboarded as independent partners with rated performance and dynamic allocation. Capacity scales by adding partners, not payroll.
- **Automated:** Target ≥95% of state transitions occur without human intervention. Human touch is designed in at exactly three points: manual negotiation below 30% margin, critical evidence disputes, and safety escalations.
- **One-person monitored:** The Admin console is built for exception handling only. If Admin is doing routine work, the automation has failed and the System Efficiency Index will show it.
- **Production line:** Every job moves through fixed stations with fixed entry/exit gates. No job skips a station. No station has a queue longer than its SLA.
- **Risk-reduced (read this carefully):** Milestone payments, digital agreements, geo-verified handovers, triple-key container locks and evidence-gated payouts collapse *financial and disputational* risk close to zero.

> ⚠️ **Honest limit — read Part 14 before go-live.** "Zero liability" is achievable for **payment and material risk**. It is **not** legally achievable for **lift safety** in Maharashtra. Lift erection and operation are governed by the Maharashtra Lifts, Escalators and Moving Walkways Act and its rules — permission from the Electrical Inspectorate before erection, a licence before operation, and registered installer requirements. A platform cannot contract its way out of statutory safety duty, and consumer law will treat the brand as a service provider regardless of aggregator framing. Part 14 lists what must be in place. This is a build-order issue, not a blocker — but building the app first and the compliance later is the single fastest way to lose the business.

---

# PART 1 — FIRST RUN
### From download to inside the app, in under 90 seconds

---

### 1.1 Install & Splash

App opens on the AIEC mark over a dimmed live map of Pune. Below it, a single line:
*"Har lift, ek ID. Har kaam, ek proof."* (Every lift, one ID. Every job, one proof.)

Language chips appear immediately — **EN | मराठी | हिंदी** — before login, so a Marathi-speaking rider never has to read an English word to get in.

### 1.2 The Two Doors

As per **Law 10**, exactly two buttons. Nothing else on screen. No signup form, no email field, no "learn more" clutter.

### 1.3 Path A — Try Demo (for a new user, an investor, or a candidate worker)

```
Tap "Try Demo"
   ↓
Role grid appears (8 tiles with icons):
   [Rider] [Sales] [Customer] [Technician]
   [QC] [Supplier] [Admin] [Owner]
   ↓
Tap a tile → you are inside. No password, no OTP, no wait.
   ↓
A 4-card coach overlay appears on the map:
   1. "This is your map. Everything lives here."
   2. "This is your Money Meter. It updates as you work."
   3. "This is your next task. The clock is running."
   4. "Stuck? Tap the ? button. It knows this screen."
   ↓
Orange "DEMO MODE" ribbon stays pinned to the top for the whole session.
```

The sandbox is pre-seeded so the app looks *alive* on second one — 40 leads, 12 running jobs, containers moving on the map, a wallet with money in it, a leaderboard with names on it. An empty demo kills conversion.

**Bottom of every demo screen:** a slim bar — *"Liked it? Create your real account →"*

### 1.4 Path B — Continue with Google (real users)

```
Google OAuth
   ↓
Phone number + OTP (this is the true identity key in India, not email)
   ↓
🤖 Role detection:
   • Number already in system → role auto-assigned, straight to home
   • New number → "How do you want to use AIEC?" → Customer / Worker / Supplier / Partner
   ↓
Role-specific onboarding:
   • Customer  → site address, lift requirement basics (2 screens, done)
   • Worker    → full aggregator onboarding (see Part 8)
   • Supplier  → GST, product catalogue, capacity, bank details
   • Partner   → city, territory, royalty agreement
   ↓
Permission reason-screens (Law 11), then OS dialogs
   ↓
Home map, themed for the role (Law 7), in the chosen language (Law 6)
```

### 1.5 What Gets Created Silently at First Login

The moment a real account is created, the system generates its Unique Location ID (**Law 1**) from the GPS fix or declared address, opens its wallet ledger, subscribes it to the correct Daily Routine Schedule (**Law 3**), and writes the first line of its permanent timeline.

The user sees none of this. They see a map.

---

# PART 2 — ROLE 1: THE FIELD RIDER (Lead Hunter)
### Section B, Point 1 — *"person travel on bike all over city and find construction sites where lift shaft is ready"*

---

## A. Who & What They See

**Who:** A rider on a two-wheeler, covering assigned zones of Pune, 6–8 hours a day, often in sun, dust and traffic. Possibly reading Marathi only. Definitely wearing a helmet and holding a phone in one hand.

**Theme:** *Sunlight* (Law 7) — white/orange, 72px buttons, 22pt minimum text, one primary action per screen, voice input everywhere.

**Default language:** मराठी.

**Screen inventory:**

| # | Screen | Purpose |
|---|---|---|
| R1 | **Ride Map** (home) | Live position, today's route trail, captured pins, opportunity heatmap |
| R2 | **Capture** | The 3-tap lead capture flow |
| R3 | **My Leads** | Every pin the rider dropped, with conversion status |
| R4 | **Coverage** | Distance, area covered, zones done vs pending |
| R5 | **Earnings** | Wallet, pending vs cleared, payout countdown |
| R6 | **Leaderboard** | City rank, zone rank, streaks, badges |
| R7 | **Schedule** | Today's routine, pushed by the AI controller |

---

## B. Start-to-End Walkthrough — One Full Rider Day

### **07:45 — 🤖 The day starts without the rider opening the app**

Push notification, in Marathi, with a 15-second audio prompt:

> *"शुभ सकाळ रवी. आज कोथरूड झोन. काल तुम्ही ६ लीड्स केल्या — आज ८ केल्या तर ₹240 बोनस. सुरू करूया?"*
> ("Good morning Ravi. Today: Kothrud zone. Yesterday you did 6 leads — do 8 today for a ₹240 bonus. Shall we start?")

Tapping the notification opens **R7 Schedule**:

```
┌──────────────────────────────────────────┐
│  TODAY · Thursday · Kothrud (KOT)        │
│                                          │
│  08:00  Start ride  📍 check-in          │
│  08:00–12:00  Zone sweep — target 5      │
│  12:00–12:30  Break (paid ₹30 if logged) │
│  12:30–17:00  Zone sweep — target 3      │
│  17:30  End ride + daily summary         │
│                                          │
│  💰 Today's potential: ₹640 + ₹240 bonus │
│           [ START RIDE ]                 │
└──────────────────────────────────────────┘
```

### **08:00 — 👤 START RIDE**

One tap. 📍 GPS check-in recorded, route tracking begins, screen switches to **R1 Ride Map**.

The map now shows:
- **Blue dot** — the rider, live
- **Blue trail** — the route travelled today, drawn behind them
- **Orange heat blobs** — 🤖 predicted high-opportunity areas
- **Grey pins** — leads they already captured (theirs)
- **Faded grey pins** — leads captured by other riders (so two riders never capture the same shaft)
- **Top strip** — `Today: 0 leads · ₹0 · 0.0 km`

**How the heatmap is generated (Layer 3):** The AI scores every 250m grid cell of the city on: new building-plan approvals in that ward, historical lead-to-win conversion, days since last rider visit, distance from current position, competitor lift installations detected, and construction density from satellite/street imagery. Darkest orange = go there now.

### **08:22 — 👤 Rider spots a G+4 building with an open lift shaft**

He stops the bike. Does **not** unlock into a menu. The app is already on the capture-ready map, with one giant button at the bottom:

```
        ┌──────────────────────┐
        │   📷  CAPTURE LEAD   │
        └──────────────────────┘
```

### **08:23 — The 3-Tap Capture (this flow is the entire product for this role)**

**TAP 1 — Shaft photo.** Camera opens instantly. Live overlay guide: *"Frame the full shaft opening."* Shutter. 📷 📍 GPS locked at the moment of capture.

**TAP 2 — Building photo.** Camera stays open. *"Now the full building."* Shutter.

**TAP 3 — Contact.** Camera stays open. *"Photo of the site board or contractor's number."* Shutter.
🤖 On-device OCR reads the board and extracts phone number, builder name and project name automatically. Rider only corrects it if it is wrong — and can correct it **by voice**.

Then **one confirm screen**, pre-filled, nothing mandatory:

```
┌──────────────────────────────────────────┐
│  🤖 AUTO-DETECTED                        │
│  📍 Survey 42, Kothrud, Pune 411038      │
│  🏢 Shreeji Heights (from board OCR)     │
│  📞 98XXXXXX21                           │
│  🏗 Floors detected: G+4  [edit]         │
│  🪜 Shaft status: Ready   [edit]         │
│                                          │
│  🎤 Add voice note (optional)            │
│                                          │
│  ID: MH-PUN-KOT-LEAD-0447-J              │
│            [ SUBMIT ]                    │
└──────────────────────────────────────────┘
```

**Elapsed time: 11 seconds.** Helmet can stay on. This is the design target — if capture takes longer than 15 seconds, riders stop capturing.

### **08:23 — 🤖💰 The instant reward (Law 4)**

Coin-drop animation, a short chime, and the top strip updates live:

```
+₹40 credited  ·  Today: 1 lead · ₹40 · 4.2 km
```

Behind it, silently:
- `MH-PUN-KOT-LEAD-0447-J` created
- 3 `EVID` records auto-tagged to it
- 🤖 Duplicate check against all pins within 50 m → clean
- 🤖 Quality score computed (photo clarity, shaft visibility, contact readability, floor count confidence)
- 🤖 Lead pushed to the Sales queue **immediately** — no batching, no end-of-day sync (Section B: *"forwarded for Sales section automatically"*)

**⚠️ Quality gate:** A lead scoring below threshold (blurry, no shaft visible, unreadable number) credits **₹10 instead of ₹40** and shows *"Photo unclear — retake for full ₹40?"* — this stops photo-spam farming without punishing an honest rider.

### **Through the day — the app keeps steering**

- **09:40, no capture for 45 min:** *"तुम्ही 1.2 किमी वर एका हॉट झोनजवळ आहात — तिकडे जाऊया?"* with a Navigate button
- **11:15:** *"3 more leads before lunch = ₹120 + streak alive"*
- **12:00:** break auto-detected from motion sensors; ₹30 credited for logging it (this exists so riders *do* take breaks — a fatigued rider on a bike is the single biggest safety liability in this role)
- **Anytime:** tapping any of his own pins opens the Entity Card with the photos, the current sales stage, and — critically — **whether it converted and what commission is coming**

### **17:30 — 👤 END RIDE → 🤖 Day Summary**

```
┌──────────────────────────────────────────┐
│  RAVI · KOT · Thursday                   │
│                                          │
│  Leads captured        8   ✅ target hit │
│  Distance              38.4 km           │
│  Area covered          6.2 km²           │
│  New ground            2.1 km²           │
│  Quality score         91%               │
│                                          │
│  💰 Base        ₹320                     │
│  💰 Target bonus ₹240                    │
│  💰 Break log    ₹30                      │
│  ─────────────────────────               │
│  💰 TODAY       ₹590                      │
│  💰 Pending conversion commissions  ₹4,200│
│                                          │
│  🏆 City rank: #3 (▲2)  · 🔥 Streak: 11d │
│                                          │
│  🤖 Tomorrow: Baner (BAN). 3 hot zones   │
│     ready. Suggested start 08:00.        │
└──────────────────────────────────────────┘
```

---

## C. Section A Laws Applied to the Rider

| Law | How it lands on this role |
|---|---|
| **1 · Unique ID** | Every lead is `MH-PUN-{ZONE}-LEAD-nnnn-x`; all 3 photos, the GPS trail segment, the voice note and the eventual commission are auto-tagged to it |
| **2 · Map-first** | R1 *is* the home screen; there is no list-first view; every pin is tappable to full detail |
| **3 · AI supervisor** | Daily schedule pushed at 07:45; zone assigned by AI; nudges when idle; auto-reassigns unworked zones |
| **4 · Micro-money** | ₹40/lead instantly, ₹30 break log, target bonus, conversion commission later — coin animation every single time |
| **5 · Role clarity** | Task Card shows zone, target count, time window and exact rupee value before the ride starts |
| **6 · 3 languages** | Marathi default; voice prompts, OCR correction by voice, all notifications translated |
| **7 · Theme** | *Sunlight* — glare-readable, glove-usable, one-hand-usable, helmet-compatible |
| **8 · Help button** | On the capture screen it explains framing; on the heatmap it explains why a zone is orange |
| **9 · Adaptive** | Built first for a ₹8,000 Android phone at 360px; degrades images, never degrades the capture flow |
| **10 · Demo** | Demo rider gets a seeded route in a sandbox zone with fake commissions and a live camera + live map |
| **11 · Real GPS/cam** | Mock-location = instant suspension; gallery upload disabled; server-side timestamps |
| **12 · Zero-risk** | Rider is an aggregated partner paid per verified output, not a salaried employee carrying idle cost |

---

## D. Money for the Rider

| Trigger | Amount | Clears when |
|---|---|---|
| Valid lead captured | ₹40 | AI quality score passes (instant) |
| Low-quality lead | ₹10 | Instant |
| Daily target hit (8 leads) | ₹240 | End of day |
| Break logged | ₹30 | Instant |
| New-ground bonus (unvisited grid) | ₹15/lead | Instant |
| **Lead converts to won deal** | **₹1,500** | Token payment received |
| **Lead reaches full installation** | **₹1,000** | NOC issued |
| 7-day streak | ₹500 | Sunday |
| Monthly zone #1 | ₹5,000 | Month end |

> The two large amounts are deliberately *back-loaded to conversion*. Capture volume pays lunch money; conversion pays rent. This aligns the rider with revenue instead of with photo count — and it is why the quality gate matters more than the capture reward.

---

## E. What Blocks the Rider

| Situation | System response |
|---|---|
| No network | Full offline capture; photos + GPS queued locally; syncs automatically; wallet shows "₹40 (syncing)" |
| GPS unavailable indoors | Capture button greys out with *"Step outside — GPS needed for this lead"* |
| Duplicate shaft within 50 m | 🔒 Blocked: *"Already captured by Ravi on 12 Aug — see pin"* |
| Mock location detected | 🔒 Account suspended immediately, admin alert raised |
| Camera denied | 🔒 Cannot capture; permission reason-screen re-shown |
| Phone battery < 10% | 🤖 Switches to low-power mode: map simplifies, GPS interval drops, capture stays full-quality |
| Rider stationary 90+ min | 🤖 Welfare check ping; no response in 15 min → admin alert (safety, not surveillance) |

---

# PART 3 — ROLE 2: THE AUTOMATED SALES ENGINE
### Section B, Point 2 — *"leads organise on map → WhatsApp with photos → auto call → auto quotation → bot negotiation → digital agreement → ₹10k token"*

---

## A. Who & What They See

**Who:** Mostly *nobody*. This role is ~90% machine. A single human **Sales Desk operator** exists only to catch deals that the bot cannot close — negotiations that fall below the 30% discount line, and customers who explicitly ask for a human.

**Theme:** *Command* (light variant) — pipeline board over the map.

**Screen inventory:**

| # | Screen | Purpose |
|---|---|---|
| S1 | **Pipeline Map** (home) | All leads as coloured pins by funnel stage |
| S2 | **Lead Card** | Full lead detail, photos, bot transcript, quotation versions |
| S3 | **Bot Console** | Live view of every automated conversation in progress |
| S4 | **Manual Desk** | Only the deals escalated to a human |
| S5 | **Quote Builder** | Rate-card configuration (Admin-locked) |
| S6 | **Conversion Analytics** | Funnel by zone, by lift type, by rider |

---

## B. Start-to-End Walkthrough — A Lead Becomes a Signed Deal

### **T+0 sec — Lead lands**

`MH-PUN-KOT-LEAD-0447-J` arrives from Ravi. 🤖 The Lead Scoring Engine runs immediately:

| Signal | Weight |
|---|---|
| Shaft readiness (AI vision on the photo) | 25% |
| Floor count (higher = larger order value) | 20% |
| Zone conversion history | 15% |
| Contact quality (mobile vs landline vs none) | 15% |
| Builder type (individual / small builder / developer) | 15% |
| Photo clarity & completeness | 10% |

Score ≥ 70 → **Hot**, enters the automated sequence within 60 seconds.
Score 40–69 → **Warm**, enters sequence at the next 10:00 or 16:00 batch.
Score < 40 → **Cold**, held for a re-visit request to the rider.

### **T+60 sec — 🤖 WhatsApp goes out (with the site's own photos)**

This is the psychological core of the whole sales motion: **the first message shows the customer a photo of their own building.** It is not a broadcast. It cannot be mistaken for spam.

Message structure (Business API template, pre-approved in all 3 languages — Law 6):

```
नमस्कार 🙏

आम्ही आज तुमच्या साइटवर आलो होतो —
Shreeji Heights, कोथरूड.

[ photo: their shaft ]
[ photo: their building ]

तुमचा लिफ्ट शाफ्ट तयार दिसतोय.
G+4 साठी आमचा अंदाजे दर + 3D ड्रॉइंग
पाहायचे आहेत का?

ALL INDIA ELEVATORS COMPANY
Ref: MH-PUN-KOT-LEAD-0447-J

[ हो, दर पाठवा ]  [ नंतर बोला ]  [ नको ]
```

Three tappable quick-reply buttons. No typing required from the customer.

**Language selection logic:** zone demographics → builder name pattern → first reply language detection. The bot switches mid-conversation the moment the customer replies in another language.

### **T+2 min to T+24 hr — 🤖 Response branches**

| Customer taps | System does |
|---|---|
| **हो, दर पाठवा** (Yes) | Voice bot calls within 2 minutes, while intent is hot |
| **नंतर बोला** (Later) | Schedules callback; asks for preferred time via quick-replies |
| **नको** (No) | Marks lost with reason; suppresses all future contact for 180 days |
| *No response* | Follow-up at +24 h, then +72 h with a different angle (finance/EMI), then +7 d final. Then stop. **Three attempts maximum** — this is both a WhatsApp policy requirement and simple respect |

### **T+4 min — 🤖 The Multilingual Voice Bot Call**

The bot's job is **not** to sell. It is to collect six data points and book the next step. It speaks in the customer's language, at a natural pace, and hands off to a human the moment it detects frustration.

**The six questions:**

1. Number of floors / stops → *G+4, 5 stops*
2. Passenger capacity → *6 person / 8 person / 480 kg*
3. Lift type → *Automatic door / Manual (collapsible) door*
4. Cabin finish → *Stainless steel (SS) / Powder-coated MS*
5. Target timeline → *when do they need it running*
6. Decision maker → *is this person the one who signs*

Full transcript + audio recording saved as a `CHAT` record against the lead. Every claim the bot makes is scripted and logged — no improvisation on price or specification.

**🤖 Handoff triggers (immediate transfer to human):** customer asks for a person · sentiment turns negative · a technical question outside the script · price challenged more than twice · any safety or legal question.

### **T+9 min — 🤖 Automatic Quotation Generation**

Now the site photos pay off a second time. The quote engine combines:

```
  Rider's photos (shaft width/depth estimated by AI vision)
+ Voice bot answers (floors, capacity, type, finish)
+ Zone-based logistics cost
+ Live supplier rate card
+ Current steel/copper index
= BASE COST
```

Then the pricing ladder from Section B is applied exactly:

```
BASE COST                                    ₹ 5,00,000
+ 60% negotiation margin (list price)        ₹ 8,00,000   ← what the customer first sees
                                                  │
                                   bot may discount up to 30%
                                                  ▼
Bot's floor (auto-approved)                  ₹ 6,15,000   ← ≈23% margin retained
                                                  │
                             below this → 🔒 HUMAN DESK ONLY
                                                  ▼
Absolute minimum margin (hard-locked)        ₹ 6,00,000   ← 20% floor. System cannot go lower.
                                                          Not even Admin. Only Owner override.
```

**Layer 3 — why 60/30/20 works and where it breaks:**
The 60% headroom exists so the customer experiences *winning* a negotiation — which is what closes deals in this market. But an unrealistically inflated list price destroys trust with informed buyers who have three other quotes. The system therefore performs a **market-sanity check**: if the list price exceeds the zone's 90th-percentile competitor quote for the same configuration, the engine reduces the starting markup automatically. Fake discounts on a fake price only work once.

The generated quotation PDF contains: itemised specification, 3D shaft rendering from the rider's photos, delivery timeline, payment schedule (10k / 90% / 10%), EMI options, warranty and AMC terms, and its own ID `MH-PUN-KOT-QUOT-0447-01-R`. Every revision increments the version and is retained.

### **T+11 min — 🤖 The Negotiation Bot**

Delivered on WhatsApp, in the customer's language, with strict rules:

| Rule | Behaviour |
|---|---|
| Never opens with a discount | Opens with value: warranty, 2-week install guarantee, IoT-secured material |
| Concedes in decreasing steps | 8% → 5% → 3% → 2% → final. Never a single large drop |
| Every concession needs an exchange | Faster payment, an AMC add-on, a referral, or a testimonial |
| Uses real scarcity only | "This supplier rate is locked for 72 hours" — because it genuinely is |
| Hard stop at 30% | 🔒 The bot physically cannot type a lower number |
| Detects fatigue | 3 rounds with no movement → offers a human call rather than grinding |

### **T+2 days — 👤 Manual Desk (only if needed)**

Escalated deals surface on **S4** with everything pre-assembled: full transcript, all quote versions, the customer's stated objection, the exact margin position, and 🤖 **a recommended counter-offer with a predicted win probability.** The human operator negotiates between 20% and 30% margin. Below 20% requires Owner approval with a written reason, recorded permanently.

### **T+3 days — 👤 Deal Won → Digital Agreement**

```
🤖 Auto-generates the agreement (Aadhaar eSign / DSC compliant)
   ↓
Customer receives WhatsApp + app link
   ↓
👤 Reads (3 languages, side-by-side view available)
   ↓
👤 OTP verification → 👤 e-signature → 📷 selfie liveness capture
   ↓
🤖 Agreement AGMT ID generated, PDF locked, hash stored, copies sent to both parties
   ↓
💰 ₹10,000 token payment screen opens immediately in the same flow
```

**Why ₹10,000 and why it is collected in the same breath as the signature (Layer 3):**
A ₹10k token on an ₹8-lakh purchase is under 1.3% — low enough that a builder pays it without a committee meeting. That is the entire point: it is not revenue, it is a **commitment device**. The moment money moves, the psychology of the deal flips from "considering vendors" to "our lift project has started." Collecting it *inside the signature flow*, before the customer leaves the screen, roughly doubles collection versus sending a payment link later.

### **T+3 days, +2 min — 🤖 The cascade fires**

The token payment triggers eight automatic actions with zero human involvement:

1. `CUST` ID created, customer account activated, Premium theme loaded
2. `LIFT` ID created — the physical unit now exists in the system
3. Map pin turns 🟣 purple
4. **Shaft Readiness SOP** dispatched to the customer (Part 4)
5. QC inspection auto-scheduled for shaft-ready + 1 day
6. Supplier notified; material tentatively allocated
7. 💰 Rider Ravi credited ₹1,500 conversion commission — with a push notification naming the site he captured
8. AMC pre-enrolment created (activates at NOC)

---

## C. Section A Laws Applied to Sales

| Law | How it lands |
|---|---|
| **1 · Unique ID** | LEAD → QUOT (versioned) → AGMT → CUST → LIFT, chained; every WhatsApp message, call recording and price change is tagged to the chain |
| **2 · Map-first** | S1 is a map of the funnel; colour = stage; drawing a lasso on the map filters the pipeline to that area |
| **3 · AI supervisor** | The AI *is* the salesperson; humans handle exceptions only; every follow-up is scheduled and enforced by the controller |
| **4 · Micro-money** | Desk operator earns per manually-closed deal above 20% margin, scaled by the margin they protect |
| **5 · Role clarity** | Manual Desk shows margin position, predicted win %, and the operator's own commission on every card |
| **6 · 3 languages** | WhatsApp templates, voice bot, quotation PDF and agreement all render in EN/MR/HI; bot switches mid-thread |
| **7 · Theme** | Pipeline-board density; built for a desktop |
| **8 · Help button** | On the Quote Builder it explains every rate-card field and shows the resulting margin live |
| **9 · Adaptive** | Full function on tablet so the desk operator can work from anywhere |
| **10 · Demo** | Demo sales role runs a scripted negotiation the user can play against; no real messages leave the device |
| **11 · Real GPS/cam** | Quotes are built from *real* rider photos; no stock imagery is ever used in a customer-facing document |
| **12 · Zero-risk** | Margin floor is coded, not policy; ₹10k token filters non-serious buyers before any cost is incurred |

---

## D. Money in Sales

| Trigger | Who earns | Amount |
|---|---|---|
| Bot-closed deal | Company | Full margin, no commission paid |
| Manually-closed deal | Desk operator | 1% of deal value, ×1.5 if margin held above 25% |
| Rider conversion commission | Rider | ₹1,500 |
| Token collected | Company | ₹10,000 (adjusted against the 90% milestone) |

---

## E. What Blocks Sales

| Situation | System response |
|---|---|
| Wrong/dead phone number | Lead returns to rider queue as *"re-visit for contact"*; rider earns ₹20 for the correction |
| Customer wants a lift type not in the catalogue | 🔒 Bot cannot quote; routes to Manual Desk with a "custom spec" flag |
| Price demanded below 20% margin | 🔒 System-blocked; Owner override only, with logged reason |
| Customer requests a site visit before quoting | Auto-schedules the nearest QC inspector; ₹300 visit fee credited to the inspector |
| WhatsApp template rejected by Meta | 🤖 Falls back to SMS + voice call; admin alerted to fix the template |
| Token payment fails | 3 auto-retries over 48 h with alternate methods; then Manual Desk callback |

---

# PART 4 — ROLE 3: THE CUSTOMER
### Section B, Points 3–8 — *"SOP for shaft readiness → drawings → 90% on container arrival → EMI → handover → 10% → NOC → AMC"*

---

## A. Who & What They See

**Who:** A builder, contractor or building society secretary who has just paid ₹10,000 and is now nervous about ₹8 lakhs. Their entire experience of this company from here on is this app. **Anxiety reduction is the product.**

**Theme:** *Premium* (Law 7) — white and gold, large photography, serif headings, generous whitespace. It should feel closer to a private bank's app than to a service ticketing tool.

**Default language:** English, one tap to switch.

**Screen inventory:**

| # | Screen | Purpose |
|---|---|---|
| C1 | **My Lift** (home) | Map pin + live progress ring + next action |
| C2 | **Quotation & Agreement** | All versions, the signed PDF, negotiation history |
| C3 | **Shaft Readiness SOP** | Illustrated checklist of what the customer must build |
| C4 | **Drawings & Technical** | GA drawings, shaft dimensions, power spec, civil requirements |
| C5 | **Payments** | Schedule, receipts, EMI, outstanding |
| C6 | **Live Container** | Real-time GPS of their material + CCTV access |
| C7 | **Installation Progress** | Day-by-day photo evidence from the technician |
| C8 | **Handover & NOC** | Trial runs, signatures, certificates |
| C9 | **Support Bot** | Complaint chat, AMC requests, escalation |
| C10 | **AMC** | Service schedule, visit history, renewal |

---

## B. Start-to-End Walkthrough — The Customer Journey

### **Stage 1 — Day 0: Welcome & the Progress Ring**

The moment the token clears, C1 opens with a gold progress ring. This single element carries the entire relationship:

```
        ╭───────────────────────╮
        │      ⬤ 12%            │
        │   TOKEN PAID          │
        │                       │
        │  Next: Prepare shaft  │
        │  Target: 25 Aug       │
        ╰───────────────────────╯

  ●━━━━━○──────○──────○──────○──────○
 Token  Shaft  QC    Material Install Handover
```

Below it: their site pin on the map, their `LIFT` ID, and one primary action button. **Never more than one primary action on this screen at a time.**

### **Stage 2 — Days 0–14: Shaft Readiness SOP (C3)**

*Section B: "customer receive SOP of how to ready lift shaft and power supply as per guidance rules... so as to Technician install lift fast without interrupted"*

This is where most elevator projects lose 3–6 weeks. The system attacks it with a photo-verified checklist the customer completes themselves.

Each item shows: an illustrated diagram, the exact requirement, the reason, and a camera button.

| # | Requirement | Verification |
|---|---|---|
| 1 | Shaft internal dimensions per drawing (±25 mm) | 📷 photo with the AIEC measuring tape in frame |
| 2 | Shaft plumb and true, all walls plastered | 📷 4 photos, one per wall |
| 3 | Pit depth as per GA drawing, waterproofed, dry | 📷 photo with depth marker |
| 4 | Overhead headroom clear | 📷 upward photo |
| 5 | Machine room / MRL space ready, ventilated | 📷 photo |
| 6 | 3-phase power terminated at machine room, earthing done | 📷 photo of DB + earth pit |
| 7 | Shaft openings barricaded, safe access | 📷 photo |
| 8 | Scaffold or working platform available | 📷 photo |
| 9 | Storage space for the container, truck-accessible | 📷 photo of the approach |
| 10 | Water and lighting at the shaft | 📷 photo |

**How this actually works (Layer 3):** The customer usually does not do this themselves — they forward it to their site contractor. So the app has a **"Share with my contractor"** button that issues a limited-scope guest link. The contractor can upload photos against the checklist without an account, and every upload is still 📍 geofenced and 📷 camera-only. The customer sees progress fill up without chasing anyone by phone.

🤖 **AI pre-check on every upload:** the vision model verifies the photo actually shows a shaft (not a wall, not a ceiling, not a screenshot), that the measuring tape is legible, and that the geotag is on-site. Rejections come back instantly with a reason — before a human ever looks.

**⏱ The 2-week rule starts here** (Section B: *"must complete work within 2 weeks"* applies to installation; shaft readiness has its own 14-day target). Progress bar, gentle reminders on days 3, 7, 10, 13. Beyond 14 days the material allocation is released to another customer and the schedule re-baselines — stated upfront, never as a surprise.

### **Stage 3 — Day ~14: QC Clearance Visit (see Part 5)**

Customer sees: inspector's name, photo, rating, live ETA on the map, and — after the visit — the signed clearance report. If anything failed, they get a **rework list with photos and a re-inspection date**, not a phone call and an argument.

### **Stage 4 — Day 15: Drawings Released (C4)**

*Section B: "then Customer receive all Drawings and technical details In the app page"*

Released **only after** QC clearance, because drawings issued against an unverified shaft cause rework — which is exactly what this stage exists to prevent.

Contents: General Arrangement drawing, shaft section, pit and headroom detail, power single-line diagram, civil requirement sheet, cabin finish render, door schedule, and the equipment specification. All downloadable, all versioned, all watermarked with the `LIFT` ID.

### **Stage 5 — Days 15–20: Material Dispatch & the Live Container (C6)**

The customer opens C6 and watches their material physically move toward them. This screen does more for trust than any brochure:

```
┌────────────────────────────────────────┐
│  🚛 CONT-0231 · Your material          │
│  ────────────────────────────────────  │
│  [ live map, truck moving ]            │
│                                        │
│  From: Chakan Supplier Hub             │
│  ETA:  Today, 14:20 (28 km away)       │
│                                        │
│  🔒 Digital lock: SEALED               │
│  📹 CCTV: internal + external ● LIVE   │
│  📡 Motion sensor: normal              │
│  🌡 Container temp: 34°C               │
│                                        │
│  💰 Due on arrival: ₹5,53,500 (90%)    │
│     [ Pay Now ]  [ Apply for EMI ]     │
└────────────────────────────────────────┘
```

### **Stage 6 — Arrival Day: The 90% Payment Gate 🔒💰**

*Section B: "When all material container reached to the site 90% of payment Done by customer online then we do to supplier. if not payed material returned to supplier. win win situation for three of us."*

This is the financial spine of the whole model. The sequence is strict:

```
🤖 Container geofence-arrives at site
   ↓
🤖 Customer notified: "Your material has arrived. Lock opens after payment."
   ↓
👤 Customer pays 90% online  ──OR──  activates pre-approved EMI (NBFC pays on their behalf)
   ↓
🤖 Funds settle into the designated escrow/nodal account
   ↓
🤖 Supplier paid automatically from those funds
   ↓
🔓 Digital lock becomes eligible for the Triple-Key unlock
   ↓
👤 Handover of material begins (Stage 7)

   ── IF NOT PAID WITHIN 48 HOURS ──
🤖 Container never unlocks · truck recalled · material returns to supplier
🤖 Token forfeited or credited against a rescheduled dispatch (per agreement clause)
🤖 Zero loss to company, zero loss to supplier, no material stranded on site
```

**Layer 3 — why this is genuinely a three-way win, and the one place it can break:**
The *supplier* is paid on delivery instead of on 90-day credit. The *customer* pays only when the goods are physically at their gate, visible on CCTV, still locked. The *company* never funds inventory. But the model has one dependency the business must get right before scale: **the escrow/nodal account structure must be legally correct.** If the platform collects the customer's ₹5.5 lakh and pays the supplier, it may be acting as principal in the sale, not as an aggregator — which changes GST treatment, RBI payment-aggregator obligations, and liability. See Part 14, item 3. Solve this with a payments lawyer *before* the first ₹5 lakh moves, not after.

**EMI path:** NBFC integration, material-in-container as collateral (GPS + motion + digital lock is precisely what makes an NBFC comfortable lending against it). Customer submits KYC in-app, gets a decision typically in minutes, and the NBFC disburses directly into escrow. The customer's C5 screen then shows an EMI schedule instead of a lump sum.

### **Stage 7 — Arrival Day: Triple-Key Handover 🔒📷**

*Section B: "digital Lock only open when Customer and technician and admin permission in app with cctv evidence."*

```
        ╔══════════════════════════════════╗
        ║   CONTAINER UNLOCK — 3 OF 3      ║
        ╠══════════════════════════════════╣
        ║  🔑 1  Customer OTP        ✅     ║
        ║        (SMS to registered no.)   ║
        ║  🔑 2  Technician biometric ✅    ║
        ║        (fingerprint + 📍geofence)║
        ║  🔑 3  Admin system approval ⏳   ║
        ║        (auto if 1+2 valid & paid)║
        ╠══════════════════════════════════╣
        ║  📹 CCTV recording · both cams   ║
        ║  🔓 UNLOCK IN 3... 2... 1...     ║
        ╚══════════════════════════════════╝
```

All three keys must be present **within the same 5-minute window and within the same geofence.** Then:

- 📷 Both parties photograph the full material spread
- 🤖 AI counts and verifies items against the BOM
- 👤 Customer and 👤 technician both e-sign the digital handover receipt with liveness selfies
- 🤖 `EVID` package sealed with a hash and stored permanently

From this second, **material custody transfers to the customer's site under the technician's working responsibility.** The company's material liability ends here — and it ends with photo, video, biometric, GPS and dual-signature proof. This is the strongest liability document in the entire system.

### **Stage 8 — Days 20–34: Watching the Install (C7)**

The customer does not have to be on site. Every SOP step the technician completes pushes an update:

```
Day 3 · Step 7/24 · Guide rails aligned ✅
[ photo ] [ photo ] · Verified by AI at 11:42
Next: Machine mounting — tomorrow
Overall: 29% · On schedule · 11 days remaining
```

**⚠️ Deliberate design decision:** the customer sees *progress and evidence*, not the technician's payment or penalty data. Exposing a worker's earnings and penalties to the client destroys the worker's dignity and invites interference. Boundary between roles is enforced.

### **Stage 9 — Day ~34: Handover, 10 Trial Runs, Final 10%**

*Section B: "after installation handover of lift Customer and Installation technician and QC inspector must Available and digital signature taken."*

```
👤 All three physically present (📍 all three phones geofenced on site)
   ↓
👤 Customer performs 10 supervised trial runs — the app counts them live
   ↓ each run logs: floor, door open/close time, levelling accuracy, ride quality
👤 Customer rates the lift ⭐ and the technician ⭐
   ↓
👤 Customer signs · 👤 Technician signs · 👤 QC signs — all with 📷 liveness
   ↓
💰 Final 10% (₹61,500) payment screen opens
   ↓
🔒 NOC + warranty + operating manual released ONLY after payment clears
   ↓
🤖 AMC auto-activates · 🤖 Technician's held payout releases · 🤖 Pin turns 🟢 green
```

**Why the NOC is the final lever (Layer 3):** The customer cannot legally obtain the operating licence from the Electrical Inspectorate without the installer's completion documentation. Withholding the NOC until the final 10% clears makes the last payment effectively self-collecting — no collection calls, no legal notices, no bad debt. It is the single most effective receivables mechanism in the entire design. It must, however, be **explicitly stated in the agreement the customer signs on day 0** — an undisclosed document lever is a dispute; a disclosed one is a payment term.

### **Stage 10 — Year 1 onward: AMC & Complaints (C9, C10)**

- Complaint raised via bot chat, voice note, or one-tap "Lift not working"
- 🤖 Triage: safety-critical (person trapped) → **immediate emergency dispatch, all SLAs bypassed, admin phone rings**
- Non-critical → nearest available technician assigned with an ETA on the map
- Every complaint gets a `CMPL` ID and a full evidence trail
- AMC schedule visible with every past visit's photos and checklist
- Predictive maintenance: IoT data on door cycles, motor current and levelling drift flags likely failures *before* a breakdown

---

## C. Section A Laws Applied to the Customer

| Law | How it lands |
|---|---|
| **1 · Unique ID** | One `LIFT` ID owns everything the customer ever sees; quoting it to support instantly retrieves the entire history |
| **2 · Map-first** | C1 opens on their pin; the container moves on that same map; the technician's live position appears on it during install |
| **3 · AI supervisor** | Reminders on shaft readiness; auto-scheduled QC; auto-released drawings; auto-triaged complaints |
| **4 · Micro-money** | Inverted for customers — *savings*, not earnings: early shaft-readiness discount, referral credit, on-time payment reward |
| **5 · Role clarity** | Exactly one "next action" is ever shown; progress ring makes position obvious in under 2 seconds |
| **6 · 3 languages** | Including the agreement, quotation, SOP, NOC and AMC certificate — legal documents in the language they actually read |
| **7 · Theme** | *Premium* white-and-gold; this screen carries the brand's entire perceived value |
| **8 · Help button** | On the SOP screen it plays a 40-second video of a correctly prepared shaft |
| **9 · Adaptive** | Builders use tablets on site and desktops in the office — full function on both |
| **10 · Demo** | Demo customer walks the entire journey in 5 minutes with a simulated container and mock payments |
| **11 · Real GPS/cam** | Live container CCTV and GPS; SOP photos camera-only and geofenced |
| **12 · Zero-risk** | Milestone payments mean the company is never exposed; the customer is never exposed either — they pay only against physical, visible delivery |

---

## D. Money — Customer Side

| Milestone | Amount (on ₹6,15,000 deal) | Trigger |
|---|---|---|
| Token | ₹10,000 | At agreement signature |
| Material payment | ₹5,53,500 (90%) | Container arrives at gate |
| Final payment | ₹51,500 (10% less token) | At handover, before NOC |
| AMC Year 1 | Included | From NOC date |
| AMC Year 2+ | ₹18,000–₹28,000/yr | Annual renewal |

**Customer-side incentives:** shaft ready in under 10 days → ₹5,000 off · full payment upfront → 2% off · verified referral that converts → ₹10,000 credit · 5★ review with photo → free AMC quarter.

---

## E. What Blocks the Customer

| Situation | System response |
|---|---|
| Shaft not ready in 14 days | Material allocation released; schedule re-baselines; no penalty, but the queue position is lost |
| QC fails the shaft | Rework list with annotated photos; re-inspection auto-scheduled; drawings held |
| 90% not paid in 48 h | 🔒 Container returns to supplier; company and supplier both unharmed |
| EMI rejected by NBFC | Alternative NBFCs auto-tried; then split-payment option; then reschedule |
| Customer absent at container arrival | Nominee can be pre-authorised in-app; otherwise truck waits max 4 h, then returns (waiting charges apply per agreement) |
| Customer absent at handover | 🔒 Handover cannot complete; no NOC; technician's payout holds; rescheduled within 72 h |
| Dispute on quality at handover | Independent QC re-inspection within 24 h; final 10% held in escrow, not forfeited |

---

# PART 5 — ROLE 4: THE QC INSPECTOR
### Section B — *"Quality inspector visit for clearance approval of shaft"* + *"QC done surprisely with strong evidence"*

---

## A. Who & What They See

**Who:** A Level 5 promoted technician (Part 8). They never install — they only judge. This separation is deliberate: **the person who does the work can never be the person who approves the work.** That single rule is what makes the evidence trail credible to an NBFC, an insurer, and a court.

**Theme:** *Slate* — dark grey/cyan, checklist-first, camera-dominant.

**Screen inventory:** Q1 Inspection Map · Q2 Pre-Install Shaft Checklist · Q3 Post-Install Audit Checklist · Q4 Surprise Queue · Q5 Report Builder · Q6 Earnings & Rating

---

## B. Two Different Inspections

### **B1 — Pre-Installation Shaft Clearance (scheduled, announced)**

Purpose: catch every dimensional error *before* material ships. One error caught here saves 5–10 days of rework and several thousand rupees of wasted labour.

```
🤖 Auto-assigned to the nearest available inspector (distance + rating + availability)
   ↓
👤 Accepts task card: "Kothrud · 3.1 km · Shaft clearance · 45 min · ₹450"
   ↓
📍 Geofenced check-in at site (must be within 50 m)
   ↓
👤 Works Q2 — 18 items, each requiring 📷 evidence:
```

| Group | Items |
|---|---|
| Dimensions | Width, depth, plumb, diagonal, at 3 heights |
| Pit | Depth, waterproofing, drainage, cleanliness |
| Headroom | Clear height, obstructions |
| Machine room | Space, ventilation, access, floor strength |
| Electrical | 3-phase supply, earthing, DB rating, cable route |
| Openings | Landing door sizes at every floor |
| Safety | Barricading, access, scaffold |
| Site | Container approach, storage, water, light |

Each item: `PASS` / `FAIL` / `CONDITIONAL`, mandatory 📷 photo, and mandatory note if not PASS.

```
   ↓
🤖 AI cross-checks measurements against the GA drawing tolerance
   ↓
👤 Digital signature → Report generated with its own ID
   ↓
   ├─ ALL PASS → 🟢 Cleared → 🤖 drawings released to customer → 🤖 material allocated
   └─ ANY FAIL → 🔴 Rework list to customer with annotated photos → re-inspection auto-booked
   ↓
💰 ₹450 credited instantly · ₹150 bonus if a genuine defect was caught (verified later)
```

> **The anti-rubber-stamp mechanism (Layer 3):** An inspector who passes everything is *not* rewarded. The bonus is paid for **catching** defects that are later confirmed. And if a shaft passes clearance but the technician subsequently reports a dimensional problem, the system runs an **Inspector Accountability Review** — the inspector's rating drops and, on repeat, their Level 5 status is revoked. Passing is not the profitable behaviour; being *correct* is.

### **B2 — Post-Installation Surprise Audit (unannounced)**

*Section B: "Quality check done by QC Inspector surprisely with strong evidence. Then and then only the payment transfer to the Technicians."*

**How surprise is actually engineered:**

| Mechanism | Detail |
|---|---|
| Random timing | Between 40% and 90% installation progress, exact hour randomised |
| Random selection | 100% of first-3 jobs for any new technician; 30% baseline thereafter; 100% for anyone flagged |
| Zero advance notice | Neither technician nor customer is told; the task appears on the inspector's phone ≤60 min before |
| Rotation lock | 🔒 The same inspector cannot audit the same technician twice in 90 days — kills collusion |
| Distance rule | Inspector is drawn from a *different* zone where possible |
| Silent arrival | The technician's app shows nothing; the first they know is the inspector standing there |

**Q3 audit covers:** SOP sequence adherence · torque and fastener verification (with a torque wrench, photographed) · guide rail alignment (laser, photographed) · wiring routing and termination quality · safety gear installation · material usage vs BOM · scrap accounting · housekeeping and site safety · technician's own PPE compliance.

**Outcomes:**

| Result | Consequence |
|---|---|
| ✅ Pass | 🤖 Technician's held payout releases · ⭐ rating up · streak preserved |
| ⚠️ Minor issues | Rectification list with 48 h window; payout holds until re-verified |
| ❌ Major failure | 🔒 Work stopped immediately · payout frozen · admin alerted · job may be reassigned |
| 🚨 Safety violation | 🔒 Immediate site stop · technician suspended · full incident report to Owner |

---

## C. Section A Laws Applied to QC

| Law | How it lands |
|---|---|
| **1 · Unique ID** | Every inspection is a `QCIN` record chained to the `LIFT` ID; each of the 18–30 checklist photos is its own `EVID` |
| **2 · Map-first** | Q1 sorts pending inspections by real driving distance, not straight-line |
| **3 · AI supervisor** | Assignment, timing randomisation, rotation locks, tolerance checks and accountability reviews are all automatic |
| **4 · Micro-money** | ₹450/inspection instant · ₹150 defect-catch bonus · ₹800 surprise audit · penalties for missed defects |
| **5 · Role clarity** | Task card states site, distance, type, duration, fee before acceptance |
| **6 · 3 languages** | Checklist items and their explanatory diagrams in all three; report generated in the customer's language |
| **7 · Theme** | *Slate*, camera-dominant, readable in a dim shaft |
| **8 · Help button** | On any checklist item, shows the correct/incorrect reference photo pair for that specific check |
| **9 · Adaptive** | Phone in the shaft, tablet for report review |
| **10 · Demo** | Demo QC runs a full mock inspection with sample photos and a generated report |
| **11 · Real GPS/cam** | Geofenced check-in; camera-only evidence; server timestamps prove the visit was unannounced |
| **12 · Zero-risk** | Independent verification is what converts "we did the work" into evidence that survives a dispute |

---

## D. Money for QC

| Trigger | Amount |
|---|---|
| Shaft clearance inspection | ₹450 |
| Genuine defect caught (later confirmed) | +₹150 |
| Surprise post-install audit | ₹800 |
| Emergency/priority inspection | ₹1,200 |
| Handover attendance & sign-off | ₹500 |
| Missed defect found later | −₹1,000 + rating drop |
| Monthly accuracy above 95% | +₹3,000 |

---

# PART 6 — ROLE 5: SUPPLIER & THE SMART IoT CONTAINER
### Section B — *"material dispatched from Supplier in material container"* + anti-theft governance

---

## A. Who & What They See

**Who:** Independent manufacturers and fabricators. The company holds **zero inventory** — this is the asset-light law in physical form.

**Theme:** *Command* (light) — order board, dispatch queue, payment tracker.

**Screen inventory:** P1 Order Board · P2 Kit Packing · P3 Container Loading · P4 Live Fleet Map · P5 Payments · P6 Performance Rating

---

## B. Start-to-End — Order to Payment

### **B1 — Allocation (automatic)**

🤖 On QC clearance, the system allocates the order by a weighted score: price · lead time · quality rating (returns, defects) · distance to site · current capacity · past on-time percentage. Suppliers are ranked, not chosen by relationship. The top-ranked supplier gets a 4-hour acceptance window before it cascades to the next.

### **B2 — Pre-Packed Barcoded Kits (P2) — the micro-theft firewall**

*Section B: "Minor materials arrive in phase-sealed pouches. Technicians can only unlock pouches tied to their current verified SOP stage."*

Instead of shipping a loose pile of bolts, cable and brackets, the supplier packs **phase-sealed pouches**, each with its own `KITB` ID and QR:

| Pouch | Contents | Unlocks at |
|---|---|---|
| KIT-A | Guide rail brackets, fasteners, shims | SOP Step 4 |
| KIT-B | Guide rails, fishplates | SOP Step 6 |
| KIT-C | Machine mounting hardware | SOP Step 9 |
| KIT-D | Control panel, wiring harness, exact cable length | SOP Step 12 |
| KIT-E | Car frame, cabin panels | SOP Step 15 |
| KIT-F | Landing doors (per floor, individually sealed) | SOP Step 18 |
| KIT-G | Safety gear, governor, ARD | SOP Step 21 |
| KIT-H | Trims, finishing, commissioning consumables | SOP Step 23 |

**Layer 3 — why sealed phase-pouches work where inventory registers fail:**
Micro-theft in this industry is not dramatic. It is 12 metres of copper cable here, a box of fasteners there — individually trivial, collectively 3–5% of material cost. A pouch that can only be opened *at* the site, *by* a specific technician, *at* a specific verified SOP stage, with 📷 an open-photo required, removes both the opportunity and the deniability. **The BOM algorithm computes exact cable length from the shaft height** — a request for extra cable is an anomaly the system flags, not a routine phone call.

### **B3 — Container Loading & Sealing (P3)**

📷 Every kit scanned into the container · 📷 loaded-container photo · digital seal applied · IoT array armed:

| Sensor | Function |
|---|---|
| GPS | Continuous position, geofence alerts |
| Accelerometer / motion | Detects movement, tilt, impact |
| Door sensor | Detects any open attempt |
| Internal HD CCTV | Records interior on any trigger |
| External HD CCTV | Records approach and surroundings |
| Digital lock | Triple-key controlled (Part 4, Stage 7) |
| Battery + solar | 30-day autonomy |
| Siren | 110 dB local alarm on unauthorised movement |

### **B4 — Transit → Arrival → Payment**

```
🤖 Departure → live tracking visible to customer, admin, supplier
🤖 Route deviation > 2 km → alert
🤖 Off-hours motion → 🚨 siren + push to Admin + Customer + Supplier, CCTV clip attached
🤖 Geofence arrival at site → customer payment window opens (48 h)
   ↓
💰 Customer pays 90% → escrow → 🤖 supplier paid automatically, same day
   ↓ (if unpaid) → truck recalled → material returns → supplier made whole → zero loss
```

**Supplier payment terms:** paid on delivery-and-collection, not on 60/90-day credit. This is the single most persuasive argument for supplier onboarding in this market, and it costs the company nothing because the customer's money arrives first.

### **B5 — Scrap Return & Wastage Accounting**

At job end, the technician must 📷 photograph and bag all unused material and scrap. 🤖 AI compares against BOM expectations:

- Within tolerance → 💰 **Zero-Wastage Bonus ₹500** to the technician
- Shortfall → market price **+20% penalty** auto-deducted from the technician's wallet
- Excess scrap copper → returned to supplier, credited back to the job's margin
- Pattern of shortfalls across jobs → 🚨 fraud flag, admin review

---

## C. Section A Laws Applied to Supplier & Container

| Law | How it lands |
|---|---|
| **1 · Unique ID** | `SUPP`, `CONT`, and one `KITB` per pouch; every sensor reading is tagged to the `CONT` ID |
| **2 · Map-first** | P4 is a live fleet map; every container is a moving pin visible to supplier, admin and its own customer |
| **3 · AI supervisor** | Allocation, dispatch scheduling, deviation alerts and payment release all automatic |
| **4 · Micro-money** | Supplier on-time bonus; technician zero-wastage bonus; both instant |
| **5 · Role clarity** | Order board shows value, deadline, penalty and payment date on every card |
| **6 · 3 languages** | Packing instructions and kit labels printed bilingually (EN + MR) |
| **7 · Theme** | Dense order-board for warehouse desktop use |
| **8 · Help button** | On the packing screen, shows the correct kit contents photo for each phase |
| **9 · Adaptive** | Warehouse tablet, office desktop, driver's phone |
| **10 · Demo** | Demo supplier can pack and dispatch a simulated container and watch it move |
| **11 · Real GPS/cam** | Genuine IoT hardware from day one; no simulated telemetry in production |
| **12 · Zero-risk** | Company never owns, never stores, never pre-pays material. Risk sits with whoever controls the goods at that moment — and control is provable |

---

## D. Money — Supplier Side

| Trigger | Effect |
|---|---|
| Container delivered + customer paid | 100% supplier invoice, same day |
| Early delivery | +1% bonus |
| Late delivery | −2% per day, capped at 10% |
| Material rejected at QC | Full replacement at supplier cost |
| Quality rating > 4.7 for 3 months | Priority allocation in the ranking engine |

---

# PART 7 — ROLE 6: THE INSTALLATION TECHNICIAN
### Section B — *"complete work within 2 weeks... SOP very strictly... payments only when SOP followed with exact evidence"*
### **This is the highest-risk role in the business. Read this part twice.**

---

## A. Who & What They See

**Who:** An aggregated independent technician, Level 2–4, working inside a concrete shaft with poor light, poor network, and dirty hands. Marathi or Hindi speaking. Paid entirely on verified output.

**Theme:** *Slate* — dark grey/cyan, camera occupies 60% of the screen, huge tick targets, works with gloves, readable in the dark.

**Screen inventory:**

| # | Screen | Purpose |
|---|---|---|
| T1 | **Job Map** (home) | Assigned sites, route, today's step |
| T2 | **Today's SOP Step** | The one thing to do right now |
| T3 | **Full SOP Tree** | All 24 steps, locked/unlocked/done |
| T4 | **Evidence Camera** | Guided capture with overlays |
| T5 | **Materials** | Kit status, BOM, scrap accounting |
| T6 | **Money Meter** | Pending, cleared, penalties, payout countdown |
| T7 | **Leaderboard & Rank** | City rank, level progress, badges |
| T8 | **Training** | SOP videos, refreshers, certification |
| T9 | **Help / Escalate** | Stuck? Reach a senior or admin |

---

## B. Start-to-End — A Full 14-Day Installation

### **Day 0 — 🤖 Job offer arrives**

```
┌────────────────────────────────────────┐
│  NEW JOB · MH-PUN-KOT-LIFT-0089        │
│  📍 Kothrud · 4.2 km from you          │
│                                        │
│  G+4 · 6-person · Auto door · SS       │
│  Start: 22 Aug   Deadline: 5 Sep       │
│  Your level required: L3 ✅            │
│                                        │
│  💰 Total job value    ₹42,000         │
│  💰 On-time bonus      ₹5,000          │
│  💰 Zero-wastage bonus ₹500            │
│  💰 5★ customer bonus  ₹2,000          │
│  ─────────────────────────────         │
│  💰 MAX POSSIBLE       ₹49,500         │
│                                        │
│  [ ACCEPT ]        [ DECLINE ]         │
└────────────────────────────────────────┘
```

Law 5 in its purest form: the technician sees the entire earning potential before saying yes. **Declining is free and unpenalised** — a technician forced into a job they cannot do produces exactly the failure this system exists to prevent.

### **Day 1, 08:00 — 🤖 Daily Routine Schedule**

```
08:00  📍 Site check-in (geofence)
08:15  📷 Site condition photo (start-of-day state)
08:20  Open Step 4 · Bracket layout marking
       ⏱ Est. 3 h · 💰 ₹1,800
11:30  Progress photo
13:00  Break (auto-detected, 💰₹30)
14:00  Step 5 · Bracket fixing · ⏱ 3 h · 💰 ₹2,200
17:30  📷 End-of-day photo + tools secured + 📍 check-out
17:35  🤖 AI verification → 💰 wallet credit
```

### **The SOP Engine — how one step actually works**

This is the mechanism the entire money model rests on. Every one of the 24 steps runs identically:

```
┌─────────────────────────────────────────────────────────┐
│  STEP 6 of 24 · GUIDE RAIL ALIGNMENT       💰 ₹2,800    │
├─────────────────────────────────────────────────────────┤
│  🔓 Unlocked — Step 5 verified at 11:04 today           │
│                                                         │
│  📖 INSTRUCTIONS (मराठी)                                 │
│  1. KIT-B scan करा                                       │
│  2. Rail plumb line laser ने set करा                     │
│  3. Bracket वर rail बसवा — clip torque 45 Nm             │
│  4. प्रत्येक 1.5 m वर alignment तपासा (±0.5 mm)          │
│  5. Fishplate joints घट्ट करा                            │
│                                                         │
│  ▶ Watch 90-sec video     ⚠️ Safety: harness अनिवार्य     │
│                                                         │
│  📷 REQUIRED EVIDENCE (4)                               │
│  [1] Laser line on rail, full height    ⬜             │
│  [2] Torque wrench reading on clip      ⬜             │
│  [3] Fishplate joint close-up           ⬜             │
│  [4] Full shaft wide shot               ⬜             │
│                                                         │
│  🔒 Step 7 unlocks only after all 4 pass AI check       │
│                                                         │
│         [ START STEP ]                                  │
└─────────────────────────────────────────────────────────┘
```

**🤖 What the AI checks on each photo — and this is where the money is protected:**

| Check | What it catches |
|---|---|
| 📍 Geofence (50 m) | Photos taken anywhere but the site |
| ⏱ Server timestamp | Backdating, batch-uploading a week's work in one evening |
| 🔍 Content classification | A photo of a wall submitted as a rail; a photo of another job's rail |
| 📐 Alignment / plumb detection | Rails visibly out of true |
| 🔩 Torque marking detection | Reading the wrench display; verifying paint-mark on tightened fasteners |
| 🖼 Perceptual hash | The same photo reused across steps or across jobs |
| 🎭 Screen-of-a-screen detection | Photographing a photo on another phone |
| 🔗 Sequence integrity | Step 8 evidence appearing before Step 7 was verified |
| 👤 Face match (spot checks) | Someone other than the assigned technician doing the work |

```
   ALL PASS  → ✅ Step verified → 💰 ₹2,800 credited (Pending) → 🔓 Step 7 unlocks
   1 FAIL    → 🔁 "Retake photo 2 — torque reading not legible" (2 retries allowed)
   2 FAILS   → 🚨 Admin review queue; step frozen pending human decision
   3 FAILS   → 🔒 Access revoked; job broadcast to nearby technicians with surge bonus
```

### **Days 2–13 — The 2-Week Clock**

A permanent countdown sits at the top of T1:

```
⏱ 9 days 4 hrs remaining · 62% complete · ✅ ON TRACK
```

🤖 The controller compares actual progress against the ideal burn-down and reacts:

| Status | Response |
|---|---|
| Ahead | 💰 "You're 1.5 days ahead — on-time bonus locked. ₹1,000 extra if you finish 2 days early." |
| On track | Silent. No noise when things are fine. |
| Slipping 1 day | 🤖 Diagnostic push: "Which is blocking you — material, site access, or a technical issue?" with three tappable answers |
| Slipping 2 days | 🚨 Admin notified; helper offered at company cost; on-time bonus at risk |
| Slipping 3+ days | 🔒 Reassignment review; completed steps paid, remaining work rebroadcast |

**Layer 3 — the honest reason the 2-week rule is enforceable here and nowhere else:**
In traditional elevator businesses, installations slip because *nobody can prove why*. Every party blames the other and there is no timestamped record. Here, every delay has an owner in the data: if the customer's shaft was wet, there is a photo; if the material arrived late, there is a container GPS log; if the technician was absent, there is a missing geofence check-in. **The deadline is enforceable because the blame is attributable.** That is the actual innovation — not the deadline itself.

### **Day 14 — Commissioning & Handover**

```
👤 Step 24: 10 supervised trial runs with customer present
   🤖 Each run auto-logged: floor, door timing, levelling accuracy, ride quality
👤 Safety gear test · ARD test · overload test — all 📷 recorded
👤 QC inspector attends (📍 all three geofenced together)
👤 Triple digital signature with 📷 liveness
   ↓
💰 Customer pays final 10% → 🔒 NOC released
   ↓
💰 Technician's full held payout releases into Cleared
   ↓
🏆 Level progress updates · rating updates · streak extends
```

---

## C. The Tiered Promotion Ladder (Law 5 + Law 4, structural)

*"Direct entry into senior roles is locked."*

| Level | Role | Work permitted | To reach the next level |
|---|---|---|---|
| **L1** | Trainee Helper | Material handling, site cleanup, assisting | 20 sites @ 4.2★ + SOP module 1 passed |
| **L2** | Junior Technician | Bracket fitting, shaft alignment, wiring | 50 sites @ 4.5★ + module 2 + 95% SOP accuracy |
| **L3** | Senior Technician | Motor install, control panel, ARD testing | 100 sites @ 4.7★ + module 3 + 98% accuracy |
| **L4** | Master Technician | Full assembly, diagnostics, commissioning | 150 sites + zero safety incidents + mentoring 3 juniors |
| **L5** | QC Inspector / Site Lead | Independent auditing, sign-off authority | — |

Earnings scale roughly 1× / 1.8× / 2.6× / 3.5× / 4× across the ladder. **T7 shows a live progress bar to the next level at all times** — "18 more sites at 4.5★ and your rate goes up 44%." That bar is the strongest retention mechanism in the entire product, and it costs nothing.

---

## D. Section A Laws Applied to the Technician

| Law | How it lands |
|---|---|
| **1 · Unique ID** | Every one of ~90 evidence photos per job is an `EVID` tagged to a `SOPX` step tagged to the `LIFT` ID. Complete forensic replay of any installation |
| **2 · Map-first** | T1 is the site map; route, progress and today's step all live on it |
| **3 · AI supervisor** | This role is *entirely* AI-supervised — dispatch, step gating, evidence validation, deadline pressure, reassignment |
| **4 · Micro-money** | Every verified step credits instantly, ₹1,200–₹3,500 per step, with animation. 24 dopamine events per job instead of one payday |
| **5 · Role clarity** | Max possible earnings shown before accepting; per-step value shown before starting |
| **6 · 3 languages** | SOP text, safety warnings, videos and voice prompts in MR/HI/EN. Safety instructions are **never** English-only |
| **7 · Theme** | *Slate* — dark, glove-friendly, camera-dominant, readable in a shaft |
| **8 · Help button** | On any step, plays that step's video and offers one-tap escalation to a Level 4 mentor |
| **9 · Adaptive** | Works on a ₹8,000 phone with a cracked screen and 2G |
| **10 · Demo** | Demo technician can run a full simulated job with sample photos that always pass |
| **11 · Real GPS/cam** | The absolute core: geofence + camera-only + server timestamps + AI vision. **This is what makes evidence-gated payment possible** |
| **12 · Zero-risk** | Paid per verified output, not per day. No idle cost, no supervision cost, no wage risk. |

---

## E. Money for the Technician

| Trigger | Amount |
|---|---|
| Per verified SOP step | ₹1,200 – ₹3,500 (24 steps ≈ ₹42,000/job) |
| On-time completion (≤14 days) | ₹5,000 |
| Early completion (≤12 days) | ₹1,000 extra |
| Zero-wastage bonus | ₹500 |
| 5★ customer rating | ₹2,000 |
| Perfect SOP accuracy (no retakes) | ₹1,500 |
| Weekly streak (5 days, all steps on time) | ₹800 |
| Referring a technician who reaches L2 | ₹3,000 |
| **Penalties** | |
| Material shortfall | Market price + 20% |
| Missed check-in | −₹200 |
| Failed AI evidence twice | Step frozen, no credit |
| Safety violation | −₹5,000 + suspension |
| QC major failure | Job payout frozen pending review |

**Payout: every Friday**, automatically, to the linked bank account. Money Meter (T6) shows the countdown to it at all times.

---

## F. What Blocks the Technician

| Situation | System response |
|---|---|
| No network in the shaft | Full offline mode: steps, photos, checklists all cached; syncs on exit; wallet shows "syncing" |
| Kit pouch won't unlock | Because the prior step isn't verified. Help button explains exactly which step is pending |
| Material genuinely short | In-app request → 🤖 BOM validates → if legitimate, supplier dispatches; if anomalous, flagged |
| Site not ready on arrival | 📷 photo evidence → 🤖 clock pauses, delay attributed to customer, 💰 ₹500 wasted-trip fee paid |
| Injury or emergency | Red SOS button on every screen → admin call + location + nearest hospital + emergency contact |
| Technician abandons mid-job | Completed verified steps are paid; remaining work rebroadcast with surge; abandonment recorded on profile |
| Dispute with customer on site | One-tap escalation; admin joins a 3-way call; both positions recorded |

---

# PART 8 — ROLE 7: NEW WORKER AGGREGATOR & ONBOARDING
### Section B, VIMP — *"One page for New worker aggregator, Filter, On boarding, earning possibilities, training as per SOP by AI and training videos"*

---

## A. Why This Page Decides Whether the Business Scales

Capacity in this model is not bought with capital. It is recruited. **This single page is the throughput valve of the entire company** — if it converts poorly, no amount of lead generation matters, because there will be nobody to install the lifts.

**Theme:** *Sunlight* (aspirational variant) — bright, video-first, minimal text. Assumes a job-seeker on a cheap phone with limited literacy.

---

## B. The Funnel — Curiosity to First Rupee

### **B1 — The Hook (before any signup)**

The page opens on an earnings calculator, not a form:

```
┌──────────────────────────────────────────┐
│   तुम्ही किती कमवू शकता?                   │
│                                          │
│  मी काम करेन:  [4h] [6h] [8h] [10h]      │
│  माझा अनुभव:  [नवीन] [1-2 वर्ष] [3+]     │
│  माझा भाग:    [कोथरूड ▾]                 │
│                                          │
│  ─────────────────────────────────       │
│  तुमची अंदाजे मासिक कमाई:                 │
│                                          │
│         ₹ 24,000 – ₹ 32,000              │
│                                          │
│  📈 6 महिन्यांत L3 → ₹52,000 पर्यंत       │
│                                          │
│  [ मला सुरू करायचंय ]                     │
└──────────────────────────────────────────┘
```

Below it: three 30-second video testimonials from real technicians, in Marathi, filmed on site, unpolished. Then the live earnings ticker: *"आज 47 टेक्निशियन्सनी ₹1,84,200 कमावले"* (47 technicians earned ₹1,84,200 today).

**⚠️ The numbers in that calculator must be real.** Inflated earning claims produce a recruitment spike followed by mass churn, terrible reviews and a reputation that cannot be repaired. Show the honest median, not the top performer.

### **B2 — Filter (🤖 automatic, 4 minutes)**

| Stage | What happens |
|---|---|
| Basic eligibility | Age 18+, phone, bank account, area serviceable |
| Skill self-declaration | 8 tappable icons: electrical, welding, mechanical fitting, wiring, height work, tools owned, two-wheeler, prior lift experience |
| Aptitude test | 10 picture-based questions, no reading required (identify the tool, spot the unsafe act, read the measurement) |
| Safety screen | 5 non-negotiable questions on height work and electrical safety. **Failing any one = rejected**, no exceptions |
| 🤖 Routing | Score + skills + area → recommended entry level and role |

**Everyone starts at L1 unless they demonstrably prove otherwise** — a prior-experience claim only accelerates *testing*, never the level itself.

### **B3 — Onboarding (same day)**

Aadhaar eKYC · PAN · bank account (penny-drop verified) · address proof · 📷 live selfie · emergency contact · optional police verification for higher levels. Digital partner agreement, e-signed, in the language they chose.

**🤖 Fast-track promise: from "I want to start" to "first job accepted" in under 48 hours.** Anything slower and the candidate takes another job.

### **B4 — AI Training (T8)**

| Module | Content | Assessment |
|---|---|---|
| M1 · Safety First | Height work, electrical safety, PPE, emergency response | 100% required, retake until passed |
| M2 · Tools & Materials | Every tool and component, named and shown | 80% |
| M3 · SOP Fundamentals | Why evidence matters, how to shoot a good photo | 80% |
| M4 · The App | Every screen, hands-on, in the demo sandbox | Practical |
| M5 · Customer Conduct | Site behaviour, communication, cleanliness | 80% |
| M6+ · Level-specific | Per-level technical modules | 90% |

Delivered as short vertical videos (60–120 seconds each) in Marathi and Hindi, watchable offline, on a cheap phone, on the train. 💰 **₹50 credited per completed module** — the worker earns before their first job. That first ₹300 in the wallet is the single strongest predictor of whether they ever show up to work.

**🤖 AI Trainer:** an always-available chat coach that answers "how do I set a rail plumb line?" with the relevant 90-second clip and a diagram, in their language.

### **B5 — First Job (supervised)**

L1's first three jobs are shadow-only alongside an L3+ mentor. 💰 The mentor earns ₹1,000 per trainee successfully brought through — mentorship is a paid role, not a favour. 100% QC audit on all three. Then independent L1 work begins.

---

## C. Section A Laws Applied to Onboarding

| Law | How it lands |
|---|---|
| **1 · Unique ID** | `TECH` ID issued at approval, tied to their home zone |
| **2 · Map-first** | Candidate sees a live map of jobs available in their own area before they sign up |
| **3 · AI supervisor** | Filtering, scoring, training delivery, assessment and level assignment all automatic |
| **4 · Micro-money** | ₹50/module during training, before any real work — earning starts on day one |
| **5 · Role clarity** | The earnings calculator *is* the landing page; the promotion ladder is shown before signup |
| **6 · 3 languages** | Entire funnel, including videos and the partner agreement |
| **7 · Theme** | Bright, aspirational, video-first, low-literacy friendly |
| **8 · Help button** | "What does a technician actually do?" — a 3-minute day-in-the-life video |
| **9 · Adaptive** | Designed for the cheapest Android in the market |
| **10 · Demo** | Candidates practise the real app in the sandbox during Module 4 |
| **11 · Real GPS/cam** | Live selfie KYC; genuine geofenced first-job check-in |
| **12 · Zero-risk** | Aggregated partners, paid per verified output — capacity scales without payroll |

---

# PART 9 — ROLE 8: THE ADMIN
### Section B — *"this is the most important section... Admin can see and control all progress and all activity of all above elements, roles individually on the map"*

---

## A. The Design Principle That Governs This Entire Screen

Section A demands the business be **"monitored by one person only."** That is achievable, but only if the Admin console obeys one rule:

> **The Admin console shows exceptions, not operations.**

If the admin is watching things go *right*, the automation has failed. A dashboard that displays 400 healthy jobs is a dashboard nobody can monitor. This console is built to surface the 6 things that are wrong, and hide the 394 that are fine.

**Theme:** *Command* — dark mode, dense, multi-panel, keyboard-driven, built for 2–3 monitors.

**Screen inventory:** A1 Live City Map · A2 Alert Queue · A3 Role Monitors · A4 Approval Desk · A5 Money Control · A6 Analytics · A7 SOP & Rate Configuration · A8 User Management · A9 Audit Log

---

## B. The Admin Day

### **A1 — Live City Map (the default screen, always open)**

Everything, live, on Pune:

- Riders moving with their trails
- Technicians geofenced at sites, coloured by SOP progress
- Containers in transit
- QC inspectors en route
- Every active job as a pin, coloured by Law 2's universal legend
- 🔴 Red pins pulse. Everything else is calm.

**Filters (multi-select, instant):** role · zone · status · date range · value band · SLA breach only · alerts only · specific person · specific job ID.

**Lasso tool:** draw any shape on the map → everything inside it is filtered → export or bulk-action.

### **A2 — Alert Queue (the actual job)**

One prioritised list. The admin works top-down and stops when it is empty.

| Priority | Alert | Auto-action already taken |
|---|---|---|
| 🚨 **P0** | Safety incident / person trapped in lift | Emergency dispatch fired, admin phone ringing |
| 🚨 **P0** | Container tamper detected | Siren active, CCTV clip attached, police contact ready |
| 🔴 **P1** | AI evidence failed twice | Step frozen, technician notified, awaiting human call |
| 🔴 **P1** | Payment gateway failure | Retries exhausted, customer notified |
| 🟠 **P2** | Job slipping 2+ days | Helper offered, customer notified |
| 🟠 **P2** | Margin override request (<20%) | Held for approval, routed to Owner if needed |
| 🟡 **P3** | Material shortfall anomaly | Penalty staged, awaiting confirmation |
| 🟡 **P3** | Worker rating below threshold | Training module auto-assigned |
| ⚪ **P4** | "Confusing screen" UX alert (Law 8) | Logged for the product backlog |

Every alert card carries: the ID, the map location, the full evidence, what the system already did, and **2–3 one-tap decisions**. The target is a median resolution time under 90 seconds.

### **A4 — Approval Desk**

The small number of things a machine should not decide alone:

- Evidence disputes (admin views the photos side-by-side with the AI's reason and rules)
- Margin overrides below 20% (escalates to Owner)
- Worker suspensions and reinstatements
- Penalty waivers
- Emergency payouts outside the Friday cycle
- Customer refunds and goodwill credits

Every decision requires a written reason and is written permanently to A9 Audit Log with the admin's ID and timestamp. **The admin is audited too.**

### **A5 — Money Control**

Live view of every rupee in motion: tokens collected today · 90% payments pending and cleared · supplier payouts due · technician wallets (pending vs cleared) · Friday payout total · penalties collected · gamification spend against the Law 4 budget cap · escrow balance and reconciliation.

**🚨 Red flag automation:** wallet balance anomalies, duplicate payment attempts, unusual penalty patterns, a technician's earnings spiking beyond plausible output — all surface here before they become losses.

### **A6 — Analytics**

Funnel conversion by stage, zone and rider · average deal value and margin trend · installation cycle time distribution · SOP accuracy by technician and by step (*which step fails most often is a training signal, not a discipline signal*) · QC defect rates · customer satisfaction and NPS · worker retention and level progression · **System Efficiency Index** (see Part 10).

### **A7 — SOP & Rate Configuration**

Where the admin edits the business itself: SOP steps and their evidence requirements · per-step payment values · gamification amounts and the budget cap · rate card and margin rules · SLA windows · QC sampling percentages · escalation timings · WhatsApp templates.

**🔒 Change control:** every edit is versioned, requires a reason, takes effect only for jobs created after the change, and never retroactively alters what a worker was promised. **Changing the deal after work has started is the fastest way to destroy trust in a gig workforce.**

---

## C. Section A Laws Applied to Admin

| Law | How it lands |
|---|---|
| **1 · Unique ID** | Global search: type any ID and get its complete timeline, evidence, money and people |
| **2 · Map-first** | A1 is the default and the primary control surface; every alert is also a pin |
| **3 · AI supervisor** | The AI runs operations; the admin supervises the AI. Roles inverted from a traditional company |
| **4 · Micro-money** | Admin sees the full gamification ledger and its budget cap in real time |
| **5 · Role clarity** | Every alert states what happened, what the system did, and what the admin must decide |
| **6 · 3 languages** | Admin can view any worker's screen in that worker's language to support them properly |
| **7 · Theme** | *Command* — dense, dark, multi-monitor |
| **8 · Help button** | Explains each analytics metric's formula and what a healthy range looks like |
| **9 · Adaptive** | Full console on desktop; a cut-down mobile version for P0/P1 alerts only |
| **10 · Demo** | Demo admin sees a simulated city with scripted alerts to practise on |
| **11 · Real GPS/cam** | Live CCTV access, live GPS, live evidence review |
| **12 · Zero-risk** | One person genuinely monitors a city because they only ever touch exceptions |

---

# PART 10 — ROLE 9: THE OWNER
### Section B — *"One page for owner who will focus on business development and not on daily activity"*
### **Mr. Prashant Vasant Wable**

---

## A. The Rule for This Screen

**If it can be acted on today, it does not belong here.**

This page answers four questions and nothing else: *Am I making money? Where should I grow? Is the system running itself? What is about to break?*

**Theme:** *Executive* — dark, very large type, charts over tables. Readable in 10 seconds while standing.

---

## B. The Four Panels

### **Panel 1 — Cash, Live**

```
┌───────────────────────────────────────────────┐
│  TODAY                                        │
│  Tokens collected     ₹  1,20,000   (12 deals)│
│  Material cleared     ₹ 42,15,000   (7 sites) │
│  Final payments       ₹  3,08,000   (5 NOCs)  │
│  ─────────────────────────────────────        │
│  Gross inflow         ₹ 46,43,000             │
│  Supplier out         ₹ 33,72,000             │
│  Worker payouts       ₹  4,10,000             │
│  ═════════════════════════════════            │
│  NET MARGIN           ₹  8,61,000    (18.5%)  │
│                                               │
│  MTD net   ₹1.42 Cr  ▲ 22% vs last month      │
└───────────────────────────────────────────────┘
```

### **Panel 2 — Growth Heatmap**

Maharashtra, then India. Every region scored on: construction density, lift penetration, competitor presence, average deal value, conversion rate, and current coverage. Dark = expand here next.

Drill: state → city → ward. Each cell shows estimated addressable lifts per year and the rider headcount needed to cover it. **This panel is how the next city gets chosen — with data, not instinct.**

### **Panel 3 — System Efficiency Index (the single most important number)**

```
        SYSTEM EFFICIENCY INDEX
              94.2%
        ▲ 1.8 pts this month   Target: 95%

  Automated transitions      96.1%  ✅
  Human interventions/day      14   (target <20)
  Admin hours/day             3.2   (target <4)
  AI evidence accuracy       97.4%  ✅
  SLA adherence              91.8%  ⚠️
  Rework rate                 2.1%  ✅

  🤖 Biggest drag: shaft-readiness delays
     (38% of all SLA misses)
     → Suggested: strengthen customer SOP
       incentives in Baner & Wakad
```

**Layer 3 — why this is the owner's real KPI:** Revenue can be bought with spending. Efficiency cannot. The SEI is the measure of whether this is genuinely a system-run business or a manual business with an app on top. If SEI falls while revenue rises, the company is quietly turning into a labour-heavy operation — which is exactly the outcome the asset-light model exists to avoid. **Watch this number before watching revenue.**

### **Panel 4 — Strategic Alerts & the Expansion Engine**

Weekly, not daily. Things that change decisions, not days:

- Steel/copper index shifted 8% → margin exposure across 31 open quotes
- Competitor opened in Wakad → conversion there down 12%
- Technician supply in Hadapsar at 89% utilisation → recruit before it constrains sales
- NBFC approval rate dropped to 61% → renegotiate or add a lender
- **Franchise pipeline:** 4 city-partner enquiries, royalty projections attached
- **Future modules:** predictive IoT maintenance · AR lift preview for sales · dynamic raw-material price sync · partner royalty automation

---

## C. Section A Laws Applied to the Owner

| Law | How it lands |
|---|---|
| **1 · Unique ID** | Owner can drill from a national number down to a single bolt on a single site — one ID chain |
| **2 · Map-first** | Panel 2 is the strategic map; growth decisions are made on it |
| **3 · AI supervisor** | The AI supervises the business; the owner supervises the AI's *strategy*, not its tasks |
| **4 · Micro-money** | Owner sees total gamification spend as a % of margin, tracked against the cap |
| **5 · Role clarity** | Four panels, four questions, zero operational noise |
| **6 · 3 languages** | Full support; board and investor exports generate in any of the three |
| **7 · Theme** | *Executive* — biggest type, fewest numbers |
| **8 · Help button** | Explains how every metric is calculated, so the owner trusts the number |
| **9 · Adaptive** | Designed to be read on a phone in 10 seconds and on a desktop in 10 minutes |
| **10 · Demo** | Demo owner view shows a plausible full-scale city — this is the investor demo |
| **11 · Real GPS/cam** | Owner can drop into any live site camera on demand |
| **12 · Zero-risk** | The SEI is the direct, honest measurement of whether the doctrine is actually holding |

---

# PART 11 — THE MONEY MAP
### Every rupee on one ₹6,15,000 deal, from first tap to NOC

---

## 11.1 The Full Flow

```
  RIDER captures lead                              💰 −₹40      (company pays)
       │
  BOT sells, negotiates, closes
       │
  CUSTOMER pays TOKEN                              💰 +₹10,000
       │  └─ rider conversion commission           💰 −₹1,500
       │
  QC clears shaft                                  💰 −₹450
       │
  SUPPLIER packs & ships (unpaid so far)           💰 ₹0
       │
  CONTAINER arrives at site
       │
  CUSTOMER pays 90%                                💰 +₹5,53,500
       │  └─ supplier paid same day                💰 −₹4,20,000
       │
  TECHNICIAN installs, 24 verified steps           💰 −₹42,000
       │  └─ on-time + wastage + rating bonuses    💰 −₹7,500
       │
  QC surprise audit                                💰 −₹800
       │
  HANDOVER · triple signature
       │
  CUSTOMER pays final 10%                          💰 +₹51,500
       │
  NOC RELEASED · AMC activates
       │
  ═══════════════════════════════════════════════════════════
  Gross in                                            ₹6,15,000
  Direct costs (material + labour + QC + leads)      −₹4,72,290
  ───────────────────────────────────────────────────────────
  CONTRIBUTION MARGIN                                 ₹1,42,710  (23.2%)
  Less platform/overhead allocation (~4%)              −₹24,600
  ───────────────────────────────────────────────────────────
  NET                                                 ₹1,18,110  (19.2%)
```

## 11.2 The Three Facts That Make This Model Work

1. **The company never funds inventory.** Supplier is paid only from the customer's own 90% payment. Working-capital requirement per deal ≈ ₹0.
2. **The company never carries idle labour.** Every rupee of labour cost is attached to a verified, photographed, geofenced piece of completed work.
3. **The company never chases receivables.** The NOC is the lever. The container lock is the lever. Payment precedes value delivery at every single milestone.

## 11.3 The Gamification Budget, Checked

Total micro-rewards on this deal: rider (₹40 + ₹1,500 + ₹1,000) + technician bonuses (₹7,500) + QC bonuses (₹150) ≈ **₹10,190** against a contribution margin of ₹1,42,710 = **7.1%**.

> ⚠️ **That is above the recommended 2.5% cap and near the 4% ceiling from Law 4** — because conversion commissions and completion bonuses are counted here. The correct treatment: classify **conversion commissions and completion bonuses as direct cost of sale** (they are), and cap only the *discretionary* gamification layer — streaks, leaderboards, target bonuses, wastage bonuses — at 2.5% of margin. Get this classification right in the ledger from day one, or the gamification spend will look uncontrolled to an auditor and to any future investor.

---

# PART 12 — EXCEPTION PLAYBOOK
### What actually happens when things go wrong

Every one of these is a coded system behaviour, not a policy document.

| # | Scenario | 🤖 Automatic response | 👤 Human needed? |
|---|---|---|---|
| 1 | Rider fakes GPS | Instant suspension, all pending credits frozen, admin alert | Review only |
| 2 | Two riders capture the same shaft | Second capture blocked at 50 m radius; first capture holds the commission | No |
| 3 | Customer never responds after quote | 3 follow-ups (24h/72h/7d) then marked lost with reason; re-engagement campaign at 90 days | No |
| 4 | Customer demands below 20% margin | 🔒 Hard block; Owner override only, with written reason logged | Owner |
| 5 | Token paid, customer disappears | 14-day shaft SLA lapses → material released → token treated per agreement clause | No |
| 6 | Shaft fails QC clearance | Annotated rework list to customer; drawings held; re-inspection auto-booked; material not shipped | No |
| 7 | Container tampered in transit | 🚨 Siren + CCTV clip + P0 alert to admin, customer, supplier; route locked; police contact ready | Admin |
| 8 | Customer doesn't pay 90% in 48h | Container never unlocks; truck recalled; supplier made whole; zero loss | No |
| 9 | Only 2 of 3 unlock keys present | 🔒 Lock stays sealed. No override exists at any level | No |
| 10 | Technician submits a reused photo | Perceptual hash catch → step rejected → second offence freezes the job | Admin on 2nd |
| 11 | Technician works with no network all day | Offline queue syncs on exit; if the sync gap exceeds 12h, flagged for spot QC | No |
| 12 | Technician abandons mid-job | Verified steps paid; remainder rebroadcast within 5–10 km with surge bonus; profile flagged | No |
| 13 | Site not ready when technician arrives | 📷 evidence → clock pauses → delay attributed to customer → ₹500 wasted-trip fee paid | No |
| 14 | Material genuinely short | BOM validates; legitimate → supplier dispatches; anomalous → penalty staged | Admin if anomalous |
| 15 | QC and technician collude | Rotation lock (90-day) + different-zone rule + random re-audit of passed jobs | Admin on pattern |
| 16 | Injury on site | 🚨 SOS → admin call + location + nearest hospital + emergency contact + insurance claim opened | Immediate |
| 17 | Person trapped in a lift (post-handover) | P0: all SLAs bypassed, nearest technician dispatched, admin phone rings, fire services number surfaced | Immediate |
| 18 | Customer disputes quality at handover | Independent re-inspection within 24h; final 10% held in escrow, not forfeited to either side | Admin |
| 19 | Customer refuses final 10% | 🔒 No NOC. Escalates to a payment plan, then to legal per agreement. Value already delivered is secured by the document lever | Admin |
| 20 | Payment gateway outage | Auto-retry across alternate rails; customer notified; SLA clocks pause | No |
| 21 | WhatsApp template rejected by Meta | Falls back to SMS + voice; admin alerted to fix | Admin |
| 22 | App-wide outage | Field roles operate offline; all evidence queues locally; nothing is lost; sync on restore | Engineering |
| 23 | Supplier fails to deliver on time | Penalty applied; order cascades to the next-ranked supplier; customer notified with a revised date | No |
| 24 | Fraud pattern across multiple jobs | Anomaly detection flags → accounts frozen → full evidence package assembled for review | Admin + Owner |

---

# PART 13 — THE DEMO SCRIPT
### For showing an investor, a partner, or a new recruit — 7 minutes

Because demo mode is fully isolated (Law 10) and the map, GPS and camera are genuinely live, this can be run anywhere, on any phone, with no risk of touching production.

| Min | Do this | Say this |
|---|---|---|
| 0:00 | Open app, tap **Try Demo**, pick **Rider** | "No signup. Watch how fast someone starts earning." |
| 0:30 | Walk outside, tap **Capture Lead**, take 3 real photos | "Real GPS. Real camera. Eleven seconds, helmet on." |
| 1:00 | Show the ₹40 coin animation and the ID appearing | "Every lead gets a location-aware ID. Everything from here is tied to it." |
| 1:30 | Switch to **Sales** role | "That lead is already in the pipeline. Nobody touched it." |
| 2:00 | Show the WhatsApp message with the site's own photos | "This is the whole reason conversion is high. It's a photo of their own building." |
| 2:30 | Show the 60→30→20 negotiation ladder | "The bot physically cannot go below 20% margin. It's code, not policy." |
| 3:00 | Switch to **Customer** role, show the progress ring | "Eight lakh rupees. This screen is the entire anxiety management." |
| 3:30 | Show the live container on the map with CCTV | "Their material, moving toward them, locked, on camera." |
| 4:00 | Show the Triple-Key unlock screen | "Customer OTP, technician biometric, system approval. Two out of three opens nothing." |
| 4:30 | Switch to **Technician**, open an SOP step | "Twenty-four steps. Each one pays on verification. Not on Friday — on verification." |
| 5:00 | Show an AI evidence rejection | "Wrong photo, wrong place, wrong time, reused photo — all rejected before a human sees it." |
| 5:30 | Switch to **Admin**, show the Alert Queue | "One person runs a city because they only ever see the six things that are wrong." |
| 6:00 | Switch to **Owner**, show the System Efficiency Index | "94.2% automated. This is the number that says whether it's a system or just an app." |
| 6:30 | Switch language to मराठी mid-screen | "Instant. Including the SOPs, the voice bot, and the legal agreement." |
| 7:00 | Tap the floating **?** | "Every screen explains itself. And when 15 people open help on the same screen, we know we designed it badly." |

---

# PART 14 — RISK REGISTER
### The honest section. Read before go-live, not after.

Section A asks for a "no liability, zero risk model." The design above genuinely reduces **financial, material, and disputational** risk to near zero. It cannot reduce **statutory and safety** liability to zero — no structure can, and any advisor who says otherwise is selling something. Here is what must be handled, ranked by how badly it can hurt.

| # | Risk | Reality | What to do before go-live |
|---|---|---|---|
| **1** | **Lift safety statute** | In Maharashtra, lift erection and operation are regulated — permission from the Electrical Inspectorate before erection, a licence before operation, and registered-installer requirements. A technology platform cannot contract out of statutory safety duty | Engage a Pune-based lift-licensing consultant. Confirm registration status, permission workflow, and inspector liaison. **Build the permission application into the app as a workflow stage** — it is a customer-facing step you are currently missing entirely |
| **2** | **Consumer liability** | Under consumer law, a customer who bought a lift from "All India Elevators Company" will name that brand, not the aggregated technician. The aggregator framing protects you commercially, not reputationally or legally | Product + professional indemnity + public liability insurance. Ensure technician partner agreements carry back-to-back indemnity **and** that technicians are actually insured — an indemnity from someone with no assets is decoration |
| **3** | **Money handling structure** | Collecting ₹5.5 lakh from a customer and paying a supplier likely makes the platform a **principal in the sale**, not a marketplace. This changes GST treatment, may trigger RBI payment-aggregator obligations, and affects who owns the goods in transit | Payments lawyer + CA **before the first large payment**. Decide clearly: marketplace (supplier invoices customer directly, you take commission) or principal (you buy and sell). Both work. Ambiguity does not |
| **4** | **Gig worker classification** | Level ladders, mandatory SOPs, enforced schedules, penalties and suspension look a great deal like employment control. The Code on Social Security 2020 brings gig and platform workers into scope | Employment counsel review of partner agreements. Register for applicable gig-worker social security contributions. Budget for it — it is a real cost, and discovering it later is far more expensive |
| **5** | **Data & privacy (DPDP Act)** | Continuous location tracking of workers, CCTV, biometrics, Aadhaar KYC and customer site imagery are all sensitive personal data | Privacy policy, explicit consent flows, defined retention periods, data localisation, breach response plan. **Location tracking must stop at check-out** — tracking a worker's off-hours movement is both unlawful and a guaranteed way to lose your workforce |
| **6** | **AI evidence false positives** | If the vision model wrongly rejects a legitimate photo, an honest technician goes unpaid. This is the fastest possible way to destroy trust in the platform | Human appeal path within 4 hours, on every rejection. Track false-positive rate as a **first-class KPI on the Owner dashboard.** Pay the worker while the appeal is pending, not after |
| **7** | **Gamification economics** | Uncapped micro-rewards silently consume margin; rewards that are too small stop motivating | Enforce the Law 4 budget cap in code. Review reward-per-rupee-of-margin monthly. Classify commissions vs discretionary rewards correctly (Part 11.3) |
| **8** | **Two-week deadline vs quality** | Time pressure on safety-critical installation work is a genuine hazard. A rushed lift is a dangerous lift | Safety steps must be **exempt from time bonuses**. QC has absolute authority to stop work. A technician who reports a safety issue that costs time must be rewarded, never penalised |
| **9** | **Single-admin dependency** | "One person monitors everything" is a strength and a single point of failure. Illness, leave or attrition halts the business | Two trained admins minimum, on rotation. Documented handover. P0 alerts must escalate to the Owner's phone if unacknowledged in 15 minutes |
| **10** | **Supplier concentration** | If one supplier holds most volume, they eventually dictate terms | Minimum three active suppliers per product category. Cap any single supplier at 40% of allocation in the ranking engine |
| **11** | **Network reality in Pune shafts** | Concrete shafts and basements have no signal. If the app requires connectivity, it fails at the exact moment it matters most | Offline-first is **not optional** — it is architecture. Test in a real basement shaft before launch |
| **12** | **WhatsApp policy dependency** | Meta can reject templates or restrict the number. A core sales channel sits outside your control | Maintain SMS, IVR and RCS fallbacks that are live and tested, not theoretical |

**Recommended build order (do not build features before these):**
`1. Legal/licensing structure → 2. Payment & escrow structure → 3. Insurance → 4. Offline-first architecture → 5. Evidence & ID system → 6. The app features described in Parts 1–10`

---

# PART 15 — QUICK REFERENCE

## 15.1 The Whole Business in One Line Per Role

| Role | Their one job | Their one number |
|---|---|---|
| **Rider** | Find ready shafts, capture in 11 seconds | Leads/day and conversion % |
| **Sales AI** | Turn a photo into a signed agreement | Margin held above 20% |
| **Customer** | Get the shaft ready, pay on milestones | Days to shaft readiness |
| **QC** | Catch defects before they cost money | Defects caught / defects missed |
| **Supplier** | Pack sealed kits, ship on time | On-time delivery % |
| **Technician** | Follow the SOP with proof | SOP accuracy % |
| **Onboarding** | Convert a job-seeker into a working L1 in 48 h | Time-to-first-job |
| **Admin** | Clear the exception queue | Human interventions/day |
| **Owner** | Choose the next city; protect the SEI | System Efficiency Index |

## 15.2 ID Cheat Sheet

`MH-PUN-KOT-LIFT-0089-K` = State · City · Zone · Entity · Serial · Check character
Entity codes: `LEAD CUST LIFT QUOT AGMT CONT KITB RIDR TECH QCIN SUPP PART PAYT WLET CMPL CHAT SOPX EVID AMCX`

## 15.3 Payment Gates (memorise these five)

1. 🔒 No token → no agreement, no project
2. 🔒 No QC clearance → no drawings, no material
3. 🔒 No 90% payment → container never unlocks
4. 🔒 No verified SOP evidence → no worker credit
5. 🔒 No final 10% → no NOC

## 15.4 The Five Non-Negotiables

1. **Camera-only evidence.** Gallery upload does not exist on any evidence screen.
2. **The margin floor is code, not policy.** 20% cannot be typed by any bot or any human below Owner.
3. **The person who does the work never approves the work.**
4. **Safety steps are never time-bonused.**
5. **Offline must work.** Concrete shafts have no signal.

## 15.5 Glossary

| Term | Meaning |
|---|---|
| **SOP** | Standard Operating Procedure — the 24-step installation sequence |
| **BOM** | Bill of Materials — exact quantity of every item for this specific lift |
| **NOC** | No Objection Certificate — released only after final payment |
| **AMC** | Annual Maintenance Contract |
| **ARD** | Automatic Rescue Device — brings the car to the nearest floor on power failure |
| **MRL** | Machine Room Less lift |
| **GA drawing** | General Arrangement — the master dimensional drawing |
| **SEI** | System Efficiency Index — % of state transitions with no human involvement |
| **Triple-Key** | Customer OTP + Technician biometric + System approval |
| **KITB** | A phase-sealed, barcoded material pouch |
| **EVID** | A single piece of geo- and time-stamped photo/video evidence |

---

## CLOSING NOTE

This document describes a business in which **the system is the manager**. Every rule in Section A exists to remove a human decision from the loop, and every workflow point in Section B is a station on a production line with a gate at the entrance and a gate at the exit.

Three things determine whether it actually works:

1. **The evidence system must be trustworthy in both directions** — hard on fraud, and fair to the honest worker. A single wrongly-withheld payment travels through a technician network faster than any recruitment campaign.
2. **The compliance foundation must be built before the app, not after it.** Part 14 is not paperwork. It is the load-bearing wall.
3. **The gates must never be softened.** The moment one customer gets the NOC without paying, or one technician gets paid without evidence, every gate in the system becomes negotiable — and the entire model reverts to a traditional elevator business with a nicer interface.

**ALL INDIA ELEVATORS COMPANY**
*Owner: Mr. Prashant Vasant Wable · Pune, Maharashtra*
*Manual v3.0*
