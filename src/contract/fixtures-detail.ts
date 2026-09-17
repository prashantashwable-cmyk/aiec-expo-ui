import type { EvidenceItem, TimelineEntry } from "@/components/anatomy";
import type { MapStatus } from "@/design/themes";

/** Layer 2 and 3 fixtures. Money is integer paise; times are server ISO. */

export interface LeadSummary {
  id: string;
  site: string;
  zone: string;
  status: MapStatus;
  capturedAt: string;
  creditPaise: number;
  commissionPaise: number;
  commissionCleared: boolean;
}

export const RIDER_LEADS: LeadSummary[] = [
  {
    id: "MH-PUN-KOT-LEAD-0447-J",
    site: "Shreeji Heights, Kothrud",
    zone: "KOT",
    status: "new",
    capturedAt: "2026-08-28T08:23:00+05:30",
    creditPaise: 4000,
    commissionPaise: 0,
    commissionCleared: false,
  },
  {
    id: "MH-PUN-KOT-LEAD-0441-B",
    site: "Sai Residency, Kothrud",
    zone: "KOT",
    status: "sales",
    capturedAt: "2026-08-27T10:12:00+05:30",
    creditPaise: 4000,
    commissionPaise: 400000,
    commissionCleared: false,
  },
  {
    id: "MH-PUN-KOT-LEAD-0432-P",
    site: "Ganesh Plaza, Kothrud",
    zone: "KOT",
    status: "won",
    capturedAt: "2026-08-24T09:05:00+05:30",
    creditPaise: 4000,
    commissionPaise: 400000,
    commissionCleared: true,
  },
  {
    id: "MH-PUN-KOT-LEAD-0428-X",
    site: "Anand Apartments, Kothrud",
    zone: "KOT",
    status: "lost",
    capturedAt: "2026-08-22T16:40:00+05:30",
    creditPaise: 1000,
    commissionPaise: 0,
    commissionCleared: false,
  },
];

export const LEAD_EVIDENCE: EvidenceItem[] = [
  { id: "MH-PUN-KOT-EVID-0891-R", label: "Shaft opening", status: "passed" },
  { id: "MH-PUN-KOT-EVID-0892-T", label: "Full building", status: "passed" },
  { id: "MH-PUN-KOT-EVID-0893-M", label: "Site board", status: "passed" },
];

export const LEAD_TIMELINE: TimelineEntry[] = [
  {
    id: "MH-PUN-KOT-LEAD-0441-B",
    label: "Captured by rider RIDR-0044",
    at: "2026-08-27T10:12:00+05:30",
    actor: "Ravi",
    icon: "camera",
  },
  {
    id: "MH-PUN-KOT-EVID-0884-Q",
    label: "Three photos verified, duplicate check clean",
    at: "2026-08-27T10:12:20+05:30",
    icon: "check-circle",
    tone: "success",
  },
  {
    id: "MH-PUN-KOT-WLET-0902-D",
    label: "Capture credit landed, pending verification",
    at: "2026-08-27T10:12:22+05:30",
    icon: "credit-card",
    tone: "success",
  },
  {
    id: "MH-PUN-KOT-CHAT-0311-K",
    label: "WhatsApp sent, carrying the photos from this site",
    at: "2026-08-27T10:13:00+05:30",
    icon: "message-circle",
  },
  {
    id: "MH-PUN-KOT-QUOT-0233-M",
    label: "Quotation generated, margin 22.4 percent",
    at: "2026-08-27T10:21:00+05:30",
    icon: "file-text",
  },
];

export interface ZoneCoverage {
  code: string;
  name: string;
  coveredKm2: number;
  targetKm2: number;
  leads: number;
  lastVisitedAt: string;
  opportunity: number;
}

export const RIDER_ZONES: ZoneCoverage[] = [
  { code: "KOT", name: "Kothrud", coveredKm2: 6.2, targetKm2: 8.0, leads: 8, lastVisitedAt: "2026-08-28T08:00:00+05:30", opportunity: 0.9 },
  { code: "BAN", name: "Baner", coveredKm2: 2.1, targetKm2: 7.4, leads: 2, lastVisitedAt: "2026-08-25T09:30:00+05:30", opportunity: 0.95 },
  { code: "WAK", name: "Wakad", coveredKm2: 0.0, targetKm2: 6.8, leads: 0, lastVisitedAt: "2026-08-14T08:10:00+05:30", opportunity: 0.7 },
  { code: "HAD", name: "Hadapsar", coveredKm2: 4.4, targetKm2: 9.1, leads: 5, lastVisitedAt: "2026-08-26T11:00:00+05:30", opportunity: 0.4 },
];

export interface LedgerEntry {
  id: string;
  label: string;
  paise: number;
  cleared: boolean;
  at: string;
  /** The evidence that earned it. Every rupee taps through to its proof. */
  evidenceId?: string;
  settingsKey: string;
}

export const RIDER_LEDGER: LedgerEntry[] = [
  {
    id: "MH-PUN-KOT-WLET-0918-M",
    label: "Lead capture, Kothrud",
    paise: 4000,
    cleared: false,
    at: "2026-08-28T08:23:22+05:30",
    evidenceId: "MH-PUN-KOT-EVID-0891-R",
    settingsKey: "lead.capture.credit",
  },
  {
    id: "MH-PUN-KOT-WLET-0917-C",
    label: "Break logged",
    paise: 3000,
    cleared: true,
    at: "2026-08-28T12:04:00+05:30",
    settingsKey: "rider.break.credit",
  },
  {
    id: "MH-PUN-KOT-WLET-0916-A",
    label: "Photo unclear, reduced credit",
    paise: 1000,
    cleared: false,
    at: "2026-08-28T07:58:00+05:30",
    evidenceId: "MH-PUN-KOT-EVID-0888-B",
    settingsKey: "lead.capture.credit.reduced",
  },
];

export interface ScheduledTask {
  id: string;
  label: string;
  zone: string;
  at: string;
  distanceMetres: number;
  estimateMinutes: number;
  paise: number;
  state: "done" | "now" | "upcoming" | "late";
}

export const RIDER_SCHEDULE: ScheduledTask[] = [
  { id: "TASK-0801", label: "Start ride, Kothrud", zone: "KOT", at: "2026-08-28T08:00:00+05:30", distanceMetres: 0, estimateMinutes: 5, paise: 0, state: "done" },
  { id: "TASK-0802", label: "Sweep hot zone, Survey 42", zone: "KOT", at: "2026-08-28T09:40:00+05:30", distanceMetres: 1200, estimateMinutes: 40, paise: 4000, state: "now" },
  { id: "TASK-0803", label: "Break, logged automatically", zone: "KOT", at: "2026-08-28T12:00:00+05:30", distanceMetres: 0, estimateMinutes: 30, paise: 3000, state: "upcoming" },
  { id: "TASK-0804", label: "Cross to Baner, 3 hot zones", zone: "BAN", at: "2026-08-28T14:00:00+05:30", distanceMetres: 7400, estimateMinutes: 90, paise: 12000, state: "upcoming" },
];

export interface SopStep {
  index: number;
  title: string;
  valuePaise: number;
  state: "verified" | "active" | "locked";
  kit?: string;
  safety?: boolean;
  verifiedAt?: string;
}

/** The 24-step installation sequence. Safety steps are never time-bonused. */
export const SOP_TREE: SopStep[] = [
  { index: 1, title: "Site handover and barricading", valuePaise: 120000, state: "verified", safety: true, verifiedAt: "2026-08-19T09:10:00+05:30" },
  { index: 2, title: "Shaft cleaning and marking", valuePaise: 140000, state: "verified", verifiedAt: "2026-08-19T14:20:00+05:30" },
  { index: 3, title: "Plumb line and template set", valuePaise: 180000, state: "verified", verifiedAt: "2026-08-20T11:00:00+05:30" },
  { index: 4, title: "Bracket row 1 and 2", valuePaise: 240000, state: "verified", kit: "KIT-A", verifiedAt: "2026-08-21T10:30:00+05:30" },
  { index: 5, title: "Bracket row 3 and alignment", valuePaise: 240000, state: "verified", kit: "KIT-A", verifiedAt: "2026-08-28T11:04:00+05:30" },
  { index: 6, title: "Guide rail alignment", valuePaise: 280000, state: "active", kit: "KIT-B" },
  { index: 7, title: "Fishplate and joint torque", valuePaise: 220000, state: "locked", kit: "KIT-B" },
  { index: 8, title: "Counterweight guide set", valuePaise: 260000, state: "locked" },
  { index: 9, title: "Machine mounting", valuePaise: 320000, state: "locked", kit: "KIT-C" },
  { index: 10, title: "Machine alignment and grouting", valuePaise: 300000, state: "locked" },
  { index: 11, title: "Governor mounting", valuePaise: 200000, state: "locked", safety: true },
  { index: 12, title: "Control panel and wiring", valuePaise: 340000, state: "locked", kit: "KIT-D" },
  { index: 13, title: "Shaft wiring and terminations", valuePaise: 280000, state: "locked", kit: "KIT-D" },
  { index: 14, title: "Travelling cable", valuePaise: 180000, state: "locked" },
  { index: 15, title: "Car frame assembly", valuePaise: 360000, state: "locked", kit: "KIT-E" },
  { index: 16, title: "Cabin panels and flooring", valuePaise: 300000, state: "locked", kit: "KIT-E" },
  { index: 17, title: "Car top and apron", valuePaise: 200000, state: "locked", safety: true },
  { index: 18, title: "Landing doors, all floors", valuePaise: 420000, state: "locked", kit: "KIT-F" },
  { index: 19, title: "Door operator and sills", valuePaise: 260000, state: "locked" },
  { index: 20, title: "Roping and balancing", valuePaise: 320000, state: "locked" },
  { index: 21, title: "Safety gear and ARD", valuePaise: 300000, state: "locked", kit: "KIT-G", safety: true },
  { index: 22, title: "Buffer and pit equipment", valuePaise: 180000, state: "locked", safety: true },
  { index: 23, title: "Trims and finishing", valuePaise: 160000, state: "locked", kit: "KIT-H" },
  { index: 24, title: "Commissioning and trial runs", valuePaise: 400000, state: "locked", safety: true },
];

export interface MaterialKit {
  id: string;
  code: string;
  contents: string;
  unlocksAtStep: number;
  state: "sealed" | "open" | "consumed";
}

export const TECHNICIAN_KITS: MaterialKit[] = [
  { id: "MH-PUN-KOT-KITB-0301-A", code: "KIT-A", contents: "Guide rail brackets, fasteners, shims", unlocksAtStep: 4, state: "consumed" },
  { id: "MH-PUN-KOT-KITB-0302-B", code: "KIT-B", contents: "Guide rails, fishplates", unlocksAtStep: 6, state: "open" },
  { id: "MH-PUN-KOT-KITB-0303-C", code: "KIT-C", contents: "Machine mounting hardware", unlocksAtStep: 9, state: "sealed" },
  { id: "MH-PUN-KOT-KITB-0304-D", code: "KIT-D", contents: "Control panel, wiring harness, exact cable length", unlocksAtStep: 12, state: "sealed" },
  { id: "MH-PUN-KOT-KITB-0305-E", code: "KIT-E", contents: "Car frame, cabin panels", unlocksAtStep: 15, state: "sealed" },
  { id: "MH-PUN-KOT-KITB-0306-F", code: "KIT-F", contents: "Landing doors, individually sealed per floor", unlocksAtStep: 18, state: "sealed" },
  { id: "MH-PUN-KOT-KITB-0307-G", code: "KIT-G", contents: "Safety gear, governor, ARD", unlocksAtStep: 21, state: "sealed" },
  { id: "MH-PUN-KOT-KITB-0308-H", code: "KIT-H", contents: "Trims, finishing, commissioning consumables", unlocksAtStep: 23, state: "sealed" },
];

export interface QcCheckItem {
  id: string;
  group: string;
  label: string;
  verdict: "pass" | "fail" | "conditional" | "pending";
  note?: string;
}

export const QC_SHAFT_CHECKLIST: QcCheckItem[] = [
  { id: "Q2-01", group: "Dimensions", label: "Shaft width at 3 heights", verdict: "pass" },
  { id: "Q2-02", group: "Dimensions", label: "Shaft depth at 3 heights", verdict: "pass" },
  { id: "Q2-03", group: "Dimensions", label: "Plumb across full height", verdict: "conditional", note: "4 mm out at level 3, within tolerance but noted" },
  { id: "Q2-04", group: "Dimensions", label: "Diagonal check", verdict: "pass" },
  { id: "Q2-05", group: "Pit", label: "Pit depth", verdict: "pass" },
  { id: "Q2-06", group: "Pit", label: "Waterproofing", verdict: "fail", note: "Seepage on the north wall, rework required" },
  { id: "Q2-07", group: "Pit", label: "Drainage", verdict: "pass" },
  { id: "Q2-08", group: "Pit", label: "Cleanliness", verdict: "pass" },
  { id: "Q2-09", group: "Headroom", label: "Clear height", verdict: "pass" },
  { id: "Q2-10", group: "Headroom", label: "Obstructions", verdict: "pass" },
  { id: "Q2-11", group: "Machine room", label: "Space and access", verdict: "pass" },
  { id: "Q2-12", group: "Machine room", label: "Ventilation", verdict: "pending" },
  { id: "Q2-13", group: "Electrical", label: "Three-phase supply", verdict: "pending" },
  { id: "Q2-14", group: "Electrical", label: "Earthing and DB rating", verdict: "pending" },
  { id: "Q2-15", group: "Openings", label: "Landing door sizes, every floor", verdict: "pending" },
  { id: "Q2-16", group: "Safety", label: "Barricading and scaffold", verdict: "pending" },
  { id: "Q2-17", group: "Site", label: "Container approach", verdict: "pending" },
  { id: "Q2-18", group: "Site", label: "Storage, water, light", verdict: "pending" },
];

export const QC_QUEUE = [
  { id: "MH-PUN-KOT-QCIN-0181-F", site: "Shreeji Heights, Kothrud", kind: "clearance" as const, distanceMetres: 3100, minutes: 45, paise: 45000, unannounced: false },
  { id: "MH-PUN-BAN-QCIN-0182-K", site: "Trident Towers, Baner", kind: "surprise" as const, distanceMetres: 8600, minutes: 70, paise: 80000, unannounced: true },
  { id: "MH-PUN-HAD-QCIN-0183-R", site: "Gera Greens, Hadapsar", kind: "clearance" as const, distanceMetres: 12400, minutes: 45, paise: 45000, unannounced: false },
];

export const CUSTOMER_SHAFT_ITEMS = [
  { id: "C3-01", label: "Shaft walls plastered and true", verdict: "pass" as const },
  { id: "C3-02", label: "Pit dug to depth, waterproofed", verdict: "fail" as const, note: "Seepage found at QC visit, rework needed" },
  { id: "C3-03", label: "Headroom clear of obstructions", verdict: "pass" as const },
  { id: "C3-04", label: "Machine room ventilated", verdict: "pending" as const },
  { id: "C3-05", label: "Three-phase supply at site", verdict: "pending" as const },
  { id: "C3-06", label: "Landing openings at every floor", verdict: "pending" as const },
];

export const CUSTOMER_PAYMENTS = [
  { id: "MH-PUN-KOT-PAYT-0501-A", label: "Token", paise: 1000000, paidAt: "2026-08-05T12:04:00+05:30", state: "paid" as const },
  { id: "MH-PUN-KOT-PAYT-0502-B", label: "On container arrival, 90 percent", paise: 55350000, paidAt: null, state: "due" as const },
  { id: "MH-PUN-KOT-PAYT-0503-C", label: "Final, on handover", paise: 6150000, paidAt: null, state: "locked" as const },
];

export const CUSTOMER_PROGRESS_DAYS = [
  { day: 9, date: "2026-08-28T18:00:00+05:30", step: 6, title: "Guide rail alignment", photos: 4, state: "active" as const },
  { day: 8, date: "2026-08-27T18:00:00+05:30", step: 5, title: "Bracket row 3", photos: 5, state: "done" as const },
  { day: 7, date: "2026-08-26T18:00:00+05:30", step: 4, title: "Bracket rows 1 and 2", photos: 6, state: "done" as const },
  { day: 6, date: "2026-08-25T18:00:00+05:30", step: 3, title: "Plumb line and template", photos: 4, state: "done" as const },
];

export interface QcReport {
  id: string;
  site: string;
  at: string;
  cleared: boolean;
}

export const QC_REPORTS: QcReport[] = [
  { id: "MH-PUN-KOT-QCIN-0178-D", site: "Ganesh Plaza, Kothrud", at: "2026-08-24T15:20:00+05:30", cleared: true },
  { id: "MH-PUN-BAN-QCIN-0176-S", site: "Trident Towers, Baner", at: "2026-08-22T11:05:00+05:30", cleared: false },
  { id: "MH-PUN-HAD-QCIN-0174-N", site: "Gera Greens, Hadapsar", at: "2026-08-20T09:40:00+05:30", cleared: true },
];
