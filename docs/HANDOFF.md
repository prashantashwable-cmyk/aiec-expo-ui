# HANDOFF — read this first in any new session

This project was built locally on Windows over two long Claude Code sessions and
moved to this repo on 2026-09-17 so work can continue entirely in the cloud.
`CLAUDE.md` is the always-loaded rulebook; this file is the state of play.

## What this is

The **All India Elevators Company** platform UI, built from
`docs/source/AIEC_App_Manual.md` (the product) following
`docs/source/AIEC_BUILD_PROTOCOL.md` (how to build it).

One Expo codebase, nine roles, six role themes, three languages. **66 screens**,
three navigation layers deep for most roles. UI only — **no backend**; every
screen renders typed fixtures from `src/contract/`.

This is **not** the same project as the owner's other AIEC repos
(`aiec-platform`, `aiec-pune-pilot`, `aiec-manual-v3`, `aiec-build-pack`, …).
Do not copy code or decisions across from those.

## Run it

```bash
npm install
npx expo start --web --port 8081
npm run verify          # typecheck + i18n parity — must be green before any claim
```

## Open work — pick up exactly here

### 1. Map basemap is blank (in progress when the session moved)

**Symptom** — on `/rider` the MapLibre map mounts, all 7 pins and the live
position render, OpenFreeMap attribution shows, but **no streets paint**, and the
route trail and heat zones (GL layers) never appear.

**Cause, confirmed** — console: `Failed to load module script: The server
responded with a non-JavaScript MIME type of "text/html"`. MapLibre GL **v6**
loads its tile worker as a *module worker* from a separate file,
`maplibre-gl-worker.mjs`, which itself imports `./maplibre-gl-shared.mjs`.
Metro does not serve those files, returns `index.html`, and the worker dies.
Markers still work because they are DOM elements and never touch the worker.

**Fix to apply**
1. Add `scripts/copy-maplibre-worker.mjs` that copies
   `node_modules/maplibre-gl/dist/maplibre-gl-worker.mjs` and
   `maplibre-gl-shared.mjs` into `public/maplibre/` (same folder — the relative
   import depends on it). Run it from a `postinstall` script so the copy always
   matches the installed version.
2. In `src/components/anatomy/map-shell.web.tsx`, call
   `maplibregl.setWorkerUrl("/maplibre/maplibre-gl-worker.mjs")` once, before
   the first `new maplibregl.Map(...)`.
3. Verify the file is served as JavaScript:
   `curl -I http://localhost:8081/maplibre/maplibre-gl-worker.mjs` → content-type
   must be a JS type. If Expo serves `.mjs` wrongly, rename the copies to `.js`
   and fix the import specifier inside the worker copy.
4. Verify in the browser: tiles paint on `/rider`, the blue trail and orange heat
   circles appear, and the dark themes (`/technician/jobs`, `/admin`) show an
   inverted basemap with pins still in their true legend colours.

**Already fixed in this file — do not undo**
- `import * as maplibregl from "maplibre-gl"` — named imports come back
  `undefined` through Metro's CJS interop even though the typings allow them.
- `setLiveMap(instance)` immediately after construction, not on `"load"`.
  React mounts effects twice in dev; waiting on `load` with a boolean flag left
  markers attached to the destroyed first instance.
- GL layers go through `whenStyleReady()` because they need the style parsed.

### 2. Screens still missing

Listed at the bottom of `docs/SCREENS.md`: A3, A6, A8, S6, P5, C2, C4, C9, T4,
T7, T9, Q3, and R2 as a real camera flow. Their catalogue keys, nav entries and
fixtures do not exist yet.

### 3. Align the UI with the Screen Bible

`docs/source/AIEC_Screen_Bible.html` was added after the UI was built, so none of
the 66 screens has been checked against it. Before building the missing screens
in item 2, read its Pixel Foundation and Component Library sections and compare
them with `src/design/` — token or component mismatches are cheaper to fix now
than after another dozen screens copy the current pattern. The manual still
wins on product behaviour; the Screen Bible governs visual and per-screen detail.

Also: `src/i18n/catalogues/mr.ts` was translated without
`docs/source/AIEC_App_Manual_Marathi.md`. Its terminology should be reconciled
with the manual's Marathi so the app and the manual use the same words.

### 4. Native map

`map-shell.tsx` (native) is a deliberately schematic SVG with the same props and
real lng/lat maths. Real native maps need `@maplibre/maplibre-react-native`,
which needs a custom dev client — it cannot run in Expo Go.

## Decisions already made — do not re-litigate

| Decision | Why |
|---|---|
| Expo SDK 57 + expo-router | One codebase; native builds give background GPS and mock-location detection that a PWA cannot |
| NativeWind **v4 on Tailwind v3.4** | NativeWind v5 (Tailwind v4) has reported breakage in theme-based styles and dark mode — this project's core mechanism |
| Themes via NativeWind `vars()`, not CSS classes | Works identically on native and web |
| Six palettes | Manual gives sales and supplier a **light** Command variant; onboarding is Sunlight, not Premium |
| i18n catalogues typed against English | A missing Marathi or Hindi key fails `tsc`, not the user |
| OpenFreeMap tiles | Free, no API key, no registration, no request limits |
| Real Pune coordinates in `src/contract/geo.ts` | Replaced the old normalised 0–1 map space |
| Navigation tree as data (`src/navigation/screens.ts`) | Tab bar and routes cannot drift apart |
| Tab bars use short `tabLabelKey` labels, 12px cap | Full titles truncated and clipped at five tabs |

## Traps that cost real time

- **Never install `@react-navigation/*`.** expo-router ≥ SDK 56 vendors it and
  the bundler throws. Import `ThemeProvider`, `DarkTheme`, `Theme` from
  `expo-router`.
- **The navigator paints `rgb(242,242,242)` behind screens**, washing out dark
  themes. `app/_layout.tsx` hands it a transparent theme — keep that.
- **`babel-preset-expo` must be a direct devDependency**, or Metro fails with
  "Cannot read properties of undefined (reading 'transformFile')".
- **`darkMode: "class"`** in `tailwind.config.js`, or NativeWind throws
  "Cannot manually set color scheme".
- **Radios need `aria-checked`** passed directly; `accessibilityState` does not
  reach it on web.
- **SVG strokes and raw style colours use `useThemeColor()`**, never a literal.
- Screenshots of the preview can come back mis-scaled while the pane is hidden;
  verify with DOM measurements when that happens.

## Verified at handoff

- `npm run verify` green: typecheck clean, **337 i18n keys × 3 languages**,
  placeholders aligned.
- Grep gates all zero: no gallery/file input in evidence paths, no `Date.now()`
  in money/evidence paths, no raw hex or `rgb()` in components, no `balance`.
- 41 routes walked programmatically at 375px: none blank, no horizontal
  overflow, no truncated tab labels.
- Rider capture button measured at exactly 72px.

## Chat history

Full transcripts of both build sessions are in `docs/history/transcripts/`
(JSON Lines, one event per line, ~14 MB total). They are the raw record, not
required reading — this file and `CLAUDE.md` carry the decisions. To find
something specific, grep rather than opening them whole:

```bash
grep -o '"text":"[^"]*MapLibre[^"]*' docs/history/transcripts/*.jsonl | head
```

`docs/history/plans/ui-foundation-plan.md` is the approved plan the UI build
started from.

## Source documents

| File | What it is |
|---|---|
| `docs/source/AIEC_App_Manual.md` | The product. Canonical. |
| `docs/source/AIEC_BUILD_PROTOCOL.md` | How it gets built: immovables, phases, gates |
| `docs/source/AIEC_App_Manual_Marathi.md` | Full Marathi translation of the manual |
| `docs/source/AIEC_Screen_Bible.html` | Per-screen visual spec, all nine roles |
| `docs/source/AIEC_Screen_Bible.pdf` | Same Screen Bible, for reading on a phone |

The Screen Bible HTML is a cleaned copy of a page saved from a claude.ai
artifact: the saved-from URL carrying a frame access token was removed, section
links were rewritten from the dead sandbox address to in-page anchors, and the
font stylesheet was inlined so it opens as a single file. The content itself is
unchanged. The original lives only on the old Windows machine.
