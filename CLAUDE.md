@AGENTS.md

# ALL INDIA ELEVATORS COMPANY — Platform
Pune pilot · Owner: Mr. Prashant Vasant Wable · One codebase, nine roles.

## Start here
**Read `docs/HANDOFF.md` at the start of every session.** It holds the open work
(including an in-progress map bug with its confirmed cause and fix), the traps
that already cost time, and the decisions not to re-litigate.

## Source of truth
- `docs/source/AIEC_App_Manual.md` — the product. Read by Part, never whole.
- `docs/source/AIEC_BUILD_PROTOCOL.md` — how it gets built. Read at phase gates.

## Stack (decided, verified running)
Expo SDK 57 · React Native 0.86 · React 19.2.3 · expo-router (file-based)
NativeWind v4.2.6 on **Tailwind v3.4** · react-native-svg · TypeScript 6

**Tailwind stays on v3.** NativeWind v5 (the Tailwind v4 route) has reported
breakage in theme-based styles and dark mode, which is precisely this project's
core mechanism — five themes over CSS variables. Do not "upgrade" it.

**expo-router is not compatible with react-navigation as of SDK 56.** Import
`ThemeProvider`, `DarkTheme`, `DefaultTheme`, `Theme` from `expo-router` itself.
Installing `@react-navigation/*` breaks the bundler with an explicit error.

## Build & verify
- Dev server: `npx expo start --web --port 8081`
- Typecheck: `npm run typecheck`
- i18n parity: `npm run i18n:check`
- Both: `npm run verify`
- Full list: `docs/VERIFY.md`. Run all of it before claiming anything.

## Architecture
- `src/design/` — three-tier tokens. `palette.ts` is tier 2 (semantic, per theme),
  applied via NativeWind `vars()` in `theme-provider.tsx`. Components use Tailwind
  class names only and never see a hex.
- `src/design/themes.ts` — per-theme sizing, role→theme and role→language maps.
- `src/i18n/` — catalogues typed against English, so a missing key fails `tsc`.
  `format.ts` owns Indian numbering; no component calls `Intl` directly.
- `src/components/states/` — all seven states in one file.
- `src/contract/` — typed API surface plus fixtures. Money is integer paise.
- `app/` — expo-router routes; one folder per role, each with its own layout.

## Themes
Six palettes, not five: the manual gives sales and supplier a **light** Command
variant (`commandLight`) distinct from admin's dark one, and puts onboarding on
Sunlight rather than Premium. `ROLE_THEME` in `src/design/themes.ts` is the
only place that mapping lives.

## THE TEN IMMOVABLES
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
- No token → no agreement, no order
- No QC clearance → no drawings, no material
- No pre-dispatch payment → no supplier order placed
- No verified evidence → no technician payout accrual
- No final payment → no NOC

`src/contract/gates.ts` holds their *presentation* only. Enforcement is
server-side at the API; a gate that exists only in the UI is not a gate.

## Current state — read before assuming
The UI runs across all nine roles — 66 screens, three layers deep for rider,
technician, customer, QC, admin, sales and supplier. Coverage and the list of
screens still missing: `docs/SCREENS.md`.

There is **no backend**: screens render fixtures from `src/contract/fixtures.ts`
and `fixtures-detail.ts`. Every money and evidence guarantee the UI expresses is
presentational until the server exists. The web map is real MapLibre GL on free
OpenFreeMap tiles (`map-shell.web.tsx`) with real Pune coordinates
(`src/contract/geo.ts`) — but its basemap does not paint yet: see
`docs/HANDOFF.md`, open work item 1. Native (`map-shell.tsx`) is a schematic SVG
with the same props until a dev client can carry native MapLibre.

The screen tree lives in `src/navigation/screens.ts` as data; the bottom
navigation reads it, so routes and navigation cannot drift apart. Tab bars use
`tabLabelKey` short forms — full screen titles truncate at five tabs.

## Operating protocol
- YOU MUST NOT claim work complete without running `npm run verify` and pasting output.
- Every feature ships as a vertical slice with all seven states, including
  offline and blocked-by-gate.
- Look at the screen before calling it done: small viewport, in मराठी, network off.
- Never commit or push unless explicitly asked.
