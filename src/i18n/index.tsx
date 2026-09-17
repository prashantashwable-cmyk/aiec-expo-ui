import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { CATALOGUES, type Catalogue } from "./catalogues";
import {
  formatCount,
  formatDate,
  formatDistance,
  formatPaise,
  formatPaiseCompact,
  formatPercent,
  formatTime,
} from "./format";
import type { Language } from "../design/themes";

/** Every leaf path in the catalogue, e.g. "rider.captureLead". */
type DotPaths<T> = {
  [K in keyof T & string]: T[K] extends string ? K : `${K}.${DotPaths<T[K]>}`;
}[keyof T & string];

export type TranslationKey = DotPaths<Catalogue>;

export type Interpolations = Record<string, string | number>;

function lookup(catalogue: Catalogue, key: string): string {
  const value = key
    .split(".")
    .reduce<unknown>(
      (acc, part) => (acc as Record<string, unknown> | undefined)?.[part],
      catalogue,
    );

  if (typeof value !== "string") {
    throw new Error(`No string at translation key "${key}".`);
  }
  return value;
}

function interpolate(template: string, values?: Interpolations): string {
  if (!values) return template;
  return template.replace(/\{\{(\w+)\}\}/g, (_match, name: string) => {
    const value = values[name];
    if (value === undefined) {
      throw new Error(
        `Missing interpolation "${name}" while rendering "${template}".`,
      );
    }
    return String(value);
  });
}

interface I18nContextValue {
  language: Language;
  setLanguage: (language: Language) => void;
  /**
   * Applies a role's default language, but only while the user has not made
   * a choice of their own. An explicit switch always outranks a role default.
   */
  applyRoleDefault: (language: Language) => void;
  t: (key: TranslationKey, values?: Interpolations) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

interface I18nProviderProps {
  initialLanguage: Language;
  children: ReactNode;
}

/**
 * Law 6 — three languages, everywhere, instantly.
 *
 * Switching swaps a context value and nothing remounts, so form data survives
 * the switch. That is a requirement, not an implementation detail: a rider
 * halfway through a capture must be able to change language without losing it.
 */
export function I18nProvider({ initialLanguage, children }: I18nProviderProps) {
  const [language, setLanguageState] = useState<Language>(initialLanguage);
  const chosenByUser = useRef(false);

  const setLanguage = useCallback((next: Language) => {
    chosenByUser.current = true;
    setLanguageState(next);
  }, []);

  const applyRoleDefault = useCallback((next: Language) => {
    if (!chosenByUser.current) setLanguageState(next);
  }, []);

  const t = useCallback(
    (key: TranslationKey, values?: Interpolations) =>
      interpolate(lookup(CATALOGUES[language], key), values),
    [language],
  );

  const value = useMemo<I18nContextValue>(
    () => ({ language, setLanguage, applyRoleDefault, t }),
    [language, setLanguage, applyRoleDefault, t],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n() was called outside an I18nProvider.");
  }
  return ctx;
}

/** Shorthand for the common case. */
export function useT() {
  return useI18n().t;
}

/**
 * Formatters bound to the active language. Components never call Intl
 * directly — Indian grouping is a shared-layer concern, never per-component.
 */
export function useFormat() {
  const { language } = useI18n();

  return useMemo(
    () => ({
      paise: (paise: number) => formatPaise(paise, language),
      paiseCompact: (paise: number) => formatPaiseCompact(paise, language),
      count: (value: number) => formatCount(value, language),
      percent: (value: number, digits?: number) =>
        formatPercent(value, language, digits),
      distance: (metres: number) => formatDistance(metres, language),
      time: (serverIso: string) => formatTime(serverIso, language),
      date: (serverIso: string) => formatDate(serverIso, language),
    }),
    [language],
  );
}

export { CATALOGUES };
export type { Catalogue };

/**
 * Applies the role's default language on entry. Rider and technician default
 * to Marathi, customer and the desk roles to English — all overridable, and
 * an override survives moving between roles.
 */
export function RoleLanguageDefault({ language }: { language: Language }) {
  const { applyRoleDefault } = useI18n();
  useEffect(() => {
    applyRoleDefault(language);
  }, [applyRoleDefault, language]);
  return null;
}
