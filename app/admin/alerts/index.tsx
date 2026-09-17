import { useRouter } from "expo-router";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

import { HelpBubble, RoleTabBar } from "@/components/anatomy";
import { EmptyState } from "@/components/states";
import { Card, Pill, ScreenHeader, Text } from "@/components/ui";
import { ADMIN_ALERT_QUEUE } from "@/contract/fixtures-console";
import { useFormat, useT } from "@/i18n";

const PRIORITY_TONE = {
  P0: "danger",
  P1: "warning",
  P2: "warning",
  P3: "muted",
} as const;

const PRIORITY_BORDER = {
  P0: "border-l-danger",
  P1: "border-l-warning",
  P2: "border-l-warning",
  P3: "border-l-line",
} as const;

/**
 * A2 Alert queue — layer 2, and the admin job.
 *
 * One prioritised list, worked top-down until it is empty. Every card carries
 * what the system already did automatically and two or three one-tap
 * decisions, because the target is a median resolution under ninety seconds.
 *
 * An empty queue is the success state, not a bug — if the admin is watching
 * things go right, the automation has failed.
 */
export default function AlertQueueScreen() {
  const t = useT();
  const f = useFormat();
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1" edges={["top", "left", "right"]}>
      <ScreenHeader
        title={t("screens.alertQueue")}
        screenId="A2"
        subtitle={t("admin.medianResolution", { seconds: 71 })}
        showBack={false}
      />

      {ADMIN_ALERT_QUEUE.length === 0 ? (
        <EmptyState
          icon="check-circle"
          title={t("states.emptyTitle")}
          body={t("admin.systemAlreadyDid")}
        />
      ) : (
        <ScrollView contentContainerClassName="gap-2 p-3">
          {ADMIN_ALERT_QUEUE.map((alert) => (
            <Card
              key={alert.id}
              bordered={false}
              className={"border-l-4 bg-surface-raised p-3 " + PRIORITY_BORDER[alert.priority]}
              style={{ borderRadius: 0 }}
              onTouchEnd={() => router.push(`/admin/alerts/${alert.id}` as never)}
            >
              <View className="flex-row items-center justify-between gap-2">
                <Text variant="caption" weight="600" tone={PRIORITY_TONE[alert.priority]}>
                  {alert.priority + " · " + alert.title}
                </Text>
                <Text variant="caption" tone="subtle">
                  {f.time(alert.at)}
                </Text>
              </View>

              <Text variant="body" className="mt-1">
                {alert.detail}
              </Text>

              <View className="mt-1.5 flex-row items-start gap-1.5">
                <Feather name="cpu" size={13} className="text-subtle" />
                <Text variant="caption" tone="subtle" className="flex-1">
                  {alert.autoAction}
                </Text>
              </View>

              <View className="mt-2 flex-row flex-wrap gap-1.5">
                {alert.decisions.length > 0 ? (
                  alert.decisions.map((decision) => (
                    <Pill key={decision} label={decision} />
                  ))
                ) : (
                  <Pill label={t("admin.awaitingOwner")} tone="neutral" />
                )}
              </View>
            </Card>
          ))}
        </ScrollView>
      )}

      <HelpBubble screenId="A2" />
      <RoleTabBar />
    </SafeAreaView>
  );
}
