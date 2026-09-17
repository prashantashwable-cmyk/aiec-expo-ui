import { createContext, useContext, useMemo, type ReactNode } from "react";
import { View } from "react-native";
import { vars } from "nativewind";

import { PALETTES, type SemanticTokens } from "./palette";
import {
  ROLE_THEME,
  THEMES,
  type Role,
  type ThemeName,
  type ThemeSpec,
} from "./themes";

interface ThemeContextValue {
  /** Null before sign-in, when a theme is set but no role is known yet. */
  role: Role | null;
  theme: ThemeName;
  spec: ThemeSpec;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

interface ThemeProviderProps {
  theme: ThemeName;
  role?: Role;
  children: ReactNode;
}

/**
 * Applies a theme by writing its semantic tokens as CSS variables onto a
 * wrapper View, so every descendant resolves `bg-primary`, `text-foreground`
 * and friends against this palette. Works on native and web alike.
 */
export function ThemeProvider({ theme, role, children }: ThemeProviderProps) {
  const value = useMemo<ThemeContextValue>(
    () => ({ role: role ?? null, theme, spec: THEMES[theme] }),
    [role, theme],
  );

  const style = useMemo(() => vars(PALETTES[theme]), [theme]);

  return (
    <ThemeContext.Provider value={value}>
      <View style={style} className="flex-1 bg-background">
        {children}
      </View>
    </ThemeContext.Provider>
  );
}

/** Law 7 — the theme follows the role, not a user preference. */
export function RoleThemeProvider({
  role,
  children,
}: {
  role: Role;
  children: ReactNode;
}) {
  return (
    <ThemeProvider theme={ROLE_THEME[role]} role={role}>
      {children}
    </ThemeProvider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error(
      "useTheme() was called outside a ThemeProvider. Every screen renders under exactly one theme.",
    );
  }
  return ctx;
}

/** Sizing and typography for the active theme. */
export function useThemeSpec(): ThemeSpec {
  return useTheme().spec;
}

/**
 * Resolves a semantic token to a concrete `rgb(...)` string.
 *
 * Tailwind classes cover almost everything, but SVG strokes and a few raw
 * style props need a real colour value. This keeps those reading from the same
 * palette instead of hardcoding a hex that silently ignores the theme.
 */
export function useThemeColor(token: keyof SemanticTokens): string {
  const { theme } = useTheme();
  return `rgb(${PALETTES[theme][token]})`;
}

/** For components that genuinely need the role, not just its look. */
export function useRole(): Role {
  const { role } = useTheme();
  if (!role) {
    throw new Error(
      "useRole() was called on a screen with no role — the first-run screens have a theme but no role yet.",
    );
  }
  return role;
}
