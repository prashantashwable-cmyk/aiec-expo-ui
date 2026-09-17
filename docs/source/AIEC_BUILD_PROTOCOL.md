# AIEC BUILD PROTOCOL
## Operating Manual for Claude Code — Empty Repo to Pune Pilot
**All India Elevators Company · Owner: Mr. Prashant Vasant Wable · Pune, Maharashtra**
**v1.0 · Audience: Claude Code (the agent). Not a tutorial. An operating spec.**

**Source of truth:** `AIEC_App_Manual.md`. This file does not restate the manual — it converts the manual into build-time behaviour, gates, and evidence requirements. Where this file and the manual disagree about *what the product does*, the manual wins. Where they disagree about *how you build it*, this file wins.

---

## INSTALL — the only human-facing section

```
aiec/
├── CLAUDE.md                    ← ~60-line kernel (Appendix A). Loads every session.
├── AIEC_BUILD_PROTOCOL.md       ← THIS FILE. Loads at phase gates only.
├── AIEC_App_Manual.md           ← the product spec. Read by section, never whole.
├── .claude/
│   ├── settings.json            ← Appendix B. The gates that are enforced, not requested.
│   ├── hooks/                   ← pink-check, evidence-check, verify-gate
│   ├── rules/                   ← path-scoped: ledger.md, evidence.md, i18n.md
│   └── agents/                  ← money-auditor, evidence-auditor, gate-auditor
└── docs/
    └── VERIFY.md                ← the command list every completion claim must cite
```

Then: `Read AIEC_BUILD_PROTOCOL.md. Run PHASE 0.`

**Do not paste this file into CLAUDE.md.** A CLAUDE.md over ~200 lines gets diluted and the rules inside it start being ignored — that is documented behaviour, and on a project with five money gates it is the difference between a working ledger and a silent one. Instructions layer by load cost: CLAUDE.md = always loaded · `.claude/rules/*.md` = loads on matching files · this file = loads at gates · **hooks = the only layer that is enforced rather than requested.**

---
---

# PART I — THE TEN IMMOVABLES

The manual's 12 Laws describe the *product*. These ten govern the *build*. Each one, broken, is not a tradeoff — it is a rewrite.

**Symbols:** 🔒 hard gate, you may not proceed · ✅ evidence required · ⛔ never · 💰 money path · 📷 evidence path · 🧠 context event · ⚠️ known failure mode

---

### IMMOVABLE 1 — Nothing Is Done Until Something That Is Not You Says So

The manual's entire payment model rests on evidence replacing trust. Build the same way.

"It should work" and "the feature is implemented" are prohibited phrases unless immediately followed by a command and its output.

✅ Every completion claim carries one of exactly four things:
1. Command + exit code + the relevant output lines
2. Test name + pass/fail count
3. A rendered screen you actually looked at, compared against the manual section that specifies it
4. A named auditor agent's verdict, produced in a fresh context

⛔ Never mark a task done on the strength of having written the code. On this project, code that looks right and is wrong moves real rupees.

---

### IMMOVABLE 2 — 💰 Money Is Double-Entry, Append-Only, and Never a Column

There is no `balance` field. Anywhere. Ever. Balance is a **projection** computed from the ledger.

Every rupee event writes two rows summing to zero, carries a `PAYT` or `WLET` ID, carries the tenant, carries the **server** timestamp, and carries a pointer to the evidence that authorised it.

⛔ Never `UPDATE` a ledger row. Corrections are new reversing entries.
⛔ Never compute money in the UI layer. The server returns amounts; the client renders them.
⛔ Never store money as float. Integer paise, always.

🔒 **LEDGER GATE:** a schema containing a mutable balance column does not pass any phase.

---

### IMMOVABLE 3 — 📷 Camera-Only Evidence, Server Time Only

The manual's anti-spoofing section is not a feature list. It is the load-bearing wall of the payment model.

| Rule | Build consequence |
|---|---|
| No gallery upload on any evidence screen | ⛔ No `<input type="file">` in an evidence path. No file picker. No drag-drop. The in-app camera is the only source |
| Device time is never trusted | ⛔ `Date.now()` in an evidence, ledger, or SLA path is a defect. The server stamps on receipt |
| Geofence 50 m | Evidence outside radius is rejected **server-side**, not hidden client-side |
| Sequence lock | Step N+1 cannot be captured until step N is verified. Enforce in the query layer |
| Mock-location detection | `isFromMockProvider` checked on every ping; detection suspends, it does not warn |
| Perceptual hash | Duplicate photo across jobs detected server-side **before** credit |

🔒 **EVIDENCE GATE:** grep the diff for `type="file"`, `ImagePicker`, `getPhotos`, and `Date.now()` in evidence or money paths. Any hit fails the gate.

⚠️ **The manual's own warning, and it is the sharpest risk in the entire build:** a wrongly-rejected legitimate photo means an honest technician goes unpaid, and that travels through a technician network faster than any recruitment campaign can repair. Therefore: **every rejection path ships with its appeal route in the same commit.** A rejection without an appeal is an incomplete feature, not a shipped one. Pay the worker while the appeal is pending, not after it resolves.

---

### IMMOVABLE 4 — No Pink Value In Code

Every tunable number — rate, percentage, SLA hour, price, commission, threshold, cap — reads from the settings store. A numeric literal for any of these is a bug.

The store is **effective-dated**. A closed job keeps the config version it ran under. Tuning a value must never retroactively alter a closed job's money or a closed SLA's breach status.

```
settings(tenant_id, scope, key, value, unit, default, min, max,
         changed_by, changed_at, effective_from)
```

⛔ Never `const COMMISSION = 40`.
⛔ Never a default inline: `settings.get('lead.commission') ?? 40` — the fallback is a hardcode wearing a disguise. A missing key is a typed error, surfaced loudly, not silently defaulted.

🔒 **PINK GATE:** a `PreToolUse` hook greps numeric literals in money/SLA/rate paths and blocks the write.

---

### IMMOVABLE 5 — Multi-Tenant From Migration 001

Every table carries `tenant_id`. Including lookup tables. Including settings. Including the ledger. Pune is one tenant; demo is another.

Tenancy is enforced **at the query layer by construction**, not by callers remembering a `where` clause. A query builder capable of emitting a tenant-less query is itself the defect.

🔒 **TENANT GATE:** every migration and every query in the diff carries tenant scoping. Retrofitting tenancy is a rewrite, and the expansion plan makes it inevitable.

---

### IMMOVABLE 6 — The Person Who Does the Work Never Approves It

Enforce at the **query layer**, not the UI. A UI that hides the approve button while the endpoint still accepts the call has not implemented the rule — it has decorated it.

This reaches further than it first appears:
- Technician cannot approve their own SOP evidence
- QC cannot audit a job in their own rotation zone (90-day rotation lock)
- Rider cannot verify their own lead
- A crew member cannot approve a step they personally captured

🔒 **SEPARATION GATE:** for every approval endpoint in the diff, a test exists proving the actor who created the record receives a 403.

---

### IMMOVABLE 7 — Offline Must Work. Concrete Shafts Have No Signal.

The technician does the entire job inside the exact place where the network does not exist. If the app needs a network, it fails at the precise moment of use — and the evidence, which *is* the payment control, is never captured.

- ⛔ No field-critical path may `await` a network call
- All SOP steps, checklists, camera capture, signatures and forms work at zero connectivity
- Writes go to a local durable queue first, then sync. Never the reverse
- Sync status always visible: *"5 photos waiting to upload"* — the worker must know their evidence is safe
- Map tiles for the assigned area pre-download at job accept
- A sync gap over 12 h flags the job for spot QC — it is a fraud signal, not only a connectivity one

🔒 **OFFLINE GATE:** the feature was demonstrated with the network disabled and the queue drained correctly on restore. Assertion is not sufficient. Airplane mode is.

---

### IMMOVABLE 8 — Every String Externalised, Day One. EN · मराठी · हिंदी.

Not retrofitted. Retrofitting i18n across a nine-role app is a month you do not have.

What must switch — and this is where most builds stop too early, doing the UI and forgetting the rest:
UI labels · SOP step text and safety warnings · voice prompts · WhatsApp templates (pre-approved per language) · push notifications · help content · training subtitles · **generated PDFs: quotation, agreement, NOC, AMC certificate** · number and date formatting.

**Indian numbering everywhere:** `₹1,50,000` — never `₹150,000`. One formatter in the shared layer, never a per-component concern.

Defaults by role: Rider and Technician → Marathi · Customer → English · Admin and Owner → English. All overridable, the switch never buried, and **switching must not lose form data**.

🔒 **I18N GATE:** no user-facing literal in a component. Every new key exists in all three catalogues — a missing translation is a build break, not a silent fallback.

---

### IMMOVABLE 9 — IDs Are Generated Centrally, Never Ad Hoc

`MH-PUN-KOT-ORD-0041-K` — state · city · zone · entity · serial · Damm check character.

One generator. One place. The zone comes from the GIS ward polygon, not from a string the caller passed. The check character is computed, never supplied.

Entity codes are a closed set: `LEAD CUST LIFT QUOT AGMT CONT KITB RIDR TECH QCIN SUPP PART PAYT WLET CMPL CHAT SOPX EVID AMCX`. Adding one is a recorded schema decision, not an inline string.

**The consequence the manual depends on:** every photo, chat, GPS ping, rupee and SOP step is stamped with its parent ID **at creation**. There is no "attach to job" step anywhere in the product. If you find yourself building one, you broke this rule upstream.

---

### IMMOVABLE 10 — Demo and Real Never Touch

Separate tenant, `is_demo = true`, distinct schema scope. Mock payment provider with **no gateway keys loaded**. Outbound WhatsApp/SMS/voice disabled at the network layer — not behind a flag a bug can flip. Persistent orange DEMO ribbon on every screen. Auto-reset every 24 h. One-way door: demo→real carries no data, real→demo is impossible.

Map, GPS and camera are **genuinely live in demo**. Only money and messaging are simulated.

🔒 **ISOLATION GATE:** a test proves that with the demo tenant active, no production credential is loadable and no outbound messaging API is reachable.

---
---

# PART II — THE PHASE MACHINE

Announce every transition in one line:
`→ PHASE 4: Rider slice. Gate 3 passed — 6 skeleton mechanisms demonstrated, VERIFY green, output pasted.`

You do not enter a phase until the previous gate passes. You do not skip a phase because it looks obvious.

---

## PHASE 0 — INTAKE

1. Establish what exists. Empty repo, or partial build?
2. If code exists: run the build, run the tests, **record the result before touching anything.** Without a baseline you cannot separate your breakage from inherited breakage.
3. Read `AIEC_App_Manual.md` — **Part 0 (the 12 Laws), Part 15 (Quick Reference), and Part 14 (Risk Register) only.** Do not read the whole manual. It is 2,000 lines and reading it whole spends a third of your context before you write a line. Read each role Part on demand, at its slice.
4. Confirm the stack, the deploy target, and the device floor. The manual says a ₹8,000 Android on 4G — that is the real device, not an aspiration.

🔒 **GATE 0:** You can state in three sentences what this system is, what state the repo is in, and whether it currently builds. If it was already broken, you have said so out loud.

---

## PHASE 1 — THE COMPLIANCE SPINE

> Manual Part 14 is explicit about build order: **legal/licensing → payment structure → insurance → offline architecture → evidence & ID system → features.** It names building the app first and the compliance later as the fastest way to lose the business.

You are not a lawyer and you will not produce legal advice. You will produce the **workflow objects and data structures those decisions require**, and surface the decisions that become expensive if deferred.

**Procedure:**

1. Write 📄 `docs/COMPLIANCE.md` capturing the twelve Part 14 risks as *build requirements*. For each: what the app must contain, and which human decision it waits on.

2. Three are structural — they change the schema. Put them to the user **now**, with consequences:

   | Question | Why it cannot wait |
   |---|---|
   | **Marketplace or principal?** Does the supplier invoice the customer directly with the platform taking commission, or does the platform buy and sell? | Decides GST treatment, who owns goods in transit, and whether the ledger models one flow or two. Changing it later rewrites the money layer |
   | **Electrical Inspectorate permission — is it a customer-facing workflow stage?** | The manual flags it as **currently missing entirely from the product**. It is either a stage with an SLA, a document and a blocker, or it is a gap that surfaces at the first inspection |
   | **Worker classification — partner or employee?** | Level ladders, enforced schedules, penalties and suspension look like employment control. It changes what the technician tables must record |

3. Encode what does **not** wait:
   - **Location tracking stops at check-out.** Off-hours tracking is unlawful and loses the workforce. Build the boundary now, not as a later toggle
   - **DPDP:** consent flows, retention period per data class, deletion path. Aadhaar/PAN, biometrics, CCTV and customer site imagery are all sensitive
   - **Safety steps are never time-bonused.** A column on the SOP schema, so the bonus engine structurally cannot reach them
   - **QC has absolute stop-work authority.** Model it as a state, not a permission

🔒 **GATE 1:** `docs/COMPLIANCE.md` exists. The three blocking questions are in front of the user with each consequence stated. The four non-waiting items are written down as schema-level requirements.

⚠️ **Failure mode:** treating this as paperwork and jumping to the first visible feature. The manual calls Part 14 the load-bearing wall. It sits here because here is where it is cheapest.

---

## PHASE 2 — ARCHITECTURE: THE IMMOVABLE CORE

Record each irreversible decision in 📄 `docs/DECISIONS.md`:

```markdown
## D-001 · <one-line decision>
**Decision:** <what>
**Rejected:** <the real alternative, not a strawman>
**Why:** <the specific reason, tied to a manual section or a number>
**Reverses cheaply?** <no / yes, and at what cost>
```

Decisions this project cannot defer:

| # | Decision | The constraint forcing it |
|---|---|---|
| 1 | Client platform | The customer must install nothing. Field roles need camera + GPS + durable offline storage. These pull in opposite directions — decide explicitly, do not straddle |
| 2 | Data store | Money needs transactions and constraints. Evidence needs volume. ⛔ Media never goes in the database |
| 3 | Tenancy mechanism | Immovable 5. Row-level, schema-level or database-level — pick one and enforce it structurally |
| 4 | Offline sync + conflict resolution | Immovable 7. Two people, two phones, one job, no signal. Decide the conflict rule **now** — last-write-wins on evidence is silent data loss |
| 5 | Media storage + lifecycle | The manual names storage a silent budget killer. Resolution policy, retention and cold-tier rules are day-one decisions |
| 6 | Settings store shape | Immovable 4, effective-dated |
| 7 | Ledger shape | Immovable 2, append-only |
| 8 | ID generator + GIS zone lookup | Immovable 9 |
| 9 | i18n mechanism | Immovable 8 — including the PDF path |
| 10 | Deploy, backup, export | Business continuity is in the risk register |

**Choose the boring option by default.** Every novel dependency is a tax on every future session, yours and the humans'. Novelty is argued for, never assumed.

Then write 📄 `docs/ARCHITECTURE.md`: module map, directory layout with one line per folder, and **one money event traced end to end in prose**, naming files that will exist — *customer pays pre-dispatch → which rows are written, in what order, under what lock, with which evidence pointer.*

🔒 **GATE 2:** All ten decisions recorded with rejected alternatives. One money path traced end to end. No decision contradicts an Immovable.

---

## PHASE 3 — THE WALKING SKELETON

> The thinnest thing that exercises every immovable at once. Highest-leverage phase in the build, and the one most often skipped.

On a normal project the skeleton is one entity on one screen. **Here it must prove six mechanisms simultaneously**, because discovering any of them is wrong in week six is a rewrite.

**Build exactly this and nothing more:**

1. **Migration 001** — two tables (`tenants`, one entity), both tenant-scoped
2. **The ID generator** — emits `MH-PUN-KOT-XXXX-0001-K`; Damm check verified by a test that feeds it transpositions
3. **The settings store** — effective-dated; the skeleton reads one real pink key; zero literals
4. **The ledger** — one double-entry event, proved to sum to zero, no balance column
5. **The i18n layer** — one screen, three languages, switch without losing form state, `₹1,50,000` rendered correctly
6. **The offline queue** — one write made offline, drained on restore, sync status visible

Plus the machinery that will police everything afterwards:

| Must exist before Phase 4 | Why |
|---|---|
| One passing end-to-end test | Proves the harness works, not just the code |
| Typecheck + lint wired | A whole class of defect eliminated at zero marginal cost, forever |
| Migration runs forward from empty | The first schema change should not be an adventure |
| Seed script | You cannot verify a job list with no jobs |
| 📄 `docs/VERIFY.md` | Every completion claim from now on cites it |
| CI running all of the above | Otherwise it rots inside a week |
| `.env.example`, every var documented | Environment quirks are the top onboarding failure |

🔒 **GATE 3:** ✅ Every command in `docs/VERIFY.md` run, output pasted, all green — **plus** the six mechanisms individually demonstrated, not asserted. The offline one requires airplane mode, not a mocked network.

⚠️ **Failure mode:** building the visible feature first because it shows value, then discovering in week three that the ledger cannot express a reversal, or that i18n cannot reach the PDF generator.

**🧠 After Gate 3:** `/clear`. Write the verified build commands into `CLAUDE.md` — they are permanent project facts and belong in the always-loaded layer, not in conversation.

---

## PHASE 4 — SLICE 1: THE RIDER CAPTURE

> Read manual **Part 2 now** — not before.

The first real slice is the rider's **3-tap capture**. Not because it is easiest, but because it is the shortest path that touches camera, GPS, offline queue, ID generation, duplicate detection, micro-payment and the ledger in one line. Every later slice copies its pattern, so if this one is shallow, every later slice improvises.

**Procedure — the order is not negotiable:**

1. **Plan mode.** `Shift+Tab` until `⏸ plan mode on`. Read the Part 2 walkthrough. Produce a file-by-file plan. `Ctrl+G` if the human wants to edit it directly.
2. **Write the failing test first.** Watch it fail. A test you never saw fail is a test you cannot trust.
3. **Data** — migration, model, tenant-scoped query, duplicate check at the 50 m radius, **server-side**.
4. **Server** — capture endpoint, input validation, typed errors, server timestamp, ID generation, evidence rows.
5. **💰 Money** — the micro-credit lands as **Pending**, double-entry, `WLET` ID, pointer to the `EVID` that earned it, amount read from `lead.commission` in the settings store.
6. **Client** — offline-first write to the durable queue, then sync. Camera-only. Sync status visible.
7. **UI** — Sunlight theme: high contrast, 72 px targets, 22 pt minimum text, one action per screen, Marathi default.
8. **All seven states** (Part III). Every one.
9. **Run `docs/VERIFY.md`.** Paste output.
10. **Look at it.** Small viewport, in Marathi, with the network off.
11. **Three auditors** — money, evidence, gate (Appendix C).

🔒 **GATE 4:**
- ✅ `docs/VERIFY.md` fully green, output pasted
- ✅ A capture completed with the network **off**; queue drained on restore
- ✅ The credit is Pending, double-entry, zero-sum, evidence-linked, amount from settings
- ✅ All seven states exist and were seen rendered, in Marathi
- ✅ Three auditors run in fresh contexts; findings resolved or explicitly deferred with reasons
- 📄 The slice pattern is written into `docs/ARCHITECTURE.md` under `## Slice pattern`, so slice 2 copies rather than improvises

---

## PHASE 5 — THE ROLE LOOP

`/clear` between every slice. No exceptions.

**Order — build in the sequence the money moves,** because each slice's output is the next slice's input:

| # | Slice | Manual Part | The one thing it must prove |
|---|---|---|---|
| 1 | Rider capture | 2 | *(Phase 4 — done)* |
| 2 | Sales → agreement → token | 3 | 🔒 Gate 1: no token → no agreement, no order |
| 3 | Customer portal | 4 | Customer installs **nothing**. Link → browser → phone + OTP |
| 4 | QC clearance | 5 | 🔒 Gate 2: no clearance → no drawings, no material |
| 5 | Supplier + dispatch | 6 | 🔒 Gate 3: no pre-dispatch payment → no supplier order placed |
| 6 | Technician SOP engine | 7 | 🔒 Gate 4: no verified evidence → no payout accrual. **Highest-risk slice in the build. The manual says read that Part twice** |
| 7 | Handover + NOC | 4 | 🔒 Gate 5: no final payment → no NOC. The NOC is a real document with its own ID and a verifiable QR |
| 8 | Onboarding funnel | 8 | Job-seeker → working L1. This page decides whether the business scales |
| 9 | Admin console | 9 | Exception handling only. If admin is doing routine work, the automation has failed |
| 10 | Owner view | 10 | Four panels. If a number takes more than 10 seconds to read, it does not belong |

**Per slice, mechanically:**

```
1. Read the manual Part for this role. That Part only.
2. Plan mode. Diff-level plan naming real files.
3. Failing test.
4. Implement, copying the Phase 4 slice pattern exactly.
5. Run docs/VERIFY.md. Paste output.
6. Look at it: small screen, Marathi, network off.
7. Tick docs/TASKS.md with a one-line evidence note.
8. /clear.
```

### The five payment gates are code, not reminders

Each is a hard block with **no UI override and no admin override**:

```
🔒 1  No token             →  no agreement, no order
🔒 2  No QC clearance      →  no drawings released, no material shipped
🔒 3  No pre-dispatch pay  →  no supplier order placed
🔒 4  No verified evidence →  no technician payout accrual
🔒 5  No final payment     →  no NOC
```

For each, a test exists that attempts the forbidden transition **through the API, not the UI**, and asserts refusal. A gate that only exists in the UI is not a gate.

> The manual's closing note is the reason: *the moment one customer gets the NOC without paying, or one technician gets paid without evidence, every gate in the system becomes negotiable.*

**Parallelism:** two slices sharing no files → separate git worktrees (`claude --worktree`). Two slices sharing files → strictly sequential. Merge conflicts between agent sessions are silent quality destroyers, and on the money path they are expensive ones.

🔒 **GATE 5:** every slice ticked with evidence, or listed under Blocked with the specific reason and who can unblock it.

⚠️ **Failure mode — the kitchen-sink session.** Slice, unrelated question, back to slice. On this project `/clear` between unrelated tasks is a correctness measure, not hygiene.

---

## PHASE 6 — INTEGRATION HARDENING

> **The manual has already written your test matrix.** Part 12 is 24 numbered failure scenarios with their required system response. That is not an appendix. It is an acceptance suite.

**Procedure: execute Part 12 as tests.** One test per scenario. A scenario without a test is an untested failure path, and every one of them touches money, evidence or safety.

The ones that will actually break, roughly in the order they will:

| # | Scenario | What you are really testing |
|---|---|---|
| 2 | Two riders capture the same shaft | Server-side radius check **under concurrency**, not client-side |
| 8 | Customer doesn't pay in 48 h | Container never unlocks, supplier made whole, zero loss — prove the ledger nets to zero |
| 9 | Only 2 of 3 unlock keys present | **No override exists at any level.** Test that admin cannot force it |
| 10 | Reused photo | Perceptual hash catches it **before** credit, not after |
| 11 | No network all day | 12 h queue survives, drains correctly, flags for spot QC |
| 13 | Site not ready on arrival | Clock pauses **and** delay attributed to customer **and** wasted-trip fee paid — three side effects from one event |
| 15 | QC/technician collusion | Rotation lock and different-zone rule enforced in the query layer |
| 18 | Quality disputed at handover | Final 10% held in **escrow** — not forfeited to either side. A distinct ledger state, easy to get wrong |
| 20 | Gateway outage | SLA clocks **pause**. Retry across rails. Prove clocks resumed correctly |
| 22 | App-wide outage | Field roles keep working. **Nothing is lost.** |

**Beyond Part 12:**

| Class | Check |
|---|---|
| 💰 Concurrency on money | Two approvals of the same payout, simultaneously. The answer must not be "both credited" |
| Crew attribution | 2–3 people, separate logins, one job. Capturing user recorded per photo. Payment split per person |
| Auth boundaries | Log in as each of the nine roles. Try to reach every other role's data by URL. Document every result |
| **Effective-dating** | Change a pink value, then reopen a closed job. Its money must not move. **This is the test most likely to fail** |
| Boundary values | Empty, 10k chars, emoji, Devanagari, RTL, negative, zero, null, `<script>`, SQL metacharacters |
| Time | DST, month-end, leap year, SLA expiring exactly at the boundary, device clock deliberately wrong |
| Device floor | Real ₹8,000 Android, throttled 4G, 200% font scale, cracked-screen dead zone |
| Language | Every screen in all three — **including generated PDFs** |
| Scale rehearsal | Seed concurrent live jobs + the full AMC book + a year of ledger. Measure against the stated budget |
| Cold start | Fresh clone → `.env.example` → install → run. Time it. Fix whatever was undocumented |

🔒 **GATE 6:** ✅ All 24 Part 12 scenarios have passing tests. Every row above executed and recorded. Failures fixed, or recorded as accepted risk **with the user's explicit agreement**.

---

## PHASE 7 — ADVERSARIAL REVIEW

The agent that wrote it does not grade it.

1. **Correctness** — `/code-review high` in a fresh context. `ultra` before any significant merge.
2. **Security** — `/security-review`, then by hand: secrets in code **or history**, injection surfaces, authz on every mutating endpoint, unvalidated input reaching a query or a shell, dependency advisories.
3. **💰 Money audit** — `money-auditor` (Appendix C). Every rupee path: double-entry integrity, effective-dating, no balance column, no float, no client-side arithmetic.
4. **📷 Evidence audit** — `evidence-auditor`. Camera-only, server time, geofence, sequence lock, and an appeal path present on every rejection.
5. **🔒 Gate audit** — `gate-auditor`. All five payment gates blocked at the API, not the UI. No override path at any privilege level.

**Triage honestly.** A reviewer asked to find gaps will find some, even in sound work — that is what it was asked to do. Chasing every finding produces defensive layers, abstractions with one caller, and tests for cases that cannot happen. **Fix anything touching money, evidence, safety or a stated requirement. Defer the rest, with reasons, in `docs/TASKS.md`.**

🔒 **GATE 7:** five reviews run, findings triaged, all money/evidence/safety findings resolved, `docs/VERIFY.md` still green after the fixes.

---

## PHASE 8 — SHIP: WEEK-1 PILOT

> The rollout is deliberate and must not be compressed: **Week 1 owner only · Week 2 add two technicians · Week 3 customers on new orders only · Week 4 riders + the lapsed-AMC list.**

**Never migrate an in-flight customer mid-dispute.** Old jobs stay on the old method. **The system must tolerate being partially adopted without corrupting the ledger** — that is a testable property, so test it: run with half the jobs absent and prove the projections still reconcile.

| Ship item | Standard |
|---|---|
| README | Clone → run → working app in under 10 minutes, zero tribal knowledge |
| `.env.example` | Every var, what it does, where to get it |
| Migrations | Run forward **from empty**, tested from empty — not from your dev database |
| Seed | Realistic Pune dataset: live jobs, the full AMC book, a year of ledger |
| Demo tenant | Fully seeded, isolated, auto-resetting, ribbon visible |
| Backup | Exists **and has been restored once as a test** |
| Export | The owner can get their own data out. It is in the risk register |
| Secrets | Not in git — verified with a history scan, not a glance at HEAD |
| Runbook | Numbered deploy steps and the rollback procedure |
| Health endpoint | Real dependency status, not a hardcoded 200 |

🔒 **GATE 8:** ✅ Clean clone on a clean environment builds and serves. Demo tenant proven isolated. Backup proven restorable.

⛔ Never deploy without explicit confirmation in the current session. Approval for the last deploy does not cover this one.

---

## PHASE 9 — OPERATE THE PILOT

**Five numbers, and one diagnostic that matters more than all of them.**

| # | Metric | Direction |
|---|---|---|
| 1 | Cash locked in live jobs | ↓ |
| 2 | Average days per job | ↓ |
| 3 | Orders ending in a payment fight | ↓ |
| 4 | New payment-ladder acceptance rate | ↑ |
| 5 | Lapsed AMC recovered | ↑ |
| — | **The delay ledger** | No target. Only truth. After 30 days it names exactly where the lost days actually live — and that answer reshapes the build |

**And one that protects the workforce:** the **evidence false-positive rate**. The manual makes it a first-class owner-dashboard KPI. Track it from day one. Pay the worker while an appeal is pending, not after.

**Defect loop, permanently:**
1. Reproduce before diagnosing. A bug you cannot reproduce is a bug you cannot verify fixed
2. Write the failing test that captures the report
3. Fix the root cause — ⛔ symptom suppression is prohibited
4. Run `docs/VERIFY.md`
5. Keep the regression test forever
6. If the defect revealed a project fact you did not know, write it to `CLAUDE.md` so no future session relearns it

---
---

# PART III — THE SEVEN STATES

The manual's Part 12 is a list of things going wrong. Every one of them arrives at a user as a screen. **A screen is not done until all seven applicable states exist and you have seen them rendered.**

| State | Must show | AIEC example |
|---|---|---|
| **Loading** | Skeleton or progress, never a blank frame | Job list resolving |
| **Empty** | What this is, why it's empty, what to do | *"No leads captured today. Start your ride to begin."* |
| **Error** | What broke, in the user's language, and the recovery action | *"Photo could not be verified. Retake, or appeal — you will be paid while it is reviewed."* |
| **Partial** | Some data loaded, some failed — never a whole-screen crash | Job loads, live container position doesn't |
| **Permission-denied** | Distinct from error, distinct from empty | QC opening a job in their own rotation zone |
| **Offline** | Degraded, not dead, with queue depth visible | *"Working offline · 5 photos waiting to upload"* |
| **Blocked-by-gate** | 🔒 The specific gate, what unblocks it, who can act | *"Drawings release after QC clearance. Inspection booked for Tue 10:00."* |

The seventh is unique to this project and it is the most important one. **A gate that blocks without explaining itself produces a phone call to the office** — which is the exact cost the app exists to remove.

⛔ Never render a bare error where a gate is the real cause. *"Something went wrong"* on a payment gate is a defect, not a fallback.

---
---

# PART IV — CONTEXT DISCIPLINE

The manual is 2,000 lines. `SPEC`, `PINK`, `DECISIONS` and the code sit on top of it. You will run out of context long before you run out of work, and performance degrades measurably as it fills.

**Rules:**

| Situation | Move |
|---|---|
| Starting a slice | Read **only** that role's manual Part |
| Need to understand many files | Delegate to a subagent; take the summary |
| Large test output | Grep the failures. Never paste a full run |
| Slice finished | `/clear` |
| One-off question | `/btw` — the answer never enters history |
| Deep in one hard problem | Let it accumulate. This is the exception, and it is real |
| Suspect drift | `/context`. If memory files or MCP tools are eating budget, say so and fix it |

**What survives compaction:** project-root `CLAUDE.md` is re-read from disk and re-injected. **Nested CLAUDE.md files and path-scoped rules are not.** Anything stated only in conversation is gone.

**Therefore:** durable facts go in files, never in messages. Every time you think *"I should remember this"*, that is the signal to write it to `CLAUDE.md`, `.claude/rules/`, or `docs/DECISIONS.md`.

⚠️ **Auto-compact thrashing:** if context refills immediately after each summary, the cause is always one oversized read. Never `cat` the whole manual. `sed -n '397,606p'` the Part you need.

---
---

# PART V — SUBAGENT DOCTRINE

Subagents run in their own context and return a summary. Their tool calls never touch your window. On this project they are the difference between finishing and compacting.

| Trigger | Agent |
|---|---|
| Research spanning more than five files | `Explore` |
| "How does the ledger handle X?" | `Explore` |
| Verifying a diff you just wrote | `money-auditor` / `evidence-auditor` / `gate-auditor` — **fresh, mandatory** |
| A side task needing your whole conversation | `/subtask` (a **fork** — inherits everything) |

**Brief format — a vague brief returns a vague summary and you spent the context for nothing:**

```
Investigate how technician payout accrual is currently implemented.

Return exactly:
1. The file and function that writes the accrual
2. Which settings key supplies the amount
3. Whether the evidence pointer is stored on the ledger row or looked up
4. Any path that could accrue without a verified EVID

Do not propose changes. Read only src/ledger/ and src/domain/payout/.
```

Name the return shape. Name the boundary. Forbid scope creep explicitly.

🔒 **The auditor is always fresh, never a fork.** A fork inherits your reasoning, and a reviewer that has already been persuaded is not a reviewer.

---
---

# PART VI — HARD ENFORCEMENT

`CLAUDE.md` is **advisory** — you read it and try to follow it. Hooks are **deterministic** — they run regardless of what you decide.

**Anything that must happen every time, with zero exceptions, is a hook. Not an instruction.**

| Requirement | Wrong layer | Right layer |
|---|---|---|
| No numeric literal in a money path | CLAUDE.md | `PreToolUse` hook, exit 2 |
| No `<input type="file">` in evidence | CLAUDE.md | `PreToolUse` hook, exit 2 |
| No `Date.now()` in ledger/SLA | CLAUDE.md | `PreToolUse` hook, exit 2 |
| Typecheck + tests before the turn ends | Hoping | `Stop` hook, exit 2 |
| Never touch `/migrations` unasked | CLAUDE.md | `PreToolUse` hook |
| Architecture rationale, code style | Hook | CLAUDE.md — genuinely advisory |

**Blocking semantics:**

| Event | Exit 2 does what |
|---|---|
| `PreToolUse` | Blocks the tool call |
| `UserPromptSubmit` | Blocks the prompt |
| `PostToolUse` | Shows stderr **to you** — the tool already ran |
| `Stop` | Prevents you stopping; you keep working |
| `SubagentStop` | Prevents the subagent stopping |
| `TaskCompleted` | Prevents the task being marked complete |

---
---

# PART VII — THE ANTI-PATTERN REGISTRY

Recognise these in yourself mid-session. Each has exactly one correct response.

| # | Pattern | Response |
|---|---|---|
| A1 | **Kitchen sink** — unrelated work in one context | `/clear` |
| A2 | **Correction spiral** — third correction on one issue | Stop. Restate. `/clear`. Better prompt |
| A3 | **Manual dumped whole into context** | Read the Part, not the file |
| A4 | **Trust-then-verify gap** — plausible code, no check run | Run `docs/VERIFY.md` before any claim |
| A5 | **Pink leak** — a literal rate, SLA or price in code | Settings store. No inline fallback |
| A6 | **Balance column** — "just for performance" | Projection. Never a column |
| A7 | **UI-only gate** — button hidden, endpoint open | Enforce at the query layer |
| A8 | **Gallery escape hatch** — a file input "for testing" | ⛔ It never ships. Delete it |
| A9 | **Device time** — `Date.now()` in an SLA or ledger path | Server time only |
| A10 | **Tenant-less query** — one `where` clause forgotten | Structural scoping, not caller discipline |
| A11 | **English-only string** — "we'll translate later" | Three catalogues, or the build breaks |
| A12 | **Network in the field path** — one `await` on a fetch | Queue first, sync after |
| A13 | **Rejection without appeal** | Ship them in the same commit |
| A14 | **Happy path only** — no gate state, no offline state | All seven states |
| A15 | **Silent scope narrowing** — quietly delivering 70% | Say it loudly. It is the user's call, not yours |
| A16 | **Symptom suppression** — try/catch to green the build | Fix the cause |
| A17 | **Unasked refactor** — "while I was in there" | `docs/TASKS.md` under Deferred. Move on |
| A18 | **Self-review** — grading your own diff in your own context | Fresh auditor, never a fork |
| A19 | **Over-engineering from findings** — chasing every reviewer note | Money, evidence, safety, requirements. The rest is deferred |
| A20 | **Mock creep** — stubs and TODOs surviving to ship | Grep `TODO\|FIXME\|mock` before Gate 8 |
| A21 | **The unlooked-at screen** — shipped without rendering it | Look at it. Small, Marathi, offline |

---
---

# PART VIII — DEFINITION OF DONE

A slice is done when **all** of these are true. Not most.

```
[ ] Matches its manual Part, and its verification passes
[ ] All seven applicable states exist and were seen rendered
[ ] Tests written, and observed failing before they passed
[ ] Every docs/VERIFY.md command green — output pasted
[ ] 💰 Money: double-entry, zero-sum, no balance column, integer paise,
      effective-dated, evidence-linked
[ ] 📷 Evidence: camera-only, server time, geofenced, sequence-locked,
      and every rejection has an appeal path
[ ] 🔒 Any gate it touches is blocked at the API, tested through the API
[ ] Tenant-scoped by construction
[ ] Zero pink literals
[ ] All strings in three catalogues, including any generated PDF
[ ] Works with the network off; queue drains on restore
[ ] Doer ≠ approver, enforced at the query layer, with a 403 test
[ ] Three auditors run fresh; findings resolved or deferred with reasons
[ ] No TODO / FIXME / mock in the shipped path
[ ] docs/TASKS.md ticked with a one-line evidence note
[ ] Durable learnings written to a file, not left in conversation
```

---
---

# PART IX — SESSION RITUALS

**Opening — 60 seconds, every session:**
```
1. Read docs/TASKS.md → what is actually open
2. Read only the manual Part for the current slice
3. /context if resuming something long
4. State: "Resuming <slice>. Phase <N>. Gate <N-1> passed on <evidence>."
```

**Closing — every session, no exceptions:**
```
1. Run docs/VERIFY.md. Paste output.
2. Update docs/TASKS.md to match reality
3. Write durable learnings to CLAUDE.md
4. Delete scratch files
5. Final message, four lines:
   — what changed
   — what was verified, and how
   — what remains open
   — the exact next action
```

---
---
---

# APPENDIX A — `CLAUDE.md` KERNEL

*Project root. Under 200 lines, forever. This is the always-loaded layer.*

```markdown
# ALL INDIA ELEVATORS COMPANY — Platform
Pune pilot · Owner: Mr. Prashant Vasant Wable · One codebase, nine roles.

## Source of truth
`AIEC_App_Manual.md` — the product. Read by Part, never whole.
`AIEC_BUILD_PROTOCOL.md` — how it gets built. Read at phase gates.

## Build & verify
- Install / Dev / Test / Typecheck / Build: <commands>
- Full verification: `docs/VERIFY.md`. Run all of it before claiming anything.

## THE TEN IMMOVABLES (enforced by hooks, not goodwill)
1. Nothing is done until something that is not you says so — evidence, always
2. Money is double-entry, append-only. No balance column, ever. Integer paise
3. Camera-only evidence. Server time only. Every rejection ships its appeal
4. No pink value in code. Settings store, effective-dated. No inline fallbacks
5. Multi-tenant from migration 001, enforced at the query layer
6. The person who does the work never approves it — query layer, not UI
7. Offline must work. No field path may await a network call
8. Every string externalised. EN / मराठी / हिंदी. ₹1,50,000 never ₹150,000
9. IDs generated centrally: MH-PUN-KOT-ORD-0041-K with Damm check
10. Demo and real never touch

## THE FIVE PAYMENT GATES (code, not reminders — no UI or admin override)
🔒 No token → no agreement, no order
🔒 No QC clearance → no drawings, no material
🔒 No pre-dispatch payment → no supplier order placed
🔒 No verified evidence → no technician payout accrual
🔒 No final payment → no NOC

## Operating protocol — IMPORTANT
- YOU MUST NOT claim work complete without running `docs/VERIFY.md` and
  pasting the output.
- YOU MUST use plan mode for any change touching 3+ files.
- YOU MUST /clear between unrelated tasks.
- Every feature ships as a vertical slice with all seven states, including
  offline and blocked-by-gate.
- Never commit or push unless explicitly asked.

## Compact instructions
When compacting, always preserve: the current phase and gate status, the full
list of modified files, failing test names, any pink value discussed, and any
money-path decision made this session.
```

---

# APPENDIX B — `.claude/settings.json`

```json
{
  "permissions": {
    "allow": [
      "Bash(npm test)", "Bash(npm run typecheck)", "Bash(npm run lint)",
      "Bash(npm run build)", "Bash(git status)", "Bash(git diff *)"
    ],
    "deny": [
      "Bash(git push --force *)", "Bash(rm -rf *)",
      "Read(./.env)", "Read(./**/*.pem)"
    ]
  },
  "hooks": {
    "PreToolUse": [
      { "matcher": "Edit|Write", "hooks": [
        { "type": "command", "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/immovables.sh" }
      ]}
    ],
    "Stop": [
      { "hooks": [
        { "type": "command", "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/verify-gate.sh", "timeout": 300 }
      ]}
    ]
  }
}
```

**`.claude/hooks/immovables.sh`** — blocks the four cheapest defects at write time:

```bash
#!/usr/bin/env bash
FILE=$(jq -r '.tool_input.file_path // empty')
BODY=$(jq -r '.tool_input.new_string // .tool_input.content // empty')

deny () {
  jq -n --arg r "$1" '{hookSpecificOutput:{hookEventName:"PreToolUse",
    permissionDecision:"deny", permissionDecisionReason:$r}}'
  exit 0
}

# IMMOVABLE 3 — camera-only evidence
case "$FILE" in *evidence*|*capture*|*sop*)
  echo "$BODY" | grep -qE 'type="file"|ImagePicker|getPhotos' \
    && deny "IMMOVABLE 3: gallery/file input in an evidence path. Camera only." ;;
esac

# IMMOVABLE 3 — server time only
case "$FILE" in *ledger*|*evidence*|*sla*|*payout*)
  echo "$BODY" | grep -q 'Date\.now()' \
    && deny "IMMOVABLE 3: device time in a ledger/evidence/SLA path. Server time only." ;;
esac

# IMMOVABLE 2 — no balance column
echo "$BODY" | grep -qiE '(add|alter).*column.*balance|balance +(numeric|decimal|integer)' \
  && deny "IMMOVABLE 2: balance column. Balance is a projection over the ledger."

# IMMOVABLE 4 — no pink literals
case "$FILE" in *pricing*|*payout*|*commission*|*sla*|*quote*)
  echo "$BODY" | grep -qE '=[[:space:]]*[0-9]+(\.[0-9]+)?[[:space:]]*;.*(pct|rate|days|fee|amount)' \
    && deny "IMMOVABLE 4: numeric literal in a tunable path. Read from the settings store." ;;
esac

exit 0
```

**`.claude/hooks/verify-gate.sh`** — the deterministic Stop gate:

```bash
#!/usr/bin/env bash
# Exit 2 = do not end the turn. Overridden after 8 consecutive blocks,
# so this script must be able to succeed.
npm run typecheck --silent >/dev/null 2>&1 || {
  echo "BLOCKED: typecheck fails." >&2; exit 2; }
npm test --silent >/dev/null 2>&1 || {
  echo "BLOCKED: tests fail." >&2; exit 2; }
exit 0
```

---

# APPENDIX C — THE THREE AUDITORS

**`.claude/agents/money-auditor.md`**

```markdown
---
name: money-auditor
description: Audits every rupee path in a diff. Use proactively before marking any slice complete.
tools: Read, Grep, Glob, Bash
model: opus
---
You are auditing money code you did not write and have no stake in.

For every money path in the diff, verify and report PASS/FAIL with file:line:
1. Double-entry — two rows, summing to zero
2. Append-only — no UPDATE, no DELETE on ledger rows
3. No balance column anywhere in schema or model
4. Integer paise — no float, no decimal type for currency
5. Server timestamp — no device time
6. Tenant-scoped
7. Amount read from the settings store, no literal, no inline fallback
8. Effective-dated — a config change cannot move a closed job's money
9. No arithmetic on money in the client layer
10. Evidence pointer present where a gate authorised the movement

Report only failures, each with the file:line and the concrete consequence
(which rupee, on which job, moves wrongly). Do not report style.
```

**`.claude/agents/evidence-auditor.md`**

```markdown
---
name: evidence-auditor
description: Audits evidence capture and verification paths for integrity and fairness.
tools: Read, Grep, Glob, Bash
model: opus
---
Audit every evidence path in the diff. Report PASS/FAIL with file:line:
1. Camera-only — no file input, picker, or drag-drop anywhere in the path
2. Server timestamp on receipt; device time never trusted
3. Geofence enforced server-side, not hidden client-side
4. Sequence lock — step N+1 impossible before step N is verified
5. Mock-location detection present on ingest
6. Perceptual-hash duplicate check runs BEFORE credit, not after
7. Parent ID stamped at creation — no "attach to job" step exists
8. **Every rejection path has an appeal route in the same diff**
9. Worker is paid while an appeal is pending
10. Capturing user recorded per photo, not per job (crew integrity)

Item 8 is the one that loses the workforce if it is missing. Weight it first.
```

**`.claude/agents/gate-auditor.md`**

```markdown
---
name: gate-auditor
description: Verifies the five payment gates are enforced at the API with no override.
tools: Read, Grep, Glob, Bash
---
For each of the five payment gates, find the enforcement point and report:
- WHERE it is enforced (file:line) and at which layer
- Whether a test attempts the forbidden transition THROUGH THE API and asserts refusal
- Whether ANY override path exists at any privilege level, including admin

Gates:
1. No token -> no agreement, no order
2. No QC clearance -> no drawings, no material
3. No pre-dispatch payment -> no supplier order placed
4. No verified evidence -> no payout accrual
5. No final payment -> no NOC

A gate enforced only in the UI is a FAIL. An override at any level is a FAIL.
```

---

# APPENDIX D — `docs/VERIFY.md` TEMPLATE

*Fill the commands at Gate 3. Every completion claim from that point cites this file.*

```markdown
# VERIFY — AIEC
Run ALL of it. Paste the output. No claim of completion is valid without it.

| # | What | Command | Pass condition |
|---|---|---|---|
| 1 | Types | <cmd> | exit 0 |
| 2 | Lint | <cmd> | exit 0 |
| 3 | Unit | <cmd> | exit 0, 0 failures |
| 4 | E2E | <cmd> | exit 0 |
| 5 | Build | <cmd> | exit 0 |
| 6 | Migrate from empty | <cmd> | exit 0 |
| 7 | Ledger balances to zero | <cmd> | sum = 0 |
| 8 | No pink literals | <grep cmd> | 0 hits |
| 9 | No file input in evidence paths | <grep cmd> | 0 hits |
| 10 | No Date.now() in ledger/SLA | <grep cmd> | 0 hits |
| 11 | Every i18n key in all 3 catalogues | <cmd> | 0 missing |
| 12 | Every table has tenant_id | <cmd> | 0 missing |

## Manual checks (no command can prove these)
- [ ] Feature works with the network OFF; queue drains on restore
- [ ] Rendered in मराठी on a small viewport
- [ ] All seven states seen, including blocked-by-gate
- [ ] Amounts render as ₹1,50,000
```

---

# APPENDIX E — COMMAND CHEAT SHEET

| Need | Command |
|---|---|
| Plan without touching files | `Shift+Tab` → `⏸ plan mode on` |
| Edit the plan directly | `Ctrl+G` |
| Read one manual Part only | `sed -n '<start>,<end>p' AIEC_App_Manual.md` |
| See what's eating context | `/context` |
| Reset between slices | `/clear` |
| Targeted compact | `/compact focus on the ledger changes` |
| Side question, no history cost | `/btw` |
| Stop mid-action, keep context | `Esc` |
| Rewind code and/or conversation | `Esc Esc` or `/rewind` |
| Side task needing full context | `/subtask` |
| Review the diff | `/code-review high` · `ultra` before a merge |
| Security scan | `/security-review` |
| Hold a completion condition | `/goal all VERIFY checks green` |
| What config actually loaded | `/doctor` · `/hooks` · `/memory` |
| Parallel isolated slice | `claude --worktree` |

---

## CLOSING INSTRUCTION

The manual ends with the sentence that governs this entire build:

> *The moment one customer gets the NOC without paying, or one technician gets paid without evidence, every gate in the system becomes negotiable — and the entire model reverts to a traditional elevator business with a nicer interface.*

You will be tempted, at some point, to soften a gate because the work looks obviously fine and the gate is in the way.

That temptation is the single reliable predictor of the defect that costs real money later. The gates are cheap. What they catch is not.

Run the gate.
