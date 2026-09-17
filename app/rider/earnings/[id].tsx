import { useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { EvidenceGrid, HelpBubble } from "@/components/anatomy";
import { EmptyState } from "@/components/states";
import { Button, Card, Pill, ScreenHeader, Text } from "@/components/ui";
import { LEAD_EVIDENCE, RIDER_LEDGER } from "@/contract/fixtures-detail";
import { useFormat, useT } from "@/i18n";

/**
 * R5.1 Wallet entry — layer 3.
 *
 * The whole point of Immovable 2 made visible: this rupee amount came from a
 * named settings key rather than a number typed into the code, and it points
 * at the evidence that authorised it. A worker can follow their own money back
 * to the photograph that earned it, which is what makes the ledger trustworthy
 * in both directions.
 */
export default function LedgerEntryScreen() {
  const t = useT();
  const f = useFormat();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const entry = RIDER_LEDGER.find((e) => e.id === id);

  if (!entry) {
    return (
      <SafeAreaView className="flex-1" edges={["top", "left", "right"]}>
        <ScreenHeader title={t("screens.ledgerEntry")} screenId="R5.1" />
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
      <ScreenHeader
        title={t("screens.ledgerEntry")}
        screenId="R5.1"
        subtitle={entry.id}
      />

      <ScrollView contentContainerClassName="gap-4 p-4">
        <Card className="gap-2 p-4">
          <Text variant="caption" tone="subtle">
            {entry.label}
          </Text>
          <Text variant="display" weight="600" tone={entry.cleared ? "success" : "warning"}>
            {"+" + f.paise(entry.paise)}
          </Text>
          <View className="flex-row items-center gap-2">
            <Pill
              label={entry.cleared ? t("money.cleared") : t("money.pending")}
              tone={entry.cleared ? "success" : "warning"}
            />
            <Text variant="caption" tone="subtle">
              {f.date(entry.at)} · {f.time(entry.at)}
            </Text>
          </View>
        </Card>

        <Card tone="surface" bordered={false} className="gap-1 p-4">
          <Text variant="caption" tone="subtle">
            {t("detail.creditedFrom")}
          </Text>
          <Text variant="body" style={{ fontFamily: "monospace" }}>
            {entry.settingsKey}
          </Text>
        </Card>

        {entry.evidenceId ? (
          <View className="gap-2">
            <Text variant="caption" tone="muted">
              {t("detail.evidence")}
            </Text>
            <EvidenceGrid items={LEAD_EVIDENCE.slice(0, 1)} />
            <Text variant="caption" tone="subtle" style={{ fontFamily: "monospace" }}>
              {entry.evidenceId}
            </Text>
            <Button
              label={t("detail.viewEvidence")}
              variant="secondary"
              size="small"
              onPress={() => router.push("/rider/leads" as never)}
            />
          </View>
        ) : null}
      </ScrollView>

      <HelpBubble screenId="R5.1" />
    </SafeAreaView>
  );
}
