
/**
 * Demo fixtures standing in for the API.
 *
 * Every amount is integer paise (Immovable 2) and every timestamp is an ISO
 * string that the server would have stamped (Immovable 3) — so swapping this
 * module for a real transport is a change of source, not of shape.
 */

export const RIDER_DAY = {
  leadsToday: 3,
  metresToday: 12_400,
  todayPaise: 59_000,
  pendingPaise: 59_000,
  clearedPaise: 214_000,
  toNextTierPaise: 16_000,
  tierProgress: 0.74,
  queuedPhotos: 5,
  online: false,
  hotZoneMetres: 400,
};

export const RIDER_CAPTURE = {
  leadId: "MH-PUN-KOT-LEAD-0447-J",
  address: "Survey 42, Kothrud, Pune 411038",
  builder: "Shreeji Heights",
  phone: "98XXXXXX21",
  floors: "G+4",
  shaftReady: true,
  photos: [
    { id: "EVID-0891", label: "Shaft opening", captured: true },
    { id: "EVID-0892", label: "Full building", captured: true },
    { id: "EVID-0893", label: "Site board", captured: true },
  ],
  creditPaise: 4_000,
};

export const TECHNICIAN_STEP = {
  jobId: "MH-PUN-KOT-LIFT-0089-K",
  current: 6,
  total: 24,
  title: "Guide rail alignment",
  valuePaise: 280_000,
  previousStep: 5,
  previousVerifiedAt: "2026-08-28T11:04:00+05:30",
  daysRemaining: 9,
  hoursRemaining: 4,
  percentComplete: 62,
  geofenceMetres: 12,
  online: false,
  queuedPhotos: 2,
  evidence: [
    { id: "EVID-1201", label: "Laser line on rail, full height", status: "passed" },
    { id: "EVID-1202", label: "Torque wrench reading on clip", status: "retake", retries: 1, maxRetries: 2 },
    { id: "EVID-1203", label: "Fishplate joint close-up", status: "pending" },
    { id: "EVID-1204", label: "Full shaft wide shot", status: "pending" },
  ] as const,
};

export const CUSTOMER_LIFT = {
  liftId: "MH-PUN-KOT-LIFT-0089-K",
  site: "Shreeji Heights, Kothrud",
  stage: 6,
  totalStages: 10,
  percentComplete: 62,
  duePaise: 55_350_000,
  paidPaise: 1_000_000,
  hoursToWindowClose: 46,
  daysToHandover: 19,
  arrivedAt: "2026-08-28T09:40:00+05:30",
};

export const ADMIN_ALERTS = [
  {
    id: "MH-PUN-HAD-CONT-0112-R",
    priority: "P0",
    title: "Container tamper detected",
    detail: "Seal breach, Hadapsar, 2 minutes ago",
    autoAction: "Siren active, CCTV clip attached, police contact ready",
    decisions: ["Call site", "View clip"],
  },
  {
    id: "MH-PUN-KOT-SOPX-0641-T",
    priority: "P1",
    title: "Evidence failed twice",
    detail: "Step 6 torque reading · TECH-0088",
    autoAction: "Step frozen, technician notified, accrual still paid pending appeal",
    decisions: ["Approve", "Reject", "Side by side"],
  },
  {
    id: "MH-PUN-WAK-QUOT-0233-M",
    priority: "P2",
    title: "Margin override requested",
    detail: "Requested 18.2% · floor is 20%",
    autoAction: "Below floor — admin cannot approve, routed to owner",
    decisions: ["Awaiting owner"],
  },
] as const;

export const ADMIN_MAP = {
  counts: { p0: 2, p1: 3, p2: 1 },
  money: {
    tokensPaise: 12_000_000,
    escrowPaise: 30_800_000,
    payoutPaise: 41_000_000,
    rewardCapUsed: 2.1,
    rewardCapLimit: 2.5,
  },
};

export const OWNER_TODAY = {
  seiPercent: 94.2,
  seiDelta: 1.8,
  seiTarget: 95,
  breakdown: [
    { label: "Automated transitions", value: "96.1%", good: true },
    { label: "Human interventions / day", value: "14", good: true },
    { label: "Evidence accuracy", value: "97.4%", good: true },
    { label: "SLA adherence", value: "91.8%", good: false },
    { label: "Evidence false positives", value: "0.4%", good: true },
  ],
  tokensPaise: 12_000_000,
  materialPaise: 421_500_000,
  finalPaise: 30_800_000,
  supplierPaise: 337_200_000,
  workerPaise: 41_000_000,
  netMarginPaise: 86_100_000,
  netMarginPercent: 18.5,
  mtdNetPaise: 1_420_000_000,
  mtdDeltaPercent: 22,
  alerts: [
    { icon: "trending-up", title: "Steel index up 8%", detail: "Margin exposure on 31 open quotes" },
    { icon: "shopping-bag", title: "Competitor opened in Wakad", detail: "Conversion there down 12%" },
    { icon: "users", title: "Hadapsar technicians at 89%", detail: "Recruit before it constrains sales" },
    { icon: "map-pin", title: "4 city-partner enquiries", detail: "Royalty projections attached" },
  ],
} as const;
