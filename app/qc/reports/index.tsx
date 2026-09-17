import { useRouter } from "expo-router";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { HelpBubble, RoleTabBar } from "@/components/anatomy";
import { ListRow, ScreenHeader } from "@/components/ui";
import { QC_REPORTS } from "@/contract/fixtures-detail";
import { useFormat, useT } from "@/i18n";

/**
 * Q5 Report builder — layer 2.
 *
 * Each report has its own QCIN id, chained to the LIFT it judged, and is
 * generated in the customer language rather than the inspector one. A report
 * the customer cannot read is a rework list that will be ignored.
 */
export default function ReportsScreen() {
  const t = useT();
  const f = useFormat();
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1" edges={["top", "left", "right"]}>
      <ScreenHeader title={t("screens.reportBuilder")} screenId="Q5" showBack={false} />

      <ScrollView contentContainerClassName="gap-2 p-4">
        {QC_REPORTS.map((report) => (
          <ListRow
            key={report.id}
            title={report.site}
            subtitle={report.id}
            monoSubtitle
            icon={report.cleared ? "check-circle" : "x-circle"}
            iconTone={report.cleared ? "text-success" : "text-danger"}
            meta={f.date(report.at)}
            onPress={() => router.push(`/qc/reports/${report.id}` as never)}
          />
        ))}
      </ScrollView>

      <HelpBubble screenId="Q5" />
      <RoleTabBar />
    </SafeAreaView>
  );
}
