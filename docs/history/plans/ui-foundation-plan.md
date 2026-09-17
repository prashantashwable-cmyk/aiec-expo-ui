# AIEC — UI foundation, first build phase

## Context

`C:\Users\allin\AIEC UI` is an empty directory — no git, no code. The product is
specified by two documents: `AIEC_App_Manual.md` (what it does, 2,068 lines) and
`AIEC_BUILD_PROTOCOL.md` (how it gets built, ten immovables + a phase machine).

The user's instruction was to research the best, most detailed UI first and see the
UI direction before any building starts. That research is done and the visual
direction has been rendered and reviewed in-conversation (five role themes, rider
Sunlight screens, technician Slate + customer Premium, admin Command, owner Executive).

**Deliberate deviation, on the record.** The Build Protocol's Part 14 sets build
order as compliance → payment → offline → evidence → features, and names "app first,
compliance later" as the fastest way to lose the business. Going UI-first inverts
that. It is workable — a UI built against a typed API contract forecloses nothing —
but this plan keeps money, evidence and gate logic as *server-authoritative contract
stubs* so none of it gets baked into components and has to be unpicked later.

## Research conclusions (settled)

| Decision | Choice | Why |
|---|---|---|
| Component base | shadcn/ui on Tailwind v4 | Five themes = five CSS-variable blocks, not five component forks. You own the source. |
| Polish layer | Untitled UI React patterns | Tailwind v4.2 + React Aria + TS 5.9, Figma-synced. Reference, not dependency. |
| Token format | W3C Design Tokens Format Module v2025.10 | Stable Oct 2025, backed by Adobe/Google/Meta/Figma. 3-tier: primitive → semantic → component. |
| Map | MapLibre GL + PMTiles | Only route where "pre-download the assigned area at job accept" actually works. No per-load metering. |
| Devanagari | Noto Sans Devanagari UI | Purpose-built for interfaces; tighter vertical metrics than the text cut, which matters at 72px buttons and in dense Admin tables. |
| Motion | Spring physics, 200–500ms, + haptics | 2026 standard. Law 4 needs effort→reward under 3s. |

Ergonomics, from research rather than taste: **72px** rider primary action (helmeted,
one-handed, in glare — not generous, correct); **56px** technician tick targets
(gloves degrade effective precision to 20–25mm); WCAG AA (4.5:1 / 3:1) as the floor,
not the sunlight target. Icons are semantically opaque to low-literate users — pair
every icon with colour, shape and voice; prefer photo thumbnails to glyphs.

## The UI direction

**Five themes, one anatomy.** Sunlight (rider), Slate (technician/QC), Premium
(customer), Command (admin), Executive (owner). Only density, contrast and control
size differ. Shared across all five, identical everywhere:

- Map underneath — no list-first screen exists anywhere (Law 2)
- Entity card as a three-state bottom sheet (peek / mid / full), non-modal, map stays live
- Money meter in the top strip
- Task card with exactly four facts: work, distance, time, money
- Draggable help bubble carrying `screen_id`

**Seven states per screen, all of them.** Loading, empty, error, partial,
permission-denied, offline (with queue depth visible), and blocked-by-gate. The
seventh names the gate, what unblocks it, and who can act — a gate that blocks
without explaining itself produces the phone call the product exists to remove.

## Build order for this phase

1. **Scaffold + token layer.** Repo init, Tailwind v4, W3C-format token pipeline
   emitting five theme blocks from one primitive set. Theme switch at the root.
2. **i18n from the first commit.** EN / मराठी / हिंदी catalogues, Indian numbering
   formatter (`₹1,50,000`) in the shared layer only. A missing key is a build break.
   Language switch must not lose form state.
3. **Shared anatomy components.** Map shell, three-state entity card, money meter,
   task card, help bubble, and the seven state components as first-class primitives.
4. **Role shells.** Nine navigation shells, correct theme and default language each.
5. **Flagship screens.** Rider R1/R2/R5, Technician T2, Customer C1, Admin A1+A2,
   Owner panels 1–4 — every one with all seven states.
6. **Typed API contract + mock.** Money in integer paise, server timestamps, settings
   keys, evidence rows. No arithmetic on money in any component.

## Open decisions

These were put to the user and dismissed; defaults below are what this plan assumes
unless redirected.

1. **Scope** — assume design system + all nine shells + flagship screens (~20 screens
   at production polish), remainder scaffolded with real routes and empty states.
2. **Platform** — assume **Expo (React Native + Web)**. This is the consequential one:
   a browser cannot check `isFromMockProvider`, so a PWA-only build leaves Law 11's
   mock-location detection structurally unenforceable, and that check protects the
   payment model. Expo's web export still gives the customer a browser URL with
   nothing to install.
3. **Map** — MapLibre GL + PMTiles as above.
4. **Data** — mock fixtures behind the typed contract.

## Verification

- `npm run typecheck`, `lint`, `build` green; commands recorded in `docs/VERIFY.md`
- Every i18n key present in all three catalogues — missing key fails the build
- Grep gates: no `type="file"` / `ImagePicker` in any evidence path; no `Date.now()`
  in ledger/SLA/evidence paths; no numeric literal in a money or rate path
- Rendered and looked at: small viewport, in मराठी, with the network off
- All seven states seen rendered on every flagship screen, including blocked-by-gate
- Amounts render `₹1,50,000`, never `₹150,000`
