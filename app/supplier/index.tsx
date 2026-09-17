import { useRouter } from "expo-router";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

import { HelpBubble, RoleTabBar } from "@/components/anatomy";
import { Card, Pill, ScreenHeader, Text } from "@/components/ui";
import { SUPPLIER_ORDERS } from "@/contract/fixtures-console";
import { useThemeSpec } from "@/design/theme-provider";
import { useFormat, useT } from "@/i18n";
import type { TranslationKey } from "@/i18n";

const STATE_TONE = {
  offered: "warning",
  accepted: "primary",
  packing: "primary",
  sealed: "primary",
  transit: "warning",
  paid: "success",
} as const;

/**
 * P1 Order board — layer 1 for supplier.
 *
 * Allocation is a ranking, not a relationship: price, lead time, quality
 * rating, distance, capacity and past on-time percentage. The top-ranked
 * supplier gets a four-hour acceptance window before it cascades to the next,
 * so the countdown is on the card rather than in an email.
 *
 * Every card shows value, deadline and payment date, because the payment terms
 * are the actual argument for onboarding: paid on delivery and collection, not
 * on sixty or ninety day credit.
 */
export default function OrderBoardScreen() {
  const t = useT();
  const f = useFormat();
  const router = useRouter();
  const spec = useThemeSpec();

  return (
    <SafeAreaView className="flex-1" edges={["top", "left", "right"]}>
      <ScreenHeader title={t("screens.orderBoard")} screenId="P1" showBack={false} />

      <ScrollView contentContainerClassName="gap-3 p-3">
        {SUPPLIER_ORDERS.map((order) => (
          <Card
            key={order.id}
            className={`gap-3 p-4 ${order.state === "offered" ? "border-warning" : ""}`}
            onTouchEnd={() => router.push(`/supplier/orders/${order.id}` as never)}
          >
            <View className="flex-row items-start justify-between gap-2">
              <View className="min-w-0 flex-1">
                <Text variant="body" weight="600" numberOfLines={1}>
                  {order.site}
                </Text>
                <Text variant="caption" tone="subtle" style={{ fontFamily: "monospace" }}>
                  {order.id}
                </Text>
              </View>
              <Text variant="heading" weight="600">
                {f.paise(order.valuePaise)}
              </Text>
            </View>

            <View className="flex-row items-center justify-between">
              <Pill
                label={t(`orderState.${order.state}` as TranslationKey)}
                tone={STATE_TONE[order.state]}
              />
              {order.acceptHoursLeft > 0 ? (
                <View className="flex-row items-center gap-1.5">
                  <Feather name="clock" size={spec.textMin} className="text-warning" />
                  <Text variant="caption" tone="warning" weight="600">
                    {t("console.acceptWindow", { hours: order.acceptHoursLeft })}
                  </Text>
                </View>
              ) : (
                <Text variant="caption" tone="subtle">
                  {f.date(order.dueAt)}
                </Text>
              )}
            </View>
          </Card>
        ))}

        <Text variant="caption" tone="subtle" className="px-1">
          {t("console.paidOnDelivery")}
        </Text>
      </ScrollView>

      <HelpBubble screenId="P1" />
      <RoleTabBar />
    </SafeAreaView>
  );
}
