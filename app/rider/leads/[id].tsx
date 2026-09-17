import { useLocalSearchParams } from "expo-router";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { EvidenceGrid, HelpBubble, Timeline } from "@/components/anatomy";
import { EmptyState } from "@/components/states";
import { Card, Pill, ScreenHeader, Text } from "@/components/ui";
import {
  LEAD_EVIDENCE,
  LEAD_TIMELINE,
  RIDER_LEADS,
} from "@/contract/fixtures-detail";
import { useFormat, useT } from "@/i18n";
import type { TranslationKey } from "@/i18n";

/**
 * R3.1 Lead detail — layer 3.
 *
 * Law 1, layer 3 in practice: one ID, replayed. The three photos, the GPS
 * segment, the messages the bot sent and the rupees that moved are all stamped
 * to this lead, so the whole history reads back without anyone having to
 * assemble it.
 */
export default function LeadDetailScreen() {
  const t = useT();
  const f = useFormat();
  const { id } = useLocalSearchParams<{ id: string }>();
  const lead = RIDER_LEADS.find((l) => l.id === id);

  if (!lead) {
    return (
      <SafeAreaView className="flex-1" edges={["top", "left", "right"]}>
        <ScreenHeader title={t("screens.leadDetail")} screenId="R3.1" />
        <EmptyState
          icon="search"
          title={t("states.emptyTitle")}
          body={t("states.errorTitle")}
        />
      </SafeAreaView>
    );
  }

  const statusKey = `mapStatus.${lead.status}` as TranslationKey;

  return (
    <SafeAreaView className="flex-1" edges={["top", "left", "right"]}>
      <ScreenHeader
        title={lead.site}
        screenId="R3.1"
        subtitle={lead.id}
      />

      <ScrollView contentContainerClassName="gap-4 p-4">
        <View className="flex-row items-center gap-2">
          <Pill
            label={t(statusKey)}
            tone={lead.status === "won" ? "success" : lead.status === "lost" ? "danger" : "neutral"}
          />
          <Text variant="caption" tone="subtle">
            {t("detail.captured")} {f.date(lead.capturedAt)}
          </Text>
        </View>

        <View className="flex-row gap-2">
          <Card tone="surface" bordered={false} className="flex-1 p-3">
            <Text variant="caption" tone="subtle">
              {t("detail.captureCredit")}
            </Text>
            <Text variant="body" weight="600">
              {f.paise(lead.creditPaise)}
            </Text>
          </Card>
          <Card tone="surface" bordered={false} className="flex-1 p-3">
            <Text variant="caption" tone="subtle">
              {t("detail.commission")}
            </Text>
            <Text
              variant="body"
              weight="600"
              tone={lead.commissionCleared ? "success" : "warning"}
            >
              {lead.commissionPaise > 0 ? f.paise(lead.commissionPaise) : "—"}
            </Text>
          </Card>
        </View>

        <View className="gap-2">
          <Text variant="caption" tone="muted">
            {t("detail.evidence")}
          </Text>
          <EvidenceGrid items={LEAD_EVIDENCE} />
        </View>

        <View className="gap-3">
          <Text variant="caption" tone="muted">
            {t("detail.timeline")}
          </Text>
          <Timeline entries={LEAD_TIMELINE} />
        </View>
      </ScrollView>

      <HelpBubble screenId="R3.1" />
    </SafeAreaView>
  );
}
