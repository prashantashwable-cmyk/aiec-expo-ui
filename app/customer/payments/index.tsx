import { useRouter } from "expo-router";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

import { HelpBubble, RoleTabBar } from "@/components/anatomy";
import { Card, ScreenHeader, Text } from "@/components/ui";
import { CUSTOMER_PAYMENTS } from "@/contract/fixtures-detail";
import { useThemeSpec } from "@/design/theme-provider";
import { useFormat, useT } from "@/i18n";

const STATE_ICON = {
  paid: "check-circle",
  due: "alert-circle",
  locked: "lock",
} as const;

const STATE_TONE = {
  paid: "text-success",
  due: "text-danger",
  locked: "text-subtle",
} as const;

/**
 * C5 Payments — layer 2. The ladder, in order, with what each one unlocks.
 *
 * Three milestones rather than one lump: token, ninety percent on arrival,
 * final ten on handover. Showing the whole ladder at once is deliberate — a
 * customer who can see what the next payment releases argues about it far less
 * than one who receives a demand with no context.
 */
export default function PaymentsScreen() {
  const t = useT();
  const f = useFormat();
  const router = useRouter();
  const spec = useThemeSpec();

  return (
    <SafeAreaView className="flex-1" edges={["top", "left", "right"]}>
      <ScreenHeader title={t("screens.payments")} screenId="C5" showBack={false} />

      <ScrollView contentContainerClassName="gap-3 p-4">
        {CUSTOMER_PAYMENTS.map((payment) => (
          <Card
            key={payment.id}
            className={`gap-2 p-4 ${payment.state === "due" ? "border-danger" : ""}`}
            onTouchEnd={() => router.push(`/customer/payments/${payment.id}` as never)}
          >
            <View className="flex-row items-center gap-3">
              <Feather
                name={STATE_ICON[payment.state]}
                size={spec.textLarge}
                className={STATE_TONE[payment.state]}
              />
              <View className="min-w-0 flex-1">
                <Text variant="body" weight="600">
                  {payment.label}
                </Text>
                <Text variant="caption" tone="subtle" style={{ fontFamily: "monospace" }}>
                  {payment.id}
                </Text>
              </View>
              <Text variant="heading" weight="600">
                {f.paise(payment.paise)}
              </Text>
            </View>

            <Text
              variant="caption"
              tone={payment.state === "paid" ? "success" : payment.state === "due" ? "danger" : "subtle"}
            >
              {payment.state === "paid" && payment.paidAt
                ? `${t("detail.paid")} · ${f.date(payment.paidAt)}`
                : payment.state === "due"
                  ? t("detail.due")
                  : t("detail.locked")}
            </Text>
          </Card>
        ))}
      </ScrollView>

      <HelpBubble screenId="C5" />
      <RoleTabBar />
    </SafeAreaView>
  );
}
