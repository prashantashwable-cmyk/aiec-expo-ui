const withAlpha = (variable) => `rgb(var(${variable}) / <alpha-value>)`;

module.exports = {
  content: ["./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  // Explicit themes, not media queries: the role decides the palette, so the
  // dark/light flag must be settable rather than read from the OS.
  darkMode: "class",
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: withAlpha("--background"),
        surface: {
          DEFAULT: withAlpha("--surface"),
          raised: withAlpha("--surface-raised"),
        },
        foreground: withAlpha("--foreground"),
        muted: withAlpha("--muted-foreground"),
        subtle: withAlpha("--subtle-foreground"),
        line: {
          DEFAULT: withAlpha("--border"),
          strong: withAlpha("--border-strong"),
        },
        primary: {
          DEFAULT: withAlpha("--primary"),
          foreground: withAlpha("--primary-foreground"),
        },
        accent: {
          DEFAULT: withAlpha("--accent"),
          foreground: withAlpha("--accent-foreground"),
        },
        success: {
          DEFAULT: withAlpha("--success"),
          foreground: withAlpha("--success-foreground"),
        },
        warning: {
          DEFAULT: withAlpha("--warning"),
          foreground: withAlpha("--warning-foreground"),
        },
        danger: {
          DEFAULT: withAlpha("--danger"),
          foreground: withAlpha("--danger-foreground"),
        },
        gate: {
          DEFAULT: withAlpha("--gate"),
          foreground: withAlpha("--gate-foreground"),
          surface: withAlpha("--gate-surface"),
        },
        map: {
          new: withAlpha("--map-new"),
          sales: withAlpha("--map-sales"),
          won: withAlpha("--map-won"),
          transit: withAlpha("--map-transit"),
          installing: withAlpha("--map-installing"),
          complete: withAlpha("--map-complete"),
          blocked: withAlpha("--map-blocked"),
          lost: withAlpha("--map-lost"),
        },
      },
      fontFamily: {
        sans: ["NotoSans", "system-ui", "sans-serif"],
        serif: ["NotoSerif", "Georgia", "serif"],
        mono: ["monospace"],
      },
    },
  },
  plugins: [],
};
