/** Fixtures for admin, sales, supplier and onboarding. Money is integer paise. */

export interface AdminAlert {
  id: string;
  priority: "P0" | "P1" | "P2" | "P3";
  title: string;
  detail: string;
  autoAction: string;
  at: string;
  decisions: string[];
  /** Some alerts are informational: the machine has already handled them. */
  actionable: boolean;
}

export const ADMIN_ALERT_QUEUE: AdminAlert[] = [
  {
    id: "MH-PUN-HAD-CONT-0112-R",
    priority: "P0",
    title: "Container tamper detected",
    detail: "Seal breach, Hadapsar",
    autoAction: "Siren active, CCTV clip attached, police contact ready",
    at: "2026-08-28T14:31:00+05:30",
    decisions: ["Call site", "View clip"],
    actionable: true,
  },
  {
    id: "MH-PUN-KOT-SOPX-0641-T",
    priority: "P1",
    title: "Evidence failed twice",
    detail: "Step 6 torque reading, TECH-0088",
    autoAction: "Step frozen, technician notified, accrual still paid pending appeal",
    at: "2026-08-28T13:12:00+05:30",
    decisions: ["Approve", "Reject", "Side by side"],
    actionable: true,
  },
  {
    id: "MH-PUN-WAK-QUOT-0233-M",
    priority: "P2",
    title: "Margin override requested",
    detail: "Requested 18.2 percent, floor is 20",
    autoAction: "Below floor, routed to owner",
    at: "2026-08-28T11:48:00+05:30",
    decisions: [],
    actionable: false,
  },
  {
    id: "MH-PUN-BAN-LIFT-0091-C",
    priority: "P2",
    title: "Job slipping two days",
    detail: "Baner, technician TECH-0102",
    autoAction: "Helper offered at company cost, customer notified",
    at: "2026-08-28T09:05:00+05:30",
    decisions: ["Assign helper", "Call technician"],
    actionable: true,
  },
  {
    id: "SCREEN-T2",
    priority: "P3",
    title: "Confusing screen alert",
    detail: "18 help opens on T2 this week",
    autoAction: "Logged to the product backlog",
    at: "2026-08-27T18:00:00+05:30",
    decisions: [],
    actionable: false,
  },
];

export interface Approval {
  id: string;
  kind: "evidence" | "margin" | "suspension" | "penalty" | "refund";
  title: string;
  detail: string;
  paise?: number;
  /** Margin below the floor cannot be approved here at all. */
  adminCanDecide: boolean;
}

export const ADMIN_APPROVALS: Approval[] = [
  {
    id: "MH-PUN-KOT-SOPX-0641-T",
    kind: "evidence",
    title: "Evidence dispute, step 6",
    detail: "Torque reading illegible after two retakes",
    paise: 280000,
    adminCanDecide: true,
  },
  {
    id: "MH-PUN-WAK-QUOT-0233-M",
    kind: "margin",
    title: "Margin override to 18.2 percent",
    detail: "Below the 20 percent floor",
    adminCanDecide: false,
  },
  {
    id: "MH-PUN-KOT-TECH-0088-B",
    kind: "penalty",
    title: "Material shortfall penalty",
    detail: "4.2 m cable unaccounted",
    paise: 92000,
    adminCanDecide: true,
  },
];

export interface PinkSetting {
  key: string;
  value: string;
  unit: string;
  min: string;
  max: string;
  effectiveFrom: string;
  changedBy: string;
  ownerOnly?: boolean;
}

/**
 * Immovable 4 — every tunable number lives here, effective-dated. Changing one
 * must never move a closed job: the job keeps the version it ran under.
 */
export const PINK_SETTINGS: PinkSetting[] = [
  { key: "lead.capture.credit", value: "40", unit: "rupees", min: "10", max: "100", effectiveFrom: "2026-07-01T00:00:00+05:30", changedBy: "ADMIN-01" },
  { key: "lead.capture.credit.reduced", value: "10", unit: "rupees", min: "0", max: "40", effectiveFrom: "2026-07-01T00:00:00+05:30", changedBy: "ADMIN-01" },
  { key: "quote.margin.floor", value: "20", unit: "percent", min: "20", max: "60", effectiveFrom: "2026-06-15T00:00:00+05:30", changedBy: "OWNER", ownerOnly: true },
  { key: "quote.bot.discount.max", value: "30", unit: "percent", min: "0", max: "40", effectiveFrom: "2026-06-15T00:00:00+05:30", changedBy: "ADMIN-01" },
  { key: "gamification.budget.cap", value: "2.5", unit: "percent of margin", min: "0", max: "4", effectiveFrom: "2026-06-01T00:00:00+05:30", changedBy: "OWNER", ownerOnly: true },
  { key: "evidence.geofence.radius", value: "50", unit: "metres", min: "20", max: "100", effectiveFrom: "2026-06-01T00:00:00+05:30", changedBy: "ADMIN-01" },
  { key: "qc.rotation.lock", value: "90", unit: "days", min: "30", max: "180", effectiveFrom: "2026-06-01T00:00:00+05:30", changedBy: "ADMIN-01" },
  { key: "sla.payment.window", value: "48", unit: "hours", min: "24", max: "96", effectiveFrom: "2026-06-01T00:00:00+05:30", changedBy: "ADMIN-01" },
];

export interface AuditEntry {
  id: string;
  actor: string;
  action: string;
  reason: string;
  at: string;
}

export const ADMIN_AUDIT: AuditEntry[] = [
  { id: "AUD-0912", actor: "ADMIN-01", action: "Approved evidence dispute SOPX-0638", reason: "Torque mark visible on the wide shot", at: "2026-08-28T10:22:00+05:30" },
  { id: "AUD-0911", actor: "ADMIN-01", action: "Waived penalty for TECH-0091", reason: "Supplier shipped short, verified against packing photo", at: "2026-08-27T16:40:00+05:30" },
  { id: "AUD-0910", actor: "OWNER", action: "Changed quote.margin.floor", reason: "Steel index moved 8 percent", at: "2026-08-26T09:15:00+05:30" },
];

export interface SalesLead {
  id: string;
  site: string;
  score: number;
  band: "hot" | "warm" | "cold";
  stage: "new" | "sales" | "won" | "lost";
  listPaise: number;
  botFloorPaise: number;
  marginFloorPaise: number;
  attemptsUsed: number;
  attemptsAllowed: number;
  escalated: boolean;
}

export const SALES_LEADS: SalesLead[] = [
  {
    id: "MH-PUN-KOT-LEAD-0447-J",
    site: "Shreeji Heights, Kothrud",
    score: 82,
    band: "hot",
    stage: "new",
    listPaise: 80000000,
    botFloorPaise: 61500000,
    marginFloorPaise: 60000000,
    attemptsUsed: 1,
    attemptsAllowed: 3,
    escalated: false,
  },
  {
    id: "MH-PUN-KOT-LEAD-0441-B",
    site: "Sai Residency, Kothrud",
    score: 64,
    band: "warm",
    stage: "sales",
    listPaise: 72000000,
    botFloorPaise: 55000000,
    marginFloorPaise: 54000000,
    attemptsUsed: 2,
    attemptsAllowed: 3,
    escalated: true,
  },
  {
    id: "MH-PUN-BAN-LEAD-0398-K",
    site: "Trident Towers, Baner",
    score: 33,
    band: "cold",
    stage: "lost",
    listPaise: 0,
    botFloorPaise: 0,
    marginFloorPaise: 0,
    attemptsUsed: 3,
    attemptsAllowed: 3,
    escalated: false,
  },
];

export const BOT_CONVERSATIONS = [
  { id: "MH-PUN-KOT-CHAT-0311-K", site: "Shreeji Heights", stage: "Voice bot, question 4 of 6", live: true },
  { id: "MH-PUN-KOT-CHAT-0309-B", site: "Sai Residency", stage: "Negotiation, offer 2", live: true },
  { id: "MH-PUN-HAD-CHAT-0304-M", site: "Gera Greens", stage: "Awaiting reply, follow-up at +72 h", live: false },
];

export interface SupplierOrder {
  id: string;
  site: string;
  valuePaise: number;
  acceptHoursLeft: number;
  state: "offered" | "accepted" | "packing" | "sealed" | "transit" | "paid";
  dueAt: string;
}

export const SUPPLIER_ORDERS: SupplierOrder[] = [
  { id: "MH-PUN-KOT-SUPP-0451-A", site: "Shreeji Heights, Kothrud", valuePaise: 33720000, acceptHoursLeft: 3, state: "offered", dueAt: "2026-09-02T10:00:00+05:30" },
  { id: "MH-PUN-BAN-SUPP-0448-C", site: "Trident Towers, Baner", valuePaise: 41200000, acceptHoursLeft: 0, state: "packing", dueAt: "2026-08-31T10:00:00+05:30" },
  { id: "MH-PUN-HAD-SUPP-0442-N", site: "Gera Greens, Hadapsar", valuePaise: 29800000, acceptHoursLeft: 0, state: "transit", dueAt: "2026-08-29T10:00:00+05:30" },
];

export const SUPPLIER_PERFORMANCE = {
  onTimePercent: 96.2,
  rating: 4.8,
  defectRate: 0.8,
  ordersThisMonth: 14,
};

export const ONBOARDING_MODULES = [
  { id: "M1", title: "Safety first", required: 100, done: true },
  { id: "M2", title: "Tools and materials", required: 80, done: true },
  { id: "M3", title: "SOP fundamentals", required: 80, done: false },
  { id: "M4", title: "The app", required: 0, done: false },
  { id: "M5", title: "Customer conduct", required: 80, done: false },
];

export const ONBOARDING_SKILLS = [
  { id: "electrical", icon: "zap" },
  { id: "welding", icon: "tool" },
  { id: "mechanical", icon: "settings" },
  { id: "wiring", icon: "git-branch" },
  { id: "height", icon: "trending-up" },
  { id: "tools", icon: "briefcase" },
  { id: "twoWheeler", icon: "navigation" },
  { id: "liftExperience", icon: "chevrons-up" },
] as const;
