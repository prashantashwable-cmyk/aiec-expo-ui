import { useRouter } from "expo-router";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { HelpBubble, MapShell, RoleTabBar, TaskCard } from "@/components/anatomy";
import { ScreenHeader } from "@/components/ui";
import { TECHNICIAN_STEP } from "@/contract/fixtures";
import { SITES, TECHNICIAN_PINS, ZONES } from "@/contract/geo";
import { useT } from "@/i18n";

/**
 * T1 Job map — layer 2, and the technician home in the manual sense.
 *
 * Assigned sites, the route between them, and the one step due right now.
 * The offer that brought the job here was a Law 5 task card, so the same card
 * shows the work still outstanding.
 */
export default function JobMapScreen() {
  const t = useT();
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1" edges={["top", "left", "right"]}>
      <ScreenHeader title={t("screens.jobMap")} screenId="T1" showBack={false} />

      <MapShell
        center={ZONES.KOT}
        zoom={13}
        pins={TECHNICIAN_PINS}
        self={SITES[TECHNICIAN_STEP.jobId]}
      />

      <View className="p-4">
        <TaskCard
          title={TECHNICIAN_STEP.title}
          place="Kothrud"
          distanceMetres={TECHNICIAN_STEP.geofenceMetres}
          minutes={45}
          paise={TECHNICIAN_STEP.valuePaise}
          acceptLabel={t("technician.startStep")}
          onAccept={() => router.push("/technician" as never)}
        />
      </View>

      <HelpBubble screenId="T1" />
      <RoleTabBar />
    </SafeAreaView>
  );
}
