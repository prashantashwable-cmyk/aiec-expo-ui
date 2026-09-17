import { useLocalSearchParams } from "expo-router";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { HelpBubble, Timeline } from "@/components/anatomy";
import { BlockedByGateState, EmptyState } from "@/components/states";
import { Button, Card, Pill, ScreenHeader, Text } from "@/components/ui";
import { PINK_SETTINGS } from "@/contract/fixtures-console";
import { useThemeSpec } from "@/design/theme-provider";
import { useFormat, useT } from "@/i18n";

/**
 * A7.1 Setting detail — layer 3.
 *
 * One tunable value, its range, who last changed it and from when. The
 * effective date is the load-bearing part: a config change applies forward
 * only, so reopening a closed job shows the money it ran under rather than
 * the money it would earn today. That property is the one most likely to break
 * silently, which is why the date is shown on every change rather than buried
 * in a history tab.
 */
export default function SettingDetailScreen() {
  const t = useT();
  const f = useFormat();
  const spec = useThemeSpec();
  const { key } = useLocalSearchParams<{ key: string }>();
  const setting = PINK_SETTINGS.find((s) => s.key === decodeURIComponent(key ?? ""));

  if (!setting) {
    return (
      <SafeAreaView className="flex-1" edges={["top", "left", "right"]}>
        <ScreenHeader title={t("screens.settingDetail")} screenId="A7.1" />
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
      <ScreenHeader
        title={t("screens.settingDetail")}
        screenId="A7.1"
        subtitle={setting.key}
      />

      <ScrollView contentContainerClassName="gap-4 p-4">
        <Card className="gap-2 p-4">
          <Text variant="caption" tone="subtle" style={{ fontFamily: "monospace" }}>
            {setting.key}
          </Text>
          <View className="flex-row items-baseline gap-2">
            <Text variant="display" weight="600">
              {setting.value}
            </Text>
            <Text variant="body" tone="muted">
              {setting.unit}
            </Text>
          </View>
          <Text variant="caption" tone="subtle">
            {setting.min} – {setting.max}
          </Text>
        </Card>

        <Card tone="surface" bordered={false} className="gap-2 p-4">
          <View className="flex-row items-center justify-between">
            <Text variant="caption" tone="subtle">
              {t("console.effectiveFrom")}
            </Text>
            <Text variant="body">{f.date(setting.effectiveFrom)}</Text>
          </View>
          <View className="flex-row items-center justify-between">
            <Text variant="caption" tone="subtle">
              {t("console.reason")}
            </Text>
            <Text variant="body">{setting.changedBy}</Text>
          </View>
        </Card>

        <View className="gap-3">
          <Text variant="caption" tone="muted">
            {t("detail.timeline")}
          </Text>
          <Timeline
            entries={[
              {
                id: setting.key,
                label: `${setting.value} ${setting.unit}`,
                at: setting.effectiveFrom,
                actor: setting.changedBy,
                icon: "sliders",
                tone: "success",
              },
            ]}
          />
        </View>

        {setting.ownerOnly ? (
          <BlockedByGateState gate="token" detail={t("console.noOverrideAdmin")} />
        ) : (
          <View className="gap-2">
            <Card tone="surface" bordered={false} className="gap-2 p-4">
              <Text variant="caption" tone="subtle">
                {t("console.reason")}
              </Text>
              <View
                className="border border-line bg-background"
                style={{ height: 64, borderRadius: spec.radius }}
              />
            </Card>
            <Button label={t("common.submit")} size="small" onPress={() => undefined} />
            <Text variant="caption" tone="subtle">
              {t("console.auditedToo")}
            </Text>
          </View>
        )}

        <Pill label={setting.ownerOnly ? t("console.ownerOnly") : t("roles.admin")} />
      </ScrollView>

      <HelpBubble screenId="A7.1" />
    </SafeAreaView>
  );
}
