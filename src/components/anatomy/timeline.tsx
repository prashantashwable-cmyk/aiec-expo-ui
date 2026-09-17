import { View } from "react-native";
import { Feather } from "@expo/vector-icons";

import { Text } from "@/components/ui";
import { useThemeSpec } from "@/design/theme-provider";
import { useFormat } from "@/i18n";

export interface TimelineEntry {
  id: string;
  label: string;
  /** Server-issued ISO timestamp. Device time is never shown here. */
  at: string;
  actor?: string;
  icon: keyof typeof Feather.glyphMap;
  tone?: "default" | "success" | "warning" | "danger";
}

const TONE_CLASS = {
  default: "text-subtle",
  success: "text-success",
  warning: "text-warning",
  danger: "text-danger",
} as const;

/**
 * Law 1, layer 3 — forensic reconstruction. Any dispute is settled by pulling
 * one ID and replaying its complete timeline: who stood where, at what minute,
 * with what photo, and which rupee moved.
 *
 * Times come from the server. A timeline stamped with device time would prove
 * nothing, which is the whole reason Immovable 3 exists.
 */
export function Timeline({ entries }: { entries: TimelineEntry[] }) {
  const spec = useThemeSpec();
  const f = useFormat();

  return (
    <View className="gap-0">
      {entries.map((entry, index) => {
        const last = index === entries.length - 1;
        return (
          <View key={entry.id} className="flex-row gap-3">
            <View className="items-center">
              <View
                className="items-center justify-center rounded-full border border-line bg-surface"
                style={{ width: 32, height: 32 }}
              >
                <Feather
                  name={entry.icon}
                  size={14}
                  className={TONE_CLASS[entry.tone ?? "default"]}
                />
              </View>
              {!last ? <View className="w-px flex-1 bg-line" style={{ minHeight: 18 }} /> : null}
            </View>

            <View className="flex-1 pb-4" style={{ paddingTop: 4 }}>
              <Text variant="body" numberOfLines={2}>
                {entry.label}
              </Text>
              <Text variant="caption" tone="subtle">
                {[f.time(entry.at), entry.actor].filter(Boolean).join(" · ")}
              </Text>
              <Text
                variant="caption"
                tone="subtle"
                style={{ fontFamily: "monospace", fontSize: Math.max(11, spec.textMin - 2) }}
              >
                {entry.id}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}
