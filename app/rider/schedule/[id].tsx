import { useLocalSearchParams, useRouter } from "expo-router";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { HelpBubble, TaskCard } from "@/components/anatomy";
import { EmptyState } from "@/components/states";
import { Card, ScreenHeader, Text } from "@/components/ui";
import { RIDER_SCHEDULE, RIDER_ZONES } from "@/contract/fixtures-detail";
import { useFormat, useT } from "@/i18n";
import type { TranslationKey } from "@/i18n";

/** The escalation ladder from Law 3, shown so the clock is never a surprise. */
const LADDER = [
  { minutes: 15, labelKey: "escalation.nudge" },
  { minutes: 30, labelKey: "escalation.warning" },
  { minutes: 60, labelKey: "escalation.penalty" },
  { minutes: 90, labelKey: "escalation.reassign" },
] as const satisfies ReadonlyArray<{ minutes: number; labelKey: TranslationKey }>;

/**
 * R7.1 Task detail — layer 3.
 *
 * The task as a Law 5 card, plus the escalation ladder that governs it. The
 * ladder is shown rather than hidden because a penalty a worker could not see
 * coming reads as arbitrary, and an arbitrary penalty costs more in trust than
 * it recovers in punctuality.
 */
export default function TaskDetailScreen() {
  const t = useT();
  const f = useFormat();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const task = RIDER_SCHEDULE.find((s) => s.id === id);
  const zone = RIDER_ZONES.find((z) => z.code === task?.zone);

  if (!task) {
    return (
      <SafeAreaView className="flex-1" edges={["top", "left", "right"]}>
        <ScreenHeader title={t("screens.taskDetail")} screenId="R7.1" />
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
      <ScreenHeader title={t("screens.taskDetail")} screenId="R7.1" subtitle={task.id} />

      <ScrollView contentContainerClassName="gap-4 p-4">
        <TaskCard
          title={task.label}
          place={zone?.name ?? task.zone}
          distanceMetres={task.distanceMetres}
          minutes={task.estimateMinutes}
          paise={task.paise}
          acceptLabel={t("rider.captureLead")}
          onAccept={() => router.push("/rider/capture" as never)}
          onSkip={() => router.back()}
        />

        <Card tone="surface" bordered={false} className="gap-3 p-4">
          <Text variant="caption" tone="muted">
            {f.time(task.at)}
          </Text>
          {LADDER.map((rung) => (
            <View key={rung.minutes} className="flex-row items-center gap-3">
              <Text
                variant="caption"
                weight="600"
                tone="subtle"
                style={{ width: 56 }}
              >
                +{rung.minutes} min
              </Text>
              <View className="h-px flex-1 bg-line" />
              <Text variant="caption" tone={rung.minutes >= 60 ? "danger" : "warning"}>
                {t(rung.labelKey)}
              </Text>
            </View>
          ))}
        </Card>
      </ScrollView>

      <HelpBubble screenId="R7.1" />
    </SafeAreaView>
  );
}
