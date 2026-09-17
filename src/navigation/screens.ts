import type { Feather } from "@expo/vector-icons";

import type { Role } from "@/design/themes";
import type { TranslationKey } from "@/i18n";

export type IconName = keyof typeof Feather.glyphMap;

export interface ScreenNode {
  /** The manual's own screen id: R1, T2, C6, Q3. */
  id: string;
  labelKey: TranslationKey;
  /** Short form for the bottom bar. Full titles truncate at five tabs. */
  tabLabelKey?: TranslationKey;
  icon: IconName;
  href: string;
  /** Shown in the role's bottom navigation. Max five per role. */
  primary?: boolean;
  /** Layer 3 — the detail screens beneath this one. */
  children?: ScreenNode[];
}

/**
 * The three-layer screen tree, as data.
 *
 * Layer 1 is the role's map home. Layer 2 is the manual's screen inventory for
 * that role. Layer 3 is the detail beneath each — the lead, the step, the
 * receipt, the ledger line and the evidence behind it.
 *
 * Holding it as data rather than scattering it across route files means the
 * bottom navigation, the coverage view and the routes cannot drift apart.
 */
export const ROLE_SCREENS: Partial<Record<Role, ScreenNode[]>> = {
  rider: [
    { id: "R1", labelKey: "screens.rideMap", tabLabelKey: "tabs.map", icon: "map", href: "/rider", primary: true },
    {
      id: "R3",
      labelKey: "screens.myLeads",
      tabLabelKey: "tabs.leads",
      icon: "list",
      href: "/rider/leads",
      primary: true,
      children: [
        { id: "R3.1", labelKey: "screens.leadDetail", icon: "map-pin", href: "/rider/leads/[id]" },
      ],
    },
    {
      id: "R5",
      labelKey: "screens.earnings",
      tabLabelKey: "tabs.earnings",
      icon: "credit-card",
      href: "/rider/earnings",
      primary: true,
      children: [
        { id: "R5.1", labelKey: "screens.ledgerEntry", icon: "file-text", href: "/rider/earnings/[id]" },
      ],
    },
    {
      id: "R4",
      labelKey: "screens.coverage",
      icon: "activity",
      href: "/rider/coverage",
      children: [
        { id: "R4.1", labelKey: "screens.zoneDetail", icon: "grid", href: "/rider/coverage/[zone]" },
      ],
    },
    {
      id: "R7",
      labelKey: "screens.schedule",
      tabLabelKey: "tabs.schedule",
      icon: "clock",
      href: "/rider/schedule",
      primary: true,
      children: [
        { id: "R7.1", labelKey: "screens.taskDetail", icon: "check-circle", href: "/rider/schedule/[id]" },
      ],
    },
    { id: "R6", labelKey: "screens.leaderboard", icon: "award", href: "/rider/leaderboard" },
    { id: "R2", labelKey: "screens.capture", icon: "camera", href: "/rider/capture" },
  ],

  technician: [
    { id: "T1", labelKey: "screens.jobMap", tabLabelKey: "tabs.job", icon: "map", href: "/technician/jobs", primary: true },
    { id: "T2", labelKey: "screens.todayStep", tabLabelKey: "tabs.step", icon: "check-square", href: "/technician", primary: true },
    {
      id: "T3",
      labelKey: "screens.sopTree",
      tabLabelKey: "tabs.sop",
      icon: "layers",
      href: "/technician/sop",
      primary: true,
      children: [
        { id: "T3.1", labelKey: "screens.stepDetail", icon: "chevron-right", href: "/technician/sop/[step]" },
      ],
    },
    {
      id: "T5",
      labelKey: "screens.materials",
      tabLabelKey: "tabs.materials",
      icon: "package",
      href: "/technician/materials",
      primary: true,
      children: [
        { id: "T5.1", labelKey: "screens.kitDetail", icon: "box", href: "/technician/materials/[kit]" },
      ],
    },
    {
      id: "T6",
      labelKey: "screens.moneyMeter",
      tabLabelKey: "tabs.money",
      icon: "credit-card",
      href: "/technician/money",
      primary: true,
      children: [
        { id: "T6.1", labelKey: "screens.ledgerEntry", icon: "file-text", href: "/technician/money/[id]" },
      ],
    },
    {
      id: "T8",
      labelKey: "screens.training",
      icon: "book-open",
      href: "/technician/training",
      children: [
        { id: "T8.1", labelKey: "screens.trainingModule", icon: "play-circle", href: "/technician/training/[id]" },
      ],
    },
  ],

  customer: [
    { id: "C1", labelKey: "screens.myLift", tabLabelKey: "tabs.lift", icon: "home", href: "/customer", primary: true },
    {
      id: "C3",
      labelKey: "screens.shaftSop",
      tabLabelKey: "tabs.shaft",
      icon: "check-square",
      href: "/customer/shaft",
      primary: true,
      children: [
        { id: "C3.1", labelKey: "screens.sopItem", icon: "chevron-right", href: "/customer/shaft/[id]" },
      ],
    },
    {
      id: "C5",
      labelKey: "screens.payments",
      tabLabelKey: "tabs.payments",
      icon: "credit-card",
      href: "/customer/payments",
      primary: true,
      children: [
        { id: "C5.1", labelKey: "screens.receipt", icon: "file-text", href: "/customer/payments/[id]" },
      ],
    },
    {
      id: "C7",
      labelKey: "screens.installProgress",
      tabLabelKey: "tabs.progress",
      icon: "image",
      href: "/customer/progress",
      primary: true,
      children: [
        { id: "C7.1", labelKey: "screens.dayDetail", icon: "calendar", href: "/customer/progress/[day]" },
      ],
    },
    { id: "C6", labelKey: "screens.liveContainer", tabLabelKey: "tabs.container", icon: "truck", href: "/customer/container", primary: true },
    { id: "C8", labelKey: "screens.handoverNoc", icon: "award", href: "/customer/handover" },
  ],

  qc: [
    { id: "Q1", labelKey: "screens.inspectionMap", tabLabelKey: "tabs.inspections", icon: "map", href: "/qc", primary: true },
    {
      id: "Q2",
      labelKey: "screens.shaftChecklist",
      tabLabelKey: "tabs.clearance",
      icon: "check-square",
      href: "/qc/clearance",
      primary: true,
      children: [
        { id: "Q2.1", labelKey: "screens.checklistItem", icon: "camera", href: "/qc/clearance/[item]" },
      ],
    },
    { id: "Q4", labelKey: "screens.surpriseQueue", tabLabelKey: "tabs.surprise", icon: "shuffle", href: "/qc/surprise", primary: true },
    {
      id: "Q5",
      labelKey: "screens.reportBuilder",
      tabLabelKey: "tabs.reports",
      icon: "file-text",
      href: "/qc/reports",
      primary: true,
      children: [
        { id: "Q5.1", labelKey: "screens.reportDetail", icon: "chevron-right", href: "/qc/reports/[id]" },
      ],
    },
    { id: "Q6", labelKey: "screens.earningsRating", tabLabelKey: "tabs.earnings", icon: "credit-card", href: "/qc/earnings", primary: true },
  ],

  admin: [
    { id: "A1", labelKey: "screens.cityMap", tabLabelKey: "tabs.map", icon: "map", href: "/admin", primary: true },
    {
      id: "A2",
      labelKey: "screens.alertQueue",
      tabLabelKey: "tabs.alerts",
      icon: "alert-circle",
      href: "/admin/alerts",
      primary: true,
      children: [
        { id: "A2.1", labelKey: "screens.alertDetail", icon: "chevron-right", href: "/admin/alerts/[id]" },
      ],
    },
    {
      id: "A4",
      labelKey: "screens.approvalDesk",
      tabLabelKey: "tabs.approvals",
      icon: "check-square",
      href: "/admin/approvals",
      primary: true,
      children: [
        { id: "A4.1", labelKey: "screens.approvalDetail", icon: "chevron-right", href: "/admin/approvals/[id]" },
      ],
    },
    { id: "A5", labelKey: "screens.moneyControl", tabLabelKey: "tabs.control", icon: "credit-card", href: "/admin/money", primary: true },
    {
      id: "A7",
      labelKey: "screens.sopConfig",
      tabLabelKey: "tabs.config",
      icon: "sliders",
      href: "/admin/config",
      primary: true,
      children: [
        { id: "A7.1", labelKey: "screens.settingDetail", icon: "chevron-right", href: "/admin/config/[key]" },
      ],
    },
    { id: "A9", labelKey: "screens.auditLog", tabLabelKey: "tabs.audit", icon: "list", href: "/admin/audit" },
  ],

  sales: [
    { id: "S1", labelKey: "screens.pipelineMap", tabLabelKey: "tabs.pipeline", icon: "map", href: "/sales", primary: true },
    {
      id: "S2",
      labelKey: "screens.leadCard",
      tabLabelKey: "tabs.leads",
      icon: "user",
      href: "/sales/leads",
      primary: true,
      children: [
        { id: "S2.1", labelKey: "screens.quotationVersion", icon: "file-text", href: "/sales/leads/[id]" },
      ],
    },
    { id: "S3", labelKey: "screens.botConsole", tabLabelKey: "tabs.bots", icon: "message-circle", href: "/sales/bots", primary: true },
    { id: "S4", labelKey: "screens.manualDesk", tabLabelKey: "tabs.desk", icon: "headphones", href: "/sales/desk", primary: true },
    { id: "S5", labelKey: "screens.quoteBuilder", tabLabelKey: "tabs.quotes", icon: "sliders", href: "/sales/quotes", primary: true },
  ],

  supplier: [
    {
      id: "P1",
      labelKey: "screens.orderBoard",
      tabLabelKey: "tabs.orders",
      icon: "clipboard",
      href: "/supplier",
      primary: true,
      children: [
        { id: "P1.1", labelKey: "screens.orderDetail", icon: "chevron-right", href: "/supplier/orders/[id]" },
      ],
    },
    { id: "P2", labelKey: "screens.kitPacking", tabLabelKey: "tabs.packing", icon: "package", href: "/supplier/packing", primary: true },
    { id: "P3", labelKey: "screens.containerLoading", tabLabelKey: "tabs.loading", icon: "box", href: "/supplier/loading", primary: true },
    { id: "P4", labelKey: "screens.fleetMap", tabLabelKey: "tabs.fleet", icon: "truck", href: "/supplier/fleet", primary: true },
    { id: "P6", labelKey: "screens.performance", tabLabelKey: "tabs.rating", icon: "star", href: "/supplier/performance", primary: true },
  ],

  onboarding: [
    { id: "B1", labelKey: "screens.hook", tabLabelKey: "tabs.earn", icon: "trending-up", href: "/onboarding", primary: true },
    { id: "B2", labelKey: "screens.filter", tabLabelKey: "tabs.check", icon: "check-square", href: "/onboarding/check", primary: true },
    { id: "B3", labelKey: "screens.kyc", tabLabelKey: "tabs.details", icon: "user", href: "/onboarding/details", primary: true },
    { id: "B4", labelKey: "screens.training", tabLabelKey: "tabs.train", icon: "book-open", href: "/onboarding/training", primary: true },
    { id: "B5", labelKey: "screens.firstJob", tabLabelKey: "tabs.start", icon: "play-circle", href: "/onboarding/first-job", primary: true },
  ],
};

export function primaryScreens(role: Role): ScreenNode[] {
  return (ROLE_SCREENS[role] ?? []).filter((s) => s.primary).slice(0, 5);
}
