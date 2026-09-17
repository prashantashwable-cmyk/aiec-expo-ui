import { useLocalSearchParams } from "expo-router";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { HelpBubble, Timeline } from "@/components/anatomy";
import { BlockedByGateState, EmptyState } from "@/components/states";
import { Button, Card, ListRow, ScreenHeader, Text } from "@/components/ui";
import { SUPPLIER_ORDERS } from "@/contract/fixtures-console";
import { TECHNICIAN_KITS } from "@/contract/fixtures-detail";
import { useFormat, useT } from "@/i18n";

/**
 * P1.1 Order detail — layer 3.
 *
 * The kits to pack, the seal, and the gate that governs dispatch. Gate 3 is
 * the one that protects the company: no pre-dispatch payment, no supplier
 * order placed. If the customer never pays, the truck is recalled, the
 * material returns and the supplier is made whole — the company carries no
 * inventory risk because it never owned the goods.
 */
export default function OrderDetailScreen() {
  const t = useT();
  const f = useFormat();
  const { id } = useLocalSearchParams<{ id: string }>();
  const order = SUPPLIER_ORDERS.find((o) => o.id === id);

  if (!order) {
    return (
      <SafeAreaView className="flex-1" edges={["top", "left", "right"]}>
        <ScreenHeader title={t("screens.orderDetail")} screenId="P1.1" />
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
      <ScreenHeader title={order.site} screenId="P1.1" subtitle={order.id} />

      <ScrollView contentContainerClassName="gap-4 p-4">
        <Card className="gap-2 p-4">
          <Text variant="caption" tone="subtle">
            {t("screens.orderDetail")}
          </Text>
          <Text variant="display" weight="600">
            {f.paise(order.valuePaise)}
          </Text>
          <Text variant="caption" tone="muted">
            {f.date(order.dueAt)}
          </Text>
        </Card>

        {order.state === "offered" ? (
          <Button
            label={t("console.acceptWindow", { hours: order.acceptHoursLeft })}
            onPress={() => undefined}
          />
        ) : null}

        <View className="gap-2">
          <Text variant="caption" tone="muted">
            {t("screens.kitPacking")}
          </Text>
          {TECHNICIAN_KITS.slice(0, 4).map((kit) => (
            <ListRow
              key={kit.id}
              title={kit.code}
              subtitle={kit.contents}
              icon="package"
              meta={t("detail.unlocksAt", { step: kit.unlocksAtStep })}
              metaTone="muted"
            />
          ))}
        </View>

        <BlockedByGateState gate="preDispatchPayment" />

        <View className="gap-3">
          <Text variant="caption" tone="muted">
            {t("detail.timeline")}
          </Text>
          <Timeline
            entries={[
              {
                id: order.id,
                label: t("screens.orderBoard"),
                at: "2026-08-26T09:00:00+05:30",
                icon: "clipboard",
              },
              {
                id: order.id + "-PACK",
                label: t("screens.kitPacking"),
                at: "2026-08-27T14:30:00+05:30",
                icon: "package",
                tone: "success",
              },
            ]}
          />
        </View>
      </ScrollView>

      <HelpBubble screenId="P1.1" />
    </SafeAreaView>
  );
}
