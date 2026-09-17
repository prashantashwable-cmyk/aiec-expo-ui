import { View } from "react-native";
import { Feather } from "@expo/vector-icons";

import { Text } from "@/components/ui";
import { useThemeSpec } from "@/design/theme-provider";

export interface EvidenceItem {
  id: string;
  label: string;
  status: "passed" | "retake" | "pending";
}

const STATUS_ICON = {
  passed: "check-circle",
  retake: "alert-triangle",
  pending: "circle",
} as const;

const STATUS_TONE = {
  passed: "text-success",
  retake: "text-warning",
  pending: "text-subtle",
} as const;

/**
 * A strip of captured evidence. Each tile is an `EVID` record stamped with its
 * parent ID at the moment the shutter fired — there is no "attach to job" step
 * anywhere in this product, and building one would mean something upstream
 * broke Law 1.
 *
 * There is deliberately no gallery affordance here. Evidence comes from the
 * in-app camera only.
 */
export function EvidenceGrid({ items }: { items: EvidenceItem[] }) {
  const spec = useThemeSpec();

  return (
    <View className="flex-row flex-wrap gap-2">
      {items.map((item) => (
        <View
          key={item.id}
          accessibilityLabel={item.label}
          className="items-end justify-end bg-surface p-1.5"
          style={{
            borderRadius: spec.radius,
            width: 88,
            height: 88,
          }}
        >
          <Feather
            name={STATUS_ICON[item.status]}
            size={18}
            className={STATUS_TONE[item.status]}
          />
        </View>
      ))}
    </View>
  );
}

/** A checklist line with its PASS / FAIL / CONDITIONAL verdict. */
export function ChecklistRow({
  label,
  group,
  verdict,
  note,
  onPress,
}: {
  label: string;
  group?: string;
  verdict: "pass" | "fail" | "conditional" | "pending";
  note?: string;
  onPress?: () => void;
}) {
  const spec = useThemeSpec();

  const icon = {
    pass: "check-circle",
    fail: "x-circle",
    conditional: "alert-triangle",
    pending: "circle",
  }[verdict] as keyof typeof Feather.glyphMap;

  const tone = {
    pass: "text-success",
    fail: "text-danger",
    conditional: "text-warning",
    pending: "text-subtle",
  }[verdict];

  return (
    <View
      className="flex-row items-start gap-3 border border-line bg-surface-raised px-4 py-3"
      style={{ borderRadius: spec.radius }}
    >
      <Feather name={icon} size={spec.textLarge} className={tone} />
      <View className="flex-1">
        {group ? (
          <Text variant="caption" tone="subtle">
            {group}
          </Text>
        ) : null}
        <Text variant="body">{label}</Text>
        {note ? (
          <Text variant="caption" tone="warning">
            {note}
          </Text>
        ) : null}
      </View>
    </View>
  );
}
