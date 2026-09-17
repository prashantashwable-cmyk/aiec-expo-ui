import { useRouter } from "expo-router";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

import { HelpBubble, RoleTabBar } from "@/components/anatomy";
import { Card, ScreenHeader, Text } from "@/components/ui";
import { RIDER_SCHEDULE } from "@/contract/fixtures-detail";
import { useThemeSpec } from "@/design/theme-provider";
import { useFormat, useT } from "@/i18n";

const STATE_ICON = {
  done: "check-circle",
  now: "play-circle",
  upcoming: "circle",
  late: "alert-circle",
} as const;

const STATE_TONE = {
  done: "text-success",
  now: "text-primary",
  upcoming: "text-subtle",
  late: "text-danger",
} as const;

/**
 * R7 Schedule — layer 2.
 *
 * Law 3: the app runs the day. The rider does not decide what to do next; the
 * controller pushes the next task at the scheduled minute and the clock is
 * visible. The escalation ladder behind this is nudge at 15 minutes, warning
 * at 30, penalty at 60, reassignment at 90.
 */
export default function ScheduleScreen() {
  const t = useT();
  const f = useFormat();
  const router = useRouter();
  const spec = useThemeSpec();

  return (
    <SafeAreaView className="flex-1" edges={["top", "left", "right"]}>
      <ScreenHeader title={t("screens.schedule")} screenId="R7" showBack={false} />

      <ScrollView contentContainerClassName="gap-2 p-4">
        {RIDER_SCHEDULE.map((task) => (
          <Card
            key={task.id}
            className={`flex-row items-center gap-3 p-3 ${task.state === "now" ? "border-primary" : ""}`}
            onTouchEnd={() => router.push(`/rider/schedule/${task.id}` as never)}
          >
            <Feather
              name={STATE_ICON[task.state]}
              size={spec.textLarge}
              className={STATE_TONE[task.state]}
            />
            <View className="min-w-0 flex-1">
              <Text variant="body" numberOfLines={1}>
                {task.label}
              </Text>
              <Text variant="caption" tone="subtle">
                {f.time(task.at)} · {task.estimateMinutes} min
                {task.distanceMetres > 0 ? ` · ${f.distance(task.distanceMetres)}` : ""}
              </Text>
            </View>
            {task.paise > 0 ? (
              <Text variant="body" weight="600" tone="primary">
                {f.paise(task.paise)}
              </Text>
            ) : null}
          </Card>
        ))}
      </ScrollView>

      <HelpBubble screenId="R7" />
      <RoleTabBar />
    </SafeAreaView>
  );
}
