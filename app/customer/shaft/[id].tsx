import { useLocalSearchParams } from "expo-router";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { EvidenceGrid, HelpBubble } from "@/components/anatomy";
import { BlockedByGateState, EmptyState } from "@/components/states";
import { Card, ScreenHeader, Text } from "@/components/ui";
import { CUSTOMER_SHAFT_ITEMS, LEAD_EVIDENCE } from "@/contract/fixtures-detail";
import { useT } from "@/i18n";

/**
 * C3.1 Requirement detail — layer 3.
 *
 * A failed item shows the annotated evidence from the QC visit rather than a
 * bare verdict. The customer is being asked to spend money on rework, so they
 * are shown the photograph that justifies it — a rework list without proof is
 * an argument waiting to happen.
 */
export default function ShaftItemScreen() {
  const t = useT();
  const { id } = useLocalSearchParams<{ id: string }>();
  const item = CUSTOMER_SHAFT_ITEMS.find((i) => i.id === id);

  if (!item) {
    return (
      <SafeAreaView className="flex-1" edges={["top", "left", "right"]}>
        <ScreenHeader title={t("screens.sopItem")} screenId="C3.1" />
        <EmptyState
          icon="search"
          title={t("states.emptyTitle")}
          body={t("states.errorTitle")}
        />
      </SafeAreaView>
    );
  }

  const note = "note" in item ? item.note : undefined;

  return (
    <SafeAreaView className="flex-1" edges={["top", "left", "right"]}>
      <ScreenHeader title={t("screens.sopItem")} screenId="C3.1" subtitle={item.id} />

      <ScrollView contentContainerClassName="gap-4 p-4">
        <Card className="gap-2 p-4">
          <Text variant="heading" weight="600">
            {item.label}
          </Text>
          {note ? (
            <Text variant="body" tone="danger">
              {note}
            </Text>
          ) : null}
        </Card>

        {item.verdict === "fail" ? (
          <>
            <View className="gap-2">
              <Text variant="caption" tone="muted">
                {t("detail.evidence")}
              </Text>
              <EvidenceGrid items={LEAD_EVIDENCE.slice(0, 2)} />
            </View>
            <BlockedByGateState gate="qcClearance" />
          </>
        ) : null}
      </ScrollView>

      <HelpBubble screenId="C3.1" />
    </SafeAreaView>
  );
}
