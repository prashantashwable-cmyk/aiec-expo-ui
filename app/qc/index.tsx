import { useRouter } from "expo-router";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { HelpBubble, MapShell, RoleTabBar, TaskCard } from "@/components/anatomy";
import { ScreenHeader, Text } from "@/components/ui";
import { QC_QUEUE } from "@/contract/fixtures-detail";
import { PUNE, QC_PINS, ZONES } from "@/contract/geo";
import { useT } from "@/i18n";

/**
 * Q1 Inspection map — layer 1 for QC.
 *
 * Pending inspections sorted by real driving distance, not straight-line. The
 * inspector never installs; they only judge. That separation is what makes the
 * evidence trail credible to an NBFC, an insurer and a court, and it is
 * enforced at the query layer rather than by hiding a button.
 */
export default function InspectionMapScreen() {
  const t = useT();
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1" edges={["top", "left", "right"]}>
      <ScreenHeader title={t("screens.inspectionMap")} screenId="Q1" showBack={false} />

      <View className="h-56">
        <MapShell
          center={PUNE}
          zoom={11}
          pins={QC_PINS}
          self={ZONES.SHI}
        />
      </View>

      <ScrollView contentContainerClassName="gap-3 p-4">
        <Text variant="caption" tone="muted">
          {t("screens.surpriseQueue")}
        </Text>

        {QC_QUEUE.map((job) => (
          <TaskCard
            key={job.id}
            title={
              job.kind === "surprise"
                ? t("screens.auditChecklist")
                : t("screens.shaftChecklist")
            }
            place={job.site}
            distanceMetres={job.distanceMetres}
            minutes={job.minutes}
            paise={job.paise}
            badge={job.unannounced ? t("detail.unannounced") : undefined}
            acceptLabel={t("common.submit")}
            onAccept={() => router.push("/qc/clearance" as never)}
          />
        ))}
      </ScrollView>

      <HelpBubble screenId="Q1" />
      <RoleTabBar />
    </SafeAreaView>
  );
}
