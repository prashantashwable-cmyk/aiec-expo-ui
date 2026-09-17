import { useRouter } from "expo-router";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { HelpBubble, RoleTabBar } from "@/components/anatomy";
import { Card, ScreenHeader, Text } from "@/components/ui";
import { RIDER_ZONES } from "@/contract/fixtures-detail";
import { useThemeSpec } from "@/design/theme-provider";
import { useFormat, useT } from "@/i18n";

/**
 * R4 Coverage — layer 2.
 *
 * Zones done against zones pending. New ground matters more than distance
 * travelled: a rider who covers the same street eight times has moved a long
 * way and found nothing, and the bar here is what makes that visible to them
 * before it shows up in their earnings.
 */
export default function CoverageScreen() {
  const t = useT();
  const f = useFormat();
  const router = useRouter();
  const spec = useThemeSpec();

  return (
    <SafeAreaView className="flex-1" edges={["top", "left", "right"]}>
      <ScreenHeader title={t("screens.coverage")} screenId="R4" showBack={false} />

      <ScrollView contentContainerClassName="gap-3 p-4">
        {RIDER_ZONES.map((zone) => {
          const ratio = Math.min(1, zone.coveredKm2 / zone.targetKm2);
          return (
            <Card
              key={zone.code}
              className="gap-3 p-4"
              onTouchEnd={() => router.push(`/rider/coverage/${zone.code}` as never)}
            >
              <View className="flex-row items-baseline justify-between">
                <Text variant="body" weight="600">
                  {zone.name}
                </Text>
                <Text variant="caption" tone="subtle" style={{ fontFamily: "monospace" }}>
                  {zone.code}
                </Text>
              </View>

              <View
                className="overflow-hidden bg-surface"
                style={{ height: 8, borderRadius: 4 }}
                accessibilityRole="progressbar"
                accessibilityValue={{ now: Math.round(ratio * 100), min: 0, max: 100 }}
              >
                <View
                  className="h-full bg-primary"
                  style={{ width: `${ratio * 100}%`, borderRadius: 4 }}
                />
              </View>

              <View className="flex-row justify-between">
                <Text variant="caption" tone="muted">
                  {t("detail.covered")} {zone.coveredKm2} / {zone.targetKm2} km²
                </Text>
                <Text variant="caption" tone="muted">
                  {t("detail.leadsHere")} {f.count(zone.leads)}
                </Text>
              </View>

              <View className="flex-row items-center justify-between">
                <Text variant="caption" tone="subtle">
                  {t("detail.lastVisit")} {f.date(zone.lastVisitedAt)}
                </Text>
                <View
                  className="rounded-full px-2 py-0.5"
                  style={{
                    backgroundColor: `rgba(234,88,12,${0.15 + zone.opportunity * 0.5})`,
                    borderRadius: spec.radius,
                  }}
                >
                  <Text variant="caption" tone="warning" weight="600">
                    {t("detail.opportunity")} {f.percent(zone.opportunity * 100, 0)}
                  </Text>
                </View>
              </View>
            </Card>
          );
        })}
      </ScrollView>

      <HelpBubble screenId="R4" />
      <RoleTabBar />
    </SafeAreaView>
  );
}
