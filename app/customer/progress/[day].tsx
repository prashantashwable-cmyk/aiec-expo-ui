import { useLocalSearchParams } from "expo-router";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { EvidenceGrid, HelpBubble, Timeline } from "@/components/anatomy";
import { EmptyState } from "@/components/states";
import { Card, ScreenHeader, Text } from "@/components/ui";
import { TECHNICIAN_STEP } from "@/contract/fixtures";
import { CUSTOMER_PROGRESS_DAYS, SOP_TREE } from "@/contract/fixtures-detail";
import { useFormat, useT } from "@/i18n";

/**
 * C7.1 Day detail — layer 3.
 *
 * The evidence captured that day, and when. Timestamps are the server ones, so
 * a customer looking at this is seeing the same record an insurer or a court
 * would see — which is the entire point of stamping time on receipt rather
 * than trusting the device.
 */
export default function ProgressDayScreen() {
  const t = useT();
  const f = useFormat();
  const { day } = useLocalSearchParams<{ day: string }>();
  const entry = CUSTOMER_PROGRESS_DAYS.find((d) => String(d.day) === day);
  const step = SOP_TREE.find((s) => s.index === entry?.step);

  if (!entry) {
    return (
      <SafeAreaView className="flex-1" edges={["top", "left", "right"]}>
        <ScreenHeader title={t("screens.dayDetail")} screenId="C7.1" />
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
        title={t("detail.day", { day: entry.day })}
        screenId="C7.1"
        subtitle={f.date(entry.date)}
      />

      <ScrollView contentContainerClassName="gap-4 p-4">
        <Card className="gap-1 p-4">
          <Text variant="caption" tone="subtle">
            {t("technician.stepOf", { current: entry.step, total: SOP_TREE.length })}
          </Text>
          <Text variant="heading" weight="600">
            {entry.title}
          </Text>
        </Card>

        <View className="gap-2">
          <Text variant="caption" tone="muted">
            {t("detail.evidence")}
          </Text>
          <EvidenceGrid items={[...TECHNICIAN_STEP.evidence]} />
        </View>

        {step?.verifiedAt ? (
          <View className="gap-3">
            <Text variant="caption" tone="muted">
              {t("detail.timeline")}
            </Text>
            <Timeline
              entries={[
                {
                  id: `MH-PUN-KOT-SOPX-06${entry.day}-A`,
                  label: entry.title,
                  at: step.verifiedAt,
                  icon: "check-circle",
                  tone: "success",
                },
              ]}
            />
          </View>
        ) : null}
      </ScrollView>

      <HelpBubble screenId="C7.1" />
    </SafeAreaView>
  );
}
