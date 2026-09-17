import { getLocales } from "expo-localization";

import type { Language } from "@/design/themes";

/**
 * Law 6 — default language is auto-set by role and device locale.
 * This resolves only the device half; the role default is applied by the
 * role layout, and either can be overridden by the user at any time.
 */
export function deviceLanguage(): Language {
  const codes = getLocales().map((locale) => locale.languageCode);
  if (codes.includes("mr")) return "mr";
  if (codes.includes("hi")) return "hi";
  return "en";
}
