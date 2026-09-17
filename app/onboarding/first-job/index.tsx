import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

import { HelpBubble, RoleTabBar, TaskCard } from "@/components/anatomy";
import { Card, ScreenHeader, Text } from "@/components/ui";
import { useThemeSpec } from "@/design/theme-provider";
import { useFormat, useT } from "@/i18n";

const SHADOW_JOBS = [
  { id: 1, done: true },
  { id: 2, done: false },
  { id: 3, done: false },
];

/**
 * B5 First job — layer 2.
 *
 * The first three jobs are shadow-only alongside a mentor, with a full QC
 * audit on all three. The mentor is paid for each trainee they bring through,
 * which is what turns mentorship from a favour into a role somebody actually
 * wants — and is the difference between a training programme that runs and one
 * that exists on paper.
 */
export default function FirstJobScreen() {
  const t = useT();
  const f = useFormat();
  const spec = useThemeSpec();

  return (
    <SafeAreaView className="flex-1" edges={["top", "left", "right"]}>
      <ScreenHeader title={t("screens.firstJob")} screenId="B5" showBack={false} />

      <ScrollView contentContainerClassName="gap-4 p-4">
        <Card className="gap-3 p-4">
          <Text variant="caption" tone="subtle">
            {t("join.shadowJobs")}
          </Text>
          <View className="flex-row gap-2">
            {SHADOW_JOBS.map((job) => (
              <View
                key={job.id}
                className="flex-1 items-center justify-center py-3"
                style={{ borderRadius: spec.radius }}
              >
                <Feather
                  name={job.done ? "check-circle" : "circle"}
                  size={28}
                  className={job.done ? "text-success" : "text-subtle"}
                />
                <Text
                  variant="caption"
                  tone={job.done ? "success" : "subtle"}
                  weight="600"
                >
                  {job.id}
                </Text>
              </View>
            ))}
          </View>
        </Card>

        <TaskCard
          title={t("technician.startStep")}
          place="Kothrud"
          distanceMetres={2400}
          minutes={45}
          paise={18000}
          acceptLabel={t("join.startNow")}
          onAccept={() => undefined}
        />

        <Card tone="surface" bordered={false} className="flex-row items-start gap-3 p-4">
          <Feather name="users" size={spec.textLarge} className="text-primary" />
          <Text variant="caption" tone="muted" className="flex-1">
            {t("join.shadowJobs")} · {f.paise(100000)}
          </Text>
        </Card>
      </ScrollView>

      <HelpBubble screenId="B5" />
      <RoleTabBar />
    </SafeAreaView>
  );
}
