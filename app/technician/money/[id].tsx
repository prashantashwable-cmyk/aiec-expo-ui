import { useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { EvidenceGrid, HelpBubble } from "@/components/anatomy";
import { EmptyState } from "@/components/states";
import { Button, Card, Pill, ScreenHeader, Text } from "@/components/ui";
import { TECHNICIAN_STEP } from "@/contract/fixtures";
import { SOP_TREE } from "@/contract/fixtures-detail";
import { useFormat, useT } from "@/i18n";

/**
 * T6.1 Accrual detail — layer 3.
 *
 * Gate 4 made legible: this money exists because specific evidence passed. The
 * appeal route sits on the same screen as the amount, because a rejection
 * shipped without an appeal is an incomplete feature, and a wrongly withheld
 * payment travels through a technician network faster than any recruitment
 * campaign can repair.
 */
export default function TechnicianAccrualScreen() {
  const t = useT();
  const f = useFormat();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const step = SOP_TREE.find((s) => s.index === Number(id));

  if (!step) {
    return (
      <SafeAreaView className="flex-1" edges={["top", "left", "right"]}>
        <ScreenHeader title={t("screens.ledgerEntry")} screenId="T6.1" />
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
        screenId="T6.1"
        subtitle={step.title}
      />

      <ScrollView contentContainerClassName="gap-4 p-4">
        <Card className="gap-2 p-4">
          <Text variant="caption" tone="subtle">
            {t("technician.stepOf", { current: step.index, total: SOP_TREE.length })}
          </Text>
          <Text variant="display" weight="600" tone="success">
            {"+" + f.paise(step.valuePaise)}
          </Text>
          <View className="flex-row items-center gap-2">
            <Pill label={t("money.pending")} tone="warning" />
            {step.verifiedAt ? (
              <Text variant="caption" tone="subtle">
                {f.date(step.verifiedAt)} · {f.time(step.verifiedAt)}
              </Text>
            ) : null}
          </View>
        </Card>

        <Card tone="surface" bordered={false} className="gap-1 p-4">
          <Text variant="caption" tone="subtle">
            {t("detail.creditedFrom")}
          </Text>
          <Text variant="body" style={{ fontFamily: "monospace" }}>
            sop.step.{step.index}.payout
          </Text>
        </Card>

        <View className="gap-2">
          <Text variant="caption" tone="muted">
            {t("detail.evidence")}
          </Text>
          <EvidenceGrid items={[...TECHNICIAN_STEP.evidence]} />
        </View>

        <View className="gap-2">
          <Text variant="caption" tone="success">
            {t("technician.paidWhilePending")}
          </Text>
          <Button
            label={t("technician.appeal")}
            variant="secondary"
            size="small"
            onPress={() => router.push("/technician" as never)}
          />
        </View>
      </ScrollView>

      <HelpBubble screenId="T6.1" />
    </SafeAreaView>
  );
}
