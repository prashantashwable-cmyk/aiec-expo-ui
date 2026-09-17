import type { ThemeName } from "./themes";

/**
 * Tier 2 — semantic tokens, per theme.
 *
 * Tier 1 primitives are the raw triplets below; tier 3 (component tokens) live
 * in the components themselves as Tailwind classes referencing these names.
 * Only this layer re-points between themes. Component code never sees a hex.
 *
 * Values are space-separated RGB channels so Tailwind can apply alpha:
 * `rgb(var(--primary) / <alpha-value>)`.
 */
export type SemanticTokens = {
  "--background": string;
  "--surface": string;
  "--surface-raised": string;
  "--foreground": string;
  "--muted-foreground": string;
  "--subtle-foreground": string;
  "--border": string;
  "--border-strong": string;
  "--primary": string;
  "--primary-foreground": string;
  "--accent": string;
  "--accent-foreground": string;
  "--success": string;
  "--success-foreground": string;
  "--warning": string;
  "--warning-foreground": string;
  "--danger": string;
  "--danger-foreground": string;
  "--gate": string;
  "--gate-foreground": string;
  "--gate-surface": string;
};

export const PALETTES: Record<ThemeName, SemanticTokens> = {
  sunlight: {
    "--background": "255 255 255",
    "--surface": "247 245 240",
    "--surface-raised": "255 255 255",
    "--foreground": "20 20 15",
    "--muted-foreground": "85 83 76",
    "--subtle-foreground": "130 128 122",
    "--border": "216 212 200",
    "--border-strong": "181 176 161",
    "--primary": "194 65 12",
    "--primary-foreground": "255 255 255",
    "--accent": "234 88 12",
    "--accent-foreground": "255 255 255",
    "--success": "18 128 92",
    "--success-foreground": "255 255 255",
    "--warning": "180 83 9",
    "--warning-foreground": "255 255 255",
    "--danger": "192 39 26",
    "--danger-foreground": "255 255 255",
    "--gate": "180 83 9",
    "--gate-foreground": "255 255 255",
    "--gate-surface": "254 243 226",
  },
  slate: {
    "--background": "18 20 19",
    "--surface": "28 32 31",
    "--surface-raised": "38 43 42",
    "--foreground": "234 240 238",
    "--muted-foreground": "147 160 156",
    "--subtle-foreground": "107 120 115",
    "--border": "51 59 57",
    "--border-strong": "74 84 81",
    "--primary": "34 211 170",
    "--primary-foreground": "4 35 28",
    "--accent": "34 211 170",
    "--accent-foreground": "4 35 28",
    "--success": "52 211 153",
    "--success-foreground": "4 35 28",
    "--warning": "251 191 36",
    "--warning-foreground": "42 29 2",
    "--danger": "248 113 113",
    "--danger-foreground": "43 10 10",
    "--gate": "251 191 36",
    "--gate-foreground": "42 29 2",
    "--gate-surface": "58 44 8",
  },
  premium: {
    "--background": "255 255 255",
    "--surface": "250 248 243",
    "--surface-raised": "255 255 255",
    "--foreground": "26 24 20",
    "--muted-foreground": "107 101 89",
    "--subtle-foreground": "147 140 125",
    "--border": "229 223 210",
    "--border-strong": "201 192 172",
    "--primary": "154 107 30",
    "--primary-foreground": "255 255 255",
    "--accent": "192 138 46",
    "--accent-foreground": "255 255 255",
    "--success": "20 121 90",
    "--success-foreground": "255 255 255",
    "--warning": "166 106 18",
    "--warning-foreground": "255 255 255",
    "--danger": "180 69 47",
    "--danger-foreground": "255 255 255",
    "--gate": "180 69 47",
    "--gate-foreground": "255 255 255",
    "--gate-surface": "251 238 233",
  },
  command: {
    "--background": "14 17 22",
    "--surface": "22 26 33",
    "--surface-raised": "30 36 45",
    "--foreground": "230 234 240",
    "--muted-foreground": "139 148 163",
    "--subtle-foreground": "100 108 122",
    "--border": "42 49 60",
    "--border-strong": "61 70 83",
    "--primary": "59 130 246",
    "--primary-foreground": "255 255 255",
    "--accent": "96 165 250",
    "--accent-foreground": "6 18 31",
    "--success": "34 197 94",
    "--success-foreground": "4 36 15",
    "--warning": "245 158 11",
    "--warning-foreground": "41 26 2",
    "--danger": "239 68 68",
    "--danger-foreground": "255 255 255",
    "--gate": "245 158 11",
    "--gate-foreground": "41 26 2",
    "--gate-surface": "58 42 8",
  },
  commandLight: {
    "--background": "255 255 255",
    "--surface": "244 246 248",
    "--surface-raised": "255 255 255",
    "--foreground": "17 24 39",
    "--muted-foreground": "75 85 99",
    "--subtle-foreground": "107 114 128",
    "--border": "217 222 229",
    "--border-strong": "182 191 202",
    "--primary": "29 78 216",
    "--primary-foreground": "255 255 255",
    "--accent": "37 99 235",
    "--accent-foreground": "255 255 255",
    "--success": "21 128 61",
    "--success-foreground": "255 255 255",
    "--warning": "180 83 9",
    "--warning-foreground": "255 255 255",
    "--danger": "185 28 28",
    "--danger-foreground": "255 255 255",
    "--gate": "180 83 9",
    "--gate-foreground": "255 255 255",
    "--gate-surface": "254 243 226",
  },
  executive: {
    "--background": "13 15 14",
    "--surface": "23 26 25",
    "--surface-raised": "32 37 35",
    "--foreground": "240 242 240",
    "--muted-foreground": "138 146 141",
    "--subtle-foreground": "102 109 105",
    "--border": "38 43 41",
    "--border-strong": "58 64 61",
    "--primary": "132 204 22",
    "--primary-foreground": "20 32 10",
    "--accent": "163 230 53",
    "--accent-foreground": "20 32 10",
    "--success": "132 204 22",
    "--success-foreground": "20 32 10",
    "--warning": "245 158 11",
    "--warning-foreground": "41 26 2",
    "--danger": "239 68 68",
    "--danger-foreground": "255 255 255",
    "--gate": "245 158 11",
    "--gate-foreground": "41 26 2",
    "--gate-surface": "46 34 6",
  },
};

/**
 * Law 2 — universal map legend. Identical for every role: a red pin means the
 * same thing to the rider and to the owner. These never re-point per theme,
 * which is why they live in :root rather than in a palette.
 */
export const MAP_COLORS = {
  new: "rgb(156 163 175)",
  sales: "rgb(59 130 246)",
  won: "rgb(168 85 247)",
  transit: "rgb(249 115 22)",
  installing: "rgb(234 179 8)",
  complete: "rgb(34 197 94)",
  blocked: "rgb(239 68 68)",
  lost: "rgb(31 41 55)",
} as const;
