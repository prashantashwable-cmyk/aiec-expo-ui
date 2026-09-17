import { View } from "react-native";

import { Text, type TextTone } from "./text";

export type PillTone = "neutral" | "primary" | "success" | "warning" | "danger" | "gate";

const SURFACE: Record<PillTone, string> = {
  neutral: "bg-surface border border-line",
  primary: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  gate: "bg-gate",
};

const LABEL: Record<PillTone, TextTone> = {
  neutral: "muted",
  primary: "onPrimary",
  success: "onPrimary",
  warning: "onPrimary",
  danger: "onPrimary",
  gate: "onGate",
};

export function Pill({
  label,
  tone = "neutral",
}: {
  label: string;
  tone?: PillTone;
}) {
  return (
    <View className={`${SURFACE[tone]} self-start rounded-full px-3 py-1`}>
      <Text variant="caption" weight="500" tone={LABEL[tone]}>
        {label}
      </Text>
    </View>
  );
}
