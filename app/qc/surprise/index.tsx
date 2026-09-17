import { useRouter } from "expo-router";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

import { HelpBubble, RoleTabBar, TaskCard } from "@/components/anatomy";
import { Card, ScreenHeader, Text } from "@/components/ui";
import { QC_QUEUE } from "@/contract/fixtures-detail";
import { useThemeSpec } from "@/design/theme-provider";
import { useT } from "@/i18n";

/**
 * Q4 Surprise queue — layer 2.
 *
 * Unannounced audits appear at most sixty minutes before they are due, and
 * neither the technician nor the customer is told. The rotation lock is the
 * part that matters: the same inspector cannot audit the same technician twice
 * in ninety days, which is what kills collusion. It is enforced in the query
 * layer, so an inspector simply never sees such a job.
 */
export default function SurpriseQueueScreen() {
  const t = useT();
  const router = useRouter();
  const spec = useThemeSpec();
  const surprises = QC_QUEUE.filter((job) => job.unannounced);

  return (
    <SafeAreaView className="flex-1" edges={["top", "left", "right"]}>
      <ScreenHeader title={t("screens.surpriseQueue")} screenId="Q4" showBack={false} />

      <ScrollView contentContainerClassName="gap-3 p-4">
        <Card tone="gate" className="flex-row items-start gap-3 p-4">
          <Feather name="shuffle" size={spec.textLarge} className="text-gate" />
          <Text variant="caption" tone="gate" className="flex-1">
            {t("states.deniedBody")}
          </Text>
        </Card>

        {surprises.map((job) => (
          <TaskCard
            key={job.id}
            title={t("screens.auditChecklist")}
            place={job.site}
            distanceMetres={job.distanceMetres}
            minutes={job.minutes}
            paise={job.paise}
            badge={t("detail.unannounced")}
            acceptLabel={t("common.submit")}
            onAccept={() => router.push("/qc/clearance" as never)}
          />
        ))}
      </ScrollView>

      <HelpBubble screenId="Q4" />
      <RoleTabBar />
    </SafeAreaView>
  );
}
