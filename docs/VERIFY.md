# VERIFY — AIEC

Run all of it. Paste the output. No claim of completion is valid without it.

| # | What | Command | Pass condition |
|---|---|---|---|
| 1 | Types | `npm run typecheck` | exit 0 |
| 2 | i18n parity | `npm run i18n:check` | 0 missing, placeholders aligned |
| 3 | Both of the above | `npm run verify` | exit 0 |
| 4 | Web build | `npm run build:web` | exit 0 |
| 5 | No gallery in evidence paths | `grep -rniE "imagepicker\|launchimagelibrary\|type=.file.\|getphotos" src app` | 0 hits |
| 6 | No device time in money/evidence/SLA | `grep -rn "Date.now()" src/contract src/components app` | 0 hits |
| 7 | No hex colours outside the palette | `grep -rn "#[0-9a-fA-F]\{6\}" src/components app` | 0 hits |
| 8 | No balance field | `grep -rniE "balance" src/contract` | 0 hits |

## Manual checks — no command can prove these

- [ ] Feature works with the network off; the queue drains on restore
- [ ] Rendered in मराठी on a small viewport
- [ ] All seven states seen rendered, including blocked-by-gate
- [ ] Amounts render as ₹1,50,000, never ₹150,000
- [ ] Language switch does not lose form data mid-entry
- [ ] Rider primary action measures 72px; technician tick targets 56px

| 9 | No raw rgb() outside the palette | `grep -rn "rgb(" src/components app` | only demo.tsx and palette-driven uses |

## What is verified today

Steps 1–3 and the grep gates 5–9 pass. The screens are UI only — they render
fixtures, not a live API, so the money and evidence guarantees they express are
presentational until the server exists.

Measured in the live DOM rather than asserted: rider primary action 72px,
technician tick targets 56px, no horizontal overflow at 375px, tab labels
untruncated across all four built roles.
