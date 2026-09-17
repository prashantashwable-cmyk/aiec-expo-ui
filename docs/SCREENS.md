# Screen coverage

The three-layer tree. Layer 1 is the role home, layer 2 is the manual's screen
inventory for that role, layer 3 is the detail beneath each.

Ids are the manual's own (R3, T5, C7, Q2, A7), so a support call or a bug
report can name an exact screen. The tree is held as data in
`src/navigation/screens.ts`, which is what the bottom navigation reads — so
routes and navigation cannot drift apart.

**66 screens across all nine roles.**

## Rider — Sunlight, मराठी
| Layer | Screen | Route |
|---|---|---|
| 1 | R1 Ride map | `/rider` |
| 2 | R2 Capture confirm | `/rider/capture` |
| 2 | R3 My leads | `/rider/leads` |
| 3 | R3.1 Lead detail, evidence and timeline | `/rider/leads/[id]` |
| 2 | R4 Coverage | `/rider/coverage` |
| 3 | R4.1 Zone detail | `/rider/coverage/[zone]` |
| 2 | R5 Earnings | `/rider/earnings` |
| 3 | R5.1 Wallet entry, settings key and evidence | `/rider/earnings/[id]` |
| 2 | R6 Leaderboard | `/rider/leaderboard` |
| 2 | R7 Schedule | `/rider/schedule` |
| 3 | R7.1 Task detail, escalation ladder | `/rider/schedule/[id]` |

## Technician — Slate, मराठी
| Layer | Screen | Route |
|---|---|---|
| 1 | T1 Job map | `/technician/jobs` |
| 2 | T2 Today's SOP step | `/technician` |
| 2 | T3 Full SOP tree, 24 steps | `/technician/sop` |
| 3 | T3.1 Step detail | `/technician/sop/[step]` |
| 2 | T5 Materials, phase-sealed kits | `/technician/materials` |
| 3 | T5.1 Kit detail | `/technician/materials/[kit]` |
| 2 | T6 Money meter | `/technician/money` |
| 3 | T6.1 Accrual with appeal route | `/technician/money/[id]` |
| 2 | T8 Training | `/technician/training` |
| 3 | T8.1 Module | `/technician/training/[id]` |

## Customer — Premium, English, browser only
| Layer | Screen | Route |
|---|---|---|
| 1 | C1 My lift | `/customer` |
| 2 | C3 Shaft readiness | `/customer/shaft` |
| 3 | C3.1 Requirement detail | `/customer/shaft/[id]` |
| 2 | C5 Payments ladder | `/customer/payments` |
| 3 | C5.1 Receipt | `/customer/payments/[id]` |
| 2 | C6 Live container | `/customer/container` |
| 2 | C7 Installation progress | `/customer/progress` |
| 3 | C7.1 Day detail | `/customer/progress/[day]` |
| 2 | C8 Handover and NOC | `/customer/handover` |

## QC — Slate, मराठी
| Layer | Screen | Route |
|---|---|---|
| 1 | Q1 Inspection map | `/qc` |
| 2 | Q2 Shaft clearance, 18 items | `/qc/clearance` |
| 3 | Q2.1 Check detail | `/qc/clearance/[item]` |
| 2 | Q4 Surprise queue | `/qc/surprise` |
| 2 | Q5 Reports | `/qc/reports` |
| 3 | Q5.1 Report detail | `/qc/reports/[id]` |
| 2 | Q6 Earnings and rating | `/qc/earnings` |

## Admin — Command, dark, dense
| Layer | Screen | Route |
|---|---|---|
| 1 | A1 Live city map | `/admin` |
| 2 | A2 Alert queue | `/admin/alerts` |
| 3 | A2.1 Alert detail | `/admin/alerts/[id]` |
| 2 | A4 Approval desk | `/admin/approvals` |
| 3 | A4.1 Approval detail | `/admin/approvals/[id]` |
| 2 | A5 Money control | `/admin/money` |
| 2 | A7 SOP and rate configuration | `/admin/config` |
| 3 | A7.1 Setting detail, effective-dated | `/admin/config/[key]` |
| 2 | A9 Audit log | `/admin/audit` |

## Sales — Command light
| Layer | Screen | Route |
|---|---|---|
| 1 | S1 Pipeline map | `/sales` |
| 2 | S2 Lead cards | `/sales/leads` |
| 3 | S2.1 Pricing ladder and transcript | `/sales/leads/[id]` |
| 2 | S3 Bot console | `/sales/bots` |
| 2 | S4 Manual desk | `/sales/desk` |
| 2 | S5 Quote builder, admin-locked | `/sales/quotes` |

## Supplier — Command light
| Layer | Screen | Route |
|---|---|---|
| 1 | P1 Order board | `/supplier` |
| 3 | P1.1 Order detail | `/supplier/orders/[id]` |
| 2 | P2 Kit packing | `/supplier/packing` |
| 2 | P3 Container loading | `/supplier/loading` |
| 2 | P4 Live fleet map | `/supplier/fleet` |
| 2 | P6 Performance rating | `/supplier/performance` |

## Onboarding — Sunlight, aspirational, मराठी
| Layer | Screen | Route |
|---|---|---|
| 1 | B1 Earnings calculator | `/onboarding` |
| 2 | B2 Quick check | `/onboarding/check` |
| 2 | B3 Your details | `/onboarding/details` |
| 2 | B4 Training | `/onboarding/training` |
| 2 | B5 First job | `/onboarding/first-job` |

## Owner — Executive
`/owner` renders all four panels on one screen. That is correct for this role:
the manual is explicit that anything needing a second layer does not belong on
the owner view.

## First run
`/` two doors · `/demo` role grid

## Still missing

Layer 2 screens the manual lists that are not built: A3 role monitors, A6
analytics, A8 user management, S6 conversion analytics, P5 supplier payments,
C2 quotation and agreement, C4 drawings, C9 support bot, T4 evidence camera,
T7 leaderboard, T9 help and escalate, Q3 post-install audit checklist,
R2 as a live camera flow rather than a confirm screen.

Layer 3 that would follow: owner region and metric detail, admin user detail
and audit entry detail, customer agreement version and drawing viewer.

## What layer 3 is for

Layer 3 is where Law 1 pays off. Each detail screen resolves one ID into its
complete record — the evidence, the timeline, the settings key that set the
amount, and the gate that is holding it. That is the forensic reconstruction
the payment model depends on: a dispute is settled by opening one screen, not
by assembling a case.
