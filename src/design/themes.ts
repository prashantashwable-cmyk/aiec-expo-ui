export const ROLES = [
  "rider",
  "sales",
  "customer",
  "qc",
  "supplier",
  "technician",
  "onboarding",
  "admin",
  "owner",
] as const;

export type Role = (typeof ROLES)[number];

export const THEME_NAMES = [
  "sunlight",
  "slate",
  "premium",
  "command",
  "commandLight",
  "executive",
] as const;

export type ThemeName = (typeof THEME_NAMES)[number];

export type Language = "en" | "mr" | "hi";

export type Density = "roomy" | "standard" | "dense";

export interface ThemeSpec {
  name: ThemeName;
  className: string;
  density: Density;
  /** Primary action height in px. Law 7 / gloved-precision research. */
  controlHeight: number;
  /** Secondary action height in px. */
  controlHeightSm: number;
  /** Minimum body text size in px. Never render user-facing text below this. */
  textMin: number;
  textBase: number;
  textLarge: number;
  /** Hero numerals — owner reads these standing, in 10 seconds. */
  textDisplay: number;
  radius: number;
  /** Headings use the serif face. Premium only — this is the brand. */
  serifHeadings: boolean;
  /** Law 9: no critical control within this many px of any screen edge. */
  edgeGuard: number;
}

export const THEMES: Record<ThemeName, ThemeSpec> = {
  sunlight: {
    name: "sunlight",
    className: "theme-sunlight",
    density: "roomy",
    controlHeight: 72,
    controlHeightSm: 56,
    textMin: 18,
    textBase: 22,
    textLarge: 28,
    textDisplay: 40,
    radius: 12,
    serifHeadings: false,
    edgeGuard: 12,
  },
  slate: {
    name: "slate",
    className: "theme-slate",
    density: "standard",
    controlHeight: 56,
    controlHeightSm: 48,
    textMin: 14,
    textBase: 17,
    textLarge: 22,
    textDisplay: 32,
    radius: 10,
    serifHeadings: false,
    edgeGuard: 12,
  },
  premium: {
    name: "premium",
    className: "theme-premium",
    density: "roomy",
    controlHeight: 52,
    controlHeightSm: 44,
    textMin: 13,
    textBase: 16,
    textLarge: 24,
    textDisplay: 36,
    radius: 12,
    serifHeadings: true,
    edgeGuard: 8,
  },
  command: {
    name: "command",
    className: "theme-command",
    density: "dense",
    controlHeight: 32,
    controlHeightSm: 28,
    textMin: 11,
    textBase: 13,
    textLarge: 16,
    textDisplay: 24,
    radius: 6,
    serifHeadings: false,
    edgeGuard: 8,
  },
  commandLight: {
    name: "commandLight",
    className: "theme-command-light",
    density: "dense",
    controlHeight: 32,
    controlHeightSm: 28,
    textMin: 11,
    textBase: 13,
    textLarge: 16,
    textDisplay: 24,
    radius: 6,
    serifHeadings: false,
    edgeGuard: 8,
  },
  executive: {
    name: "executive",
    className: "theme-executive",
    density: "standard",
    controlHeight: 48,
    controlHeightSm: 40,
    textMin: 13,
    textBase: 16,
    textLarge: 22,
    textDisplay: 52,
    radius: 10,
    serifHeadings: false,
    edgeGuard: 8,
  },
};

/** Law 7 — theme is a property of the role, not a user preference. */
export const ROLE_THEME: Record<Role, ThemeName> = {
  rider: "sunlight",
  technician: "slate",
  qc: "slate",
  customer: "premium",
  // Sunlight, aspirational variant: a job-seeker on a cheap phone, outdoors.
  onboarding: "sunlight",
  // The manual gives sales and supplier a light Command variant: both work at
  // a desk under office lighting, not in a darkened control room.
  sales: "commandLight",
  supplier: "commandLight",
  admin: "command",
  owner: "executive",
};

/** Law 6 — defaults by role. All overridable; the switch is never buried. */
export const ROLE_DEFAULT_LANGUAGE: Record<Role, Language> = {
  rider: "mr",
  technician: "mr",
  qc: "mr",
  onboarding: "mr",
  customer: "en",
  sales: "en",
  supplier: "en",
  admin: "en",
  owner: "en",
};

/**
 * Law 2 — the map legend is universal. These do NOT re-point per theme:
 * a red pin means the same thing to the rider and to the owner.
 */
export const MAP_LEGEND = [
  "new",
  "sales",
  "won",
  "transit",
  "installing",
  "complete",
  "blocked",
  "lost",
] as const;

export type MapStatus = (typeof MAP_LEGEND)[number];
