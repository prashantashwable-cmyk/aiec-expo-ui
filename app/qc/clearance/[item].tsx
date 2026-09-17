import { useLocalSearchParams } from "expo-router";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

import { EvidenceGrid, HelpBubble } from "@/components/anatomy";
import { EmptyState } from "@/components/states";
import { Button, Card, Pill, ScreenHeader, Text } from "@/components/ui";
import { LEAD_EVIDENCE, QC_SHAFT_CHECKLIST } from "@/contract/fixtures-detail";
import { useThemeSpec } from "@/design/theme-provider";
import { useT } from "@/i18n";
import type { TranslationKey } from "@/i18n";

const VERDICTS = ["pass", "conditional", "fail"] as const;

/**
 * Q2.1 Check detail — layer 3.
 *
 * One item, its verdict, its mandatory photo and its mandatory note when the
 * verdict is not a pass. The help button on this screen shows the correct and
 * incorrect reference pair for this specific check, which is what stops the
 * checklist becoming a memory test.
 */
export default function ChecklistItemScreen() {
  const t = useT();
  const spec = useThemeSpec();
  const { item: id } = useLocalSearchParams<{ item: string }>();
  const item = QC_SHAFT_CHECKLIST.find((i) => i.id === id);

  if (!item) {
    return (
      <SafeAreaView className="flex-1" edges={["top", "left", "right"]}>
        <ScreenHeader title={t("screens.checklistItem")} screenId="Q2.1" />
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
      <ScreenHeader title={item.group} screenId="Q2.1" subtitle={item.id} />

      <ScrollView contentContainerClassName="gap-4 p-4">
        <Card className="gap-2 p-4">
          <Text variant="heading" weight="600">
            {item.label}
          </Text>
          {item.note ? (
            <Text
              variant="body"
              tone={item.verdict === "fail" ? "danger" : "warning"}
            >
              {item.note}
            </Text>
          ) : null}
        </Card>

        <View className="flex-row gap-2">
          {VERDICTS.map((verdict) => (
            <View key={verdict} className="flex-1">
              <Pill
                label={t(`verdict.${verdict}` as TranslationKey)}
                tone={
                  item.verdict === verdict
                    ? verdict === "pass"
                      ? "success"
                      : verdict === "fail"
                        ? "danger"
                        : "warning"
                    : "neutral"
                }
              />
            </View>
          ))}
        </View>

        <View
          className="items-center justify-center bg-surface"
          style={{ height: 180, borderRadius: spec.radius }}
        >
          <Feather name="camera" size={40} className="text-primary" />
          <Text variant="caption" tone="muted">
            {t("technician.requiredEvidence")}
          </Text>
        </View>

        {item.verdict !== "pending" ? (
          <View className="gap-2">
            <Text variant="caption" tone="muted">
              {t("detail.evidence")}
            </Text>
            <EvidenceGrid items={LEAD_EVIDENCE.slice(0, 1)} />
          </View>
        ) : null}

        <Button label={t("common.submit")} onPress={() => undefined} />
      </ScrollView>

      <HelpBubble screenId="Q2.1" />
    </SafeAreaView>
  );
}
