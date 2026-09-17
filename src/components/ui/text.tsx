import { Text as RNText, type TextProps } from "react-native";

import { useThemeSpec } from "@/design/theme-provider";

export type TextVariant =
  | "display"
  | "heading"
  | "body"
  | "label"
  | "caption";

export type TextTone =
  | "default"
  | "muted"
  | "subtle"
  | "primary"
  | "accent"
  | "success"
  | "warning"
  | "danger"
  | "gate"
  | "onPrimary"
  | "onGate";

const TONE_CLASS: Record<TextTone, string> = {
  default: "text-foreground",
  muted: "text-muted",
  subtle: "text-subtle",
  primary: "text-primary",
  accent: "text-accent",
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
  gate: "text-gate",
  onPrimary: "text-primary-foreground",
  onGate: "text-gate-foreground",
};

export interface AppTextProps extends TextProps {
  variant?: TextVariant;
  tone?: TextTone;
  weight?: "400" | "500" | "600";
  /**
   * Overrides the theme's heading face. Buttons and controls stay sans even in
   * Premium, where the serif is reserved for actual headings.
   */
  family?: "sans" | "serif";
  className?: string;
}

/**
 * The only text component. Sizes come from the active theme, never from the
 * call site, so the rider's 22px floor and admin's 13px density are properties
 * of the theme rather than something each screen has to remember.
 */
export function Text({
  variant = "body",
  tone = "default",
  weight,
  family,
  className,
  style,
  ...rest
}: AppTextProps) {
  const spec = useThemeSpec();

  const fontSize = {
    display: spec.textDisplay,
    heading: spec.textLarge,
    body: spec.textBase,
    label: Math.max(spec.textMin, spec.textBase - 3),
    caption: spec.textMin,
  }[variant];

  const lineHeight = variant === "display" ? fontSize * 1.1 : fontSize * 1.4;

  const defaultWeight =
    weight ?? (variant === "display" || variant === "heading" ? "600" : "400");

  const wantsSerif =
    family === "serif" ||
    (family === undefined &&
      spec.serifHeadings &&
      (variant === "display" || variant === "heading"));

  const fontFamily = wantsSerif ? "serif" : undefined;

  return (
    <RNText
      className={`${TONE_CLASS[tone]} ${className ?? ""}`}
      style={[{ fontSize, lineHeight, fontWeight: defaultWeight, fontFamily }, style]}
      {...rest}
    />
  );
}
