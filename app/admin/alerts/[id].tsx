import { useLocalSearchParams } from "expo-router";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

import { EvidenceGrid, HelpBubble, Timeline } from "@/components/anatomy";
import { EmptyState } from "@/components/states";
import { Button, Card, Pill, ScreenHeader, Text } from "@/components/ui";
import { ADMIN_ALERT_QUEUE } from "@/contract/fixtures-console";
import { LEAD_EVIDENCE } from "@/contract/fixtures-detail";
import { useThemeSpec } from "@/design/theme-provider";
import { useFormat, useT } from "@/i18n";

/**
 * A2.1 Alert detail — layer 3.
 *
 * The ID, the evidence, what the system already did, and the small number of
 * decisions a machine should not make alone. Every decision requires a written
 * reason and is written permanently to the audit log with the admin ID and a
 * server timestamp — the admin is audited too.
 */
export default function AlertDetailScreen() {
  const t = useT();
  const f = useFormat();
  const spec = useThemeSpec();
  const { id } = useLocalSearchParams<{ id: string }>();
  const alert = ADMIN_ALERT_QUEUE.find((a) => a.id === id);

  if (!alert) {
    return (
      <SafeAreaView className="flex-1" edges={["top", "left", "right"]}>
        <ScreenHeader title={t("screens.alertDetail")} screenId="A2.1" />
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
      <ScreenHeader title={alert.title} screenId="A2.1" subtitle={alert.id} />

      <ScrollView contentContainerClassName="gap-4 p-4">
        <View className="flex-row items-center gap-2">
          <Pill
            label={alert.priority}
            tone={alert.priority === "P0" ? "danger" : "warning"}
          />
          <Text variant="caption" tone="subtle">
            {f.date(alert.at)} · {f.time(alert.at)}
          </Text>
        </View>

        <Card className="gap-2 p-4">
          <Text variant="body">{alert.detail}</Text>
        </Card>

        <Card tone="surface" bordered={false} className="flex-row items-start gap-3 p-4">
          <Feather name="cpu" size={spec.textLarge} className="text-success" />
          <View className="flex-1">
            <Text variant="caption" tone="subtle">
              {t("admin.systemAlreadyDid")}
            </Text>
            <Text variant="body">{alert.autoAction}</Text>
          </View>
        </Card>

        <View className="gap-2">
          <Text variant="caption" tone="muted">
            {t("detail.evidence")}
          </Text>
          <EvidenceGrid items={LEAD_EVIDENCE.slice(0, 2)} />
        </View>

        <View className="gap-3">
          <Text variant="caption" tone="muted">
            {t("detail.timeline")}
          </Text>
          <Timeline
            entries={[
              {
                id: alert.id,
                label: alert.title,
                at: alert.at,
                icon: "alert-circle",
                tone: alert.priority === "P0" ? "danger" : "warning",
              },
              {
                id: alert.id + "-AUTO",
                label: alert.autoAction,
                at: alert.at,
                icon: "cpu",
                tone: "success",
              },
            ]}
          />
        </View>

        {alert.actionable ? (
          <View className="gap-2">
            <Text variant="caption" tone="subtle">
              {t("console.auditedToo")}
            </Text>
            <View className="flex-row gap-2">
              {alert.decisions.map((decision) => (
                <View key={decision} className="flex-1">
                  <Button
                    label={decision}
                    variant="secondary"
                    size="small"
                    onPress={() => undefined}
                  />
                </View>
              ))}
            </View>
          </View>
        ) : (
          <Card tone="gate" className="flex-row items-center gap-3 p-4">
            <Feather name="lock" size={spec.textLarge} className="text-gate" />
            <Text variant="caption" tone="gate" className="flex-1">
              {t("console.noOverrideAdmin")}
            </Text>
          </Card>
        )}
      </ScrollView>

      <HelpBubble screenId="A2.1" />
    </SafeAreaView>
  );
}
