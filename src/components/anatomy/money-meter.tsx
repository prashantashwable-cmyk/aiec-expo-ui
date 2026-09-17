import { View } from "react-native";

import { Text } from "@/components/ui";
import { useThemeSpec } from "@/design/theme-provider";
import { useFormat, useT } from "@/i18n";

/**
 * Law 4, layer 2 — visible progress. Every field screen carries this: today's
 * earnings, and how far the next tier bonus is. The user always knows the gap.
 *
 * Amounts arrive as integer paise from the server. Nothing here does money
 * arithmetic; it only renders what it was handed.
 */
export function MoneyMeter({
  todayPaise,
  pendingPaise,
  clearedPaise,
  toNextTierPaise,
  tierProgress,
}: {
  todayPaise: number;
  pendingPaise: number;
  clearedPaise: number;
  toNextTierPaise: number;
  /** 0..1, computed server-side. */
  tierProgress: number;
}) {
  const t = useT();
  const f = useFormat();
  const spec = useThemeSpec();

  return (
    <View className="gap-3 px-4 py-3">
      <View>
        <Text variant="caption" tone="muted">
          {t("money.todayEarnings")}
        </Text>
        <Text variant="display" weight="600">
          {f.paise(todayPaise)}
        </Text>
      </View>

      <View
        className="overflow-hidden bg-surface"
        style={{ height: 8, borderRadius: 4 }}
        accessibilityRole="progressbar"
        accessibilityValue={{ now: Math.round(tierProgress * 100), min: 0, max: 100 }}
      >
        <View
          className="h-full bg-primary"
          style={{ width: `${Math.min(100, Math.max(0, tierProgress * 100))}%`, borderRadius: 4 }}
        />
      </View>

      <Text variant="caption" tone="warning">
        {t("money.nextTier", { amount: f.paise(toNextTierPaise) })}
      </Text>

      <View className="flex-row gap-2">
        <View
          className="flex-1 bg-surface px-3 py-2"
          style={{ borderRadius: spec.radius }}
        >
          <Text variant="caption" tone="muted">
            {t("money.pending")}
          </Text>
          <Text variant="body" weight="600">
            {f.paise(pendingPaise)}
          </Text>
        </View>
        <View
          className="flex-1 bg-surface px-3 py-2"
          style={{ borderRadius: spec.radius }}
        >
          <Text variant="caption" tone="muted">
            {t("money.cleared")}
          </Text>
          <Text variant="body" weight="600" tone="success">
            {f.paise(clearedPaise)}
          </Text>
        </View>
      </View>
    </View>
  );
}
