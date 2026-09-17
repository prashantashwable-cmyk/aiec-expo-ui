import { useLocalSearchParams } from "expo-router";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

import { EvidenceGrid, HelpBubble, Timeline } from "@/components/anatomy";
import { BlockedByGateState, EmptyState } from "@/components/states";
import { Card, ScreenHeader, Text } from "@/components/ui";
import { SALES_LEADS } from "@/contract/fixtures-console";
import { LEAD_EVIDENCE, LEAD_TIMELINE } from "@/contract/fixtures-detail";
import { useThemeSpec } from "@/design/theme-provider";
import { useFormat, useT } from "@/i18n";

/**
 * S2.1 Quotation and pricing ladder — layer 3.
 *
 * The 60/30/20 ladder, shown as three stops rather than one number. The
 * headroom exists so the customer experiences winning a negotiation, which is
 * what closes deals in this market — but the floor underneath it is hard-locked
 * in code. The bot can discount to its floor automatically; below that only a
 * human desk; below the margin floor, nobody, not even the admin.
 */
export default function SalesLeadDetailScreen() {
  const t = useT();
  const f = useFormat();
  const spec = useThemeSpec();
  const { id } = useLocalSearchParams<{ id: string }>();
  const lead = SALES_LEADS.find((l) => l.id === id);

  if (!lead) {
    return (
      <SafeAreaView className="flex-1" edges={["top", "left", "right"]}>
        <ScreenHeader title={t("screens.leadCard")} screenId="S2.1" />
        <EmptyState
          icon="search"
          title={t("states.emptyTitle")}
          body={t("states.errorTitle")}
        />
      </SafeAreaView>
    );
  }

  const ladder = [
    { labelKey: "console.listPrice", paise: lead.listPaise, tone: "default" as const },
    { labelKey: "console.botFloor", paise: lead.botFloorPaise, tone: "warning" as const },
    { labelKey: "console.marginFloor", paise: lead.marginFloorPaise, tone: "danger" as const },
  ];

  return (
    <SafeAreaView className="flex-1" edges={["top", "left", "right"]}>
      <ScreenHeader title={lead.site} screenId="S2.1" subtitle={lead.id} />

      <ScrollView contentContainerClassName="gap-4 p-4">
        <View className="gap-2">
          <Text variant="caption" tone="muted">
            {t("detail.evidence")}
          </Text>
          <EvidenceGrid items={LEAD_EVIDENCE} />
        </View>

        {lead.listPaise > 0 ? (
          <Card className="gap-3 p-4">
            {ladder.map((stop, index) => (
              <View key={stop.labelKey} className="gap-1">
                <View className="flex-row items-baseline justify-between">
                  <Text variant="caption" tone="subtle">
                    {t(stop.labelKey as never)}
                  </Text>
                  <Text variant="body" weight="600" tone={stop.tone}>
                    {f.paise(stop.paise)}
                  </Text>
                </View>
                {index < ladder.length - 1 ? (
                  <View className="flex-row items-center gap-2">
                    <Feather name="arrow-down" size={spec.textMin} className="text-subtle" />
                    <View className="h-px flex-1 bg-line" />
                  </View>
                ) : null}
              </View>
            ))}

            <Text variant="caption" tone="danger">
              {t("console.noOverrideAdmin")} {t("console.ownerOnly")}
            </Text>
          </Card>
        ) : null}

        {lead.stage === "new" ? <BlockedByGateState gate="token" /> : null}

        <View className="gap-3">
          <Text variant="caption" tone="muted">
            {t("console.transcript")}
          </Text>
          <Timeline entries={LEAD_TIMELINE} />
        </View>
      </ScrollView>

      <HelpBubble screenId="S2.1" />
    </SafeAreaView>
  );
}
