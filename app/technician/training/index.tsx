import { useRouter } from "expo-router";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { HelpBubble, RoleTabBar } from "@/components/anatomy";
import { ListRow, ScreenHeader } from "@/components/ui";
import { useT } from "@/i18n";

const MODULES = [
  { id: "M-01", title: "Guide rail alignment, laser method", minutes: 4, done: true },
  { id: "M-02", title: "Torque marking and verification", minutes: 3, done: true },
  { id: "M-03", title: "Fishplate joints", minutes: 5, done: false },
  { id: "M-04", title: "Working at height, harness discipline", minutes: 7, done: false },
  { id: "M-05", title: "Safety gear and ARD commissioning", minutes: 9, done: false },
];

/**
 * T8 Training — layer 2.
 *
 * The manual treats a failing SOP step as a training signal rather than a
 * discipline one: which step fails most often across technicians tells you
 * what to teach, not who to punish. Modules are short because they are watched
 * on site, standing in a shaft, between steps.
 */
export default function TrainingScreen() {
  const t = useT();
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1" edges={["top", "left", "right"]}>
      <ScreenHeader title={t("screens.training")} screenId="T8" showBack={false} />

      <ScrollView contentContainerClassName="gap-2 p-4">
        {MODULES.map((module) => (
          <ListRow
            key={module.id}
            title={module.title}
            subtitle={`${module.minutes} min`}
            icon={module.done ? "check-circle" : "play-circle"}
            iconTone={module.done ? "text-success" : "text-primary"}
            onPress={() => router.push(`/technician/training/${module.id}` as never)}
          />
        ))}
      </ScrollView>

      <HelpBubble screenId="T8" />
      <RoleTabBar />
    </SafeAreaView>
  );
}
