import { useLocalSearchParams } from "expo-router";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { HelpBubble, Timeline } from "@/components/anatomy";
import { BlockedByGateState, EmptyState } from "@/components/states";
import { Button, Card, Pill, ScreenHeader, Text } from "@/components/ui";
import { CUSTOMER_PAYMENTS } from "@/contract/fixtures-detail";
import { useFormat, useT } from "@/i18n";

/**
 * C5.1 Receipt — layer 3.
 *
 * A paid milestone shows its receipt and what it released. An unpaid one shows
 * the gate it is holding, so the customer reads a consequence rather than a
 * demand. The final milestone is locked rather than payable: no final payment,
 * no NOC, and the NOC is a real document with its own ID and a verifiable QR.
 */
export default function ReceiptScreen() {
  const t = useT();
  const f = useFormat();
  const { id } = useLocalSearchParams<{ id: string }>();
  const payment = CUSTOMER_PAYMENTS.find((p) => p.id === id);

  if (!payment) {
    return (
      <SafeAreaView className="flex-1" edges={["top", "left", "right"]}>
        <ScreenHeader title={t("screens.receipt")} screenId="C5.1" />
        <EmptyState
          icon="search"
          title={t("states.emptyTitle")}
          body={t("states.errorTitle")}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1" edges={["top", "left", "right"]}>
      <ScreenHeader title={payment.label} screenId="C5.1" subtitle={payment.id} />

      <ScrollView contentContainerClassName="gap-4 p-4">
        <Card className="gap-2 p-4">
          <Text variant="display" weight="600">
            {f.paise(payment.paise)}
          </Text>
          <Pill
            label={
              payment.state === "paid"
                ? t("detail.paid")
                : payment.state === "due"
                  ? t("detail.due")
                  : t("detail.locked")
            }
            tone={payment.state === "paid" ? "success" : payment.state === "due" ? "danger" : "neutral"}
          />
        </Card>

        {payment.state === "paid" && payment.paidAt ? (
          <View className="gap-3">
            <Text variant="caption" tone="muted">
              {t("detail.timeline")}
            </Text>
            <Timeline
              entries={[
                {
                  id: payment.id,
                  label: payment.label,
                  at: payment.paidAt,
                  icon: "credit-card",
                  tone: "success",
                },
                {
                  id: "MH-PUN-KOT-AGMT-0077-L",
                  label: t("gates.tokenBlocks"),
                  at: payment.paidAt,
                  icon: "file-text",
                },
              ]}
            />
          </View>
        ) : null}

        {payment.state === "due" ? (
          <BlockedByGateState
            gate="preDispatchPayment"
            actionLabel={t("customer.payNow")}
            onAction={() => undefined}
          />
        ) : null}

        {payment.state === "locked" ? (
          <BlockedByGateState gate="finalPayment" />
        ) : null}

        {payment.state === "paid" ? (
          <Button label={t("common.close")} variant="secondary" onPress={() => undefined} />
        ) : null}
      </ScrollView>

      <HelpBubble screenId="C5.1" />
    </SafeAreaView>
  );
}
