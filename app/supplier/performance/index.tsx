import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

import { HelpBubble, RoleTabBar } from "@/components/anatomy";
import { Card, ScreenHeader, Text } from "@/components/ui";
import { SUPPLIER_PERFORMANCE } from "@/contract/fixtures-console";
import { useThemeSpec } from "@/design/theme-provider";
import { useFormat, useT } from "@/i18n";

/**
 * P6 Performance rating — layer 2.
 *
 * These four numbers feed the ranking engine directly, so the supplier can see
 * exactly what determines their next allocation. Early delivery pays a bonus,
 * late delivery costs per day to a cap, and a sustained quality rating buys
 * priority allocation — the incentives are visible rather than negotiated.
 */
export default function SupplierPerformanceScreen() {
  const t = useT();
  const f = useFormat();
  const spec = useThemeSpec();

  const metrics = [
    { icon: "clock", labelKey: "console.onTime", value: f.percent(SUPPLIER_PERFORMANCE.onTimePercent), good: true },
    { icon: "star", labelKey: "screens.performance", value: String(SUPPLIER_PERFORMANCE.rating), good: true },
    { icon: "alert-triangle", labelKey: "verdict.fail", value: f.percent(SUPPLIER_PERFORMANCE.defectRate), good: true },
    { icon: "clipboard", labelKey: "screens.orderBoard", value: f.count(SUPPLIER_PERFORMANCE.ordersThisMonth), good: true },
  ] as const;

  return (
    <SafeAreaView className="flex-1" edges={["top", "left", "right"]}>
      <ScreenHeader title={t("screens.performance")} screenId="P6" showBack={false} />

      <ScrollView contentContainerClassName="gap-2 p-3">
        {metrics.map((metric) => (
          <Card key={metric.labelKey} className="flex-row items-center gap-3 p-4">
            <Feather
              name={metric.icon}
              size={spec.textDisplay}
              className={metric.good ? "text-success" : "text-warning"}
            />
            <View className="flex-1">
              <Text variant="caption" tone="subtle">
                {t(metric.labelKey)}
              </Text>
              <Text variant="heading" weight="600">
                {metric.value}
              </Text>
            </View>
          </Card>
        ))}

        <Text variant="caption" tone="subtle" className="px-1 pt-2">
          {t("console.paidOnDelivery")}
        </Text>
      </ScrollView>

      <HelpBubble screenId="P6" />
      <RoleTabBar />
    </SafeAreaView>
  );
}
