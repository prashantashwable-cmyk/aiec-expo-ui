import { useLocalSearchParams } from "expo-router";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ChecklistRow, HelpBubble, Timeline } from "@/components/anatomy";
import { EmptyState } from "@/components/states";
import { Card, Pill, ScreenHeader, Text } from "@/components/ui";
import { QC_REPORTS, QC_SHAFT_CHECKLIST } from "@/contract/fixtures-detail";
import { useFormat, useT } from "@/i18n";

/**
 * Q5.1 Report detail — layer 3.
 *
 * The signed report, its verdict and the items that produced it. A failed
 * report releases nothing: no drawings, no material allocation, and a
 * re-inspection is booked automatically rather than waiting for someone to
 * chase it.
 */
export default function ReportDetailScreen() {
  const t = useT();
  const f = useFormat();
  const { id } = useLocalSearchParams<{ id: string }>();
  const report = QC_REPORTS.find((r) => r.id === id);

  if (!report) {
    return (
      <SafeAreaView className="flex-1" edges={["top", "left", "right"]}>
        <ScreenHeader title={t("screens.reportDetail")} screenId="Q5.1" />
        <EmptyState
          icon="search"
          title={t("states.emptyTitle")}
          body={t("states.errorTitle")}
        />
      </SafeAreaView>
    );
  }

  const failures = QC_SHAFT_CHECKLIST.filter((i) => i.verdict === "fail");

  return (
    <SafeAreaView className="flex-1" edges={["top", "left", "right"]}>
      <ScreenHeader title={report.site} screenId="Q5.1" subtitle={report.id} />

      <ScrollView contentContainerClassName="gap-4 p-4">
        <Card className="gap-2 p-4">
          <Pill
            label={report.cleared ? t("detail.verified") : t("states.gateTitle")}
            tone={report.cleared ? "success" : "danger"}
          />
          <Text variant="caption" tone="subtle">
            {f.date(report.at)} · {f.time(report.at)}
          </Text>
        </Card>

        {!report.cleared && failures.length > 0 ? (
          <View className="gap-2">
            <Text variant="caption" tone="muted">
              {t("screens.checklistItem")}
            </Text>
            {failures.map((item) => (
              <ChecklistRow
                key={item.id}
                label={item.label}
                group={item.group}
                verdict={item.verdict}
                note={item.note}
              />
            ))}
          </View>
        ) : null}

        <View className="gap-3">
          <Text variant="caption" tone="muted">
            {t("detail.timeline")}
          </Text>
          <Timeline
            entries={[
              {
                id: report.id,
                label: t("screens.shaftChecklist"),
                at: report.at,
                icon: "clipboard",
                tone: report.cleared ? "success" : "danger",
              },
              {
                id: "MH-PUN-KOT-EVID-0910-V",
                label: t("gates.qcBlocks"),
                at: report.at,
                icon: report.cleared ? "unlock" : "lock",
                tone: report.cleared ? "success" : "warning",
              },
            ]}
          />
        </View>
      </ScrollView>

      <HelpBubble screenId="Q5.1" />
    </SafeAreaView>
  );
}
