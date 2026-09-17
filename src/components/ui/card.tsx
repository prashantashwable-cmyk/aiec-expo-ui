import { View, type ViewProps } from "react-native";

import { useThemeSpec } from "@/design/theme-provider";

export interface CardProps extends ViewProps {
  /** `raised` sits above the page, `sunken` recedes into it. */
  tone?: "raised" | "surface" | "gate" | "danger";
  bordered?: boolean;
  className?: string;
}

const TONE: Record<NonNullable<CardProps["tone"]>, string> = {
  raised: "bg-surface-raised",
  surface: "bg-surface",
  gate: "bg-gate-surface",
  danger: "bg-surface-raised",
};

const BORDER: Record<NonNullable<CardProps["tone"]>, string> = {
  raised: "border-line",
  surface: "border-line",
  gate: "border-gate",
  danger: "border-danger",
};

export function Card({
  tone = "raised",
  bordered = true,
  className,
  style,
  ...rest
}: CardProps) {
  const spec = useThemeSpec();
  return (
    <View
      className={`${TONE[tone]} ${bordered ? `border ${BORDER[tone]}` : ""} ${className ?? ""}`}
      style={[{ borderRadius: spec.radius }, style]}
      {...rest}
    />
  );
}
