import { Pressable, View, type PressableProps } from "react-native";

import { useThemeSpec } from "@/design/theme-provider";
import { Text } from "./text";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "default" | "small";

const SURFACE: Record<ButtonVariant, string> = {
  primary: "bg-primary",
  secondary: "bg-surface-raised border border-line-strong",
  ghost: "bg-transparent",
  danger: "bg-danger",
};

const LABEL_TONE = {
  primary: "onPrimary",
  secondary: "default",
  ghost: "primary",
  danger: "onPrimary",
} as const;

export interface ButtonProps extends Omit<PressableProps, "children"> {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Rendered before the label. Keep it concrete — abstract glyphs do not read. */
  leading?: React.ReactNode;
  fullWidth?: boolean;
  className?: string;
}

/**
 * Height comes from the theme: 72px for the rider (helmet on, one hand, glare),
 * 56px for the technician (gloves), 32px for admin (mouse and keyboard).
 * Research floor for gloved operation is 44px; none of these go below it.
 */
export function Button({
  label,
  variant = "primary",
  size = "default",
  leading,
  fullWidth = true,
  disabled,
  className,
  ...rest
}: ButtonProps) {
  const spec = useThemeSpec();
  const height =
    size === "small" ? spec.controlHeightSm : spec.controlHeight;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!disabled }}
      disabled={disabled}
      className={`${SURFACE[variant]} ${fullWidth ? "w-full" : "self-start px-5"} items-center justify-center active:opacity-80 ${disabled ? "opacity-40" : ""} ${className ?? ""}`}
      style={{ height, borderRadius: spec.radius }}
      {...rest}
    >
      <View className="flex-row items-center gap-2 px-4">
        {leading}
        <Text
          variant={size === "small" ? "body" : "heading"}
          weight="600"
          family="sans"
          tone={LABEL_TONE[variant]}
        >
          {label}
        </Text>
      </View>
    </Pressable>
  );
}
