import { CATALOGUES } from "./catalogues";
import type { Language } from "../design/themes";

const BASE_LOCALE: Record<Language, string> = {
  en: "en-IN",
  mr: "mr-IN",
  hi: "hi-IN",
};

/**
 * Latin digits are forced with `-u-nu-latn`. Devanagari digits (१२३) are
 * script-correct but Indian users read money and distances in Latin digits,
 * and ICU would otherwise switch them for some locales.
 */
function localeFor(language: Language): string {
  return `${BASE_LOCALE[language]}-u-nu-latn`;
}

const cache = new Map<string, Intl.NumberFormat>();

function currency(language: Language, fractionDigits: number): Intl.NumberFormat {
  const key = `c:${language}:${fractionDigits}`;
  let f = cache.get(key);
  if (!f) {
    f = new Intl.NumberFormat(localeFor(language), {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    });
    cache.set(key, f);
  }
  return f;
}

function decimal(language: Language, fractionDigits: number): Intl.NumberFormat {
  const key = `d:${language}:${fractionDigits}`;
  let f = cache.get(key);
  if (!f) {
    f = new Intl.NumberFormat(localeFor(language), {
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: fractionDigits,
    });
    cache.set(key, f);
  }
  return f;
}

const RUPEE = 100;
const LAKH = 100_000;
const CRORE = 10_000_000;

/**
 * Renders integer paise as Indian-grouped currency: 15000000 -> "₹1,50,000".
 *
 * Immovable 2 — money is integer paise everywhere. A non-integer here means
 * a float leaked into a money path upstream, so it throws rather than rounding
 * the evidence of the bug away.
 */
export function formatPaise(paise: number, language: Language): string {
  if (!Number.isInteger(paise)) {
    throw new Error(
      `Money must be integer paise, received ${paise}. A float has leaked into a money path.`,
    );
  }
  const showFraction = paise % RUPEE !== 0;
  return currency(language, showFraction ? 2 : 0).format(paise / RUPEE);
}

/**
 * Compact Indian scale for the owner view: "₹1.42 कोटी".
 * Below a lakh it falls through to the full grouped form.
 */
export function formatPaiseCompact(paise: number, language: Language): string {
  if (!Number.isInteger(paise)) {
    throw new Error(
      `Money must be integer paise, received ${paise}. A float has leaked into a money path.`,
    );
  }
  const rupees = Math.round(paise / RUPEE);
  const magnitude = Math.abs(rupees);
  const labels = CATALOGUES[language].format;
  const sign = rupees < 0 ? "-" : "";

  if (magnitude >= CRORE) {
    return `${sign}₹${decimal(language, 2).format(Math.abs(rupees) / CRORE)} ${labels.crore}`;
  }
  if (magnitude >= LAKH) {
    return `${sign}₹${decimal(language, 2).format(Math.abs(rupees) / LAKH)} ${labels.lakh}`;
  }
  return formatPaise(paise, language);
}

/** Counts, ranks, quantities — Indian grouping, no currency symbol. */
export function formatCount(value: number, language: Language): string {
  return decimal(language, 0).format(value);
}

export function formatPercent(
  value: number,
  language: Language,
  fractionDigits = 1,
): string {
  return `${decimal(language, fractionDigits).format(value)}%`;
}

/** Under a kilometre reads in metres — a rider needs "400 मी", not "0.4 किमी". */
export function formatDistance(metres: number, language: Language): string {
  const labels = CATALOGUES[language].format;
  if (metres < 1000) {
    return `${decimal(language, 0).format(Math.round(metres))} ${labels.metres}`;
  }
  return `${decimal(language, 1).format(metres / 1000)} ${labels.kilometres}`;
}

/**
 * Server timestamps only. Immovable 3 — device time is never trusted in an
 * evidence, ledger or SLA path, so callers pass a server-issued ISO string.
 */
export function formatTime(serverIso: string, language: Language): string {
  return new Intl.DateTimeFormat(localeFor(language), {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(serverIso));
}

export function formatDate(serverIso: string, language: Language): string {
  return new Intl.DateTimeFormat(localeFor(language), {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(serverIso));
}
