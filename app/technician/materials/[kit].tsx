import { useLocalSearchParams } from "expo-router";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

import { EvidenceGrid, HelpBubble } from "@/components/anatomy";
import { BlockedByGateState, EmptyState } from "@/components/states";
import { Card, Pill, ScreenHeader, Text } from "@/components/ui";
import { SOP_TREE, TECHNICIAN_KITS } from "@/contract/fixtures-detail";
import { useThemeSpec } from "@/design/theme-provider";
import { useT } from "@/i18n";

/**
 * T5.1 Kit detail — layer 3.
 *
 * A sealed pouch shows the gate that holds it, not a disabled button. An open
 * pouch shows the opening photo that was required to break the seal, which is
 * the record that makes the contents attributable to one person at one minute.
 */
export default function KitDetailScreen() {
  const t = useT();
  const spec = useThemeSpec();
  const { kit: code } = useLocalSearchParams<{ kit: string }>();
  const kit = TECHNICIAN_KITS.find((k) => k.code === code);
  const step = SOP_TREE.find((s) => s.index === kit?.unlocksAtStep);

  if (!kit) {
    return (
      <SafeAreaView className="flex-1" edges={["top", "left", "right"]}>
        <ScreenHeader title={t("screens.kitDetail")} screenId="T5.1" />
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
      <ScreenHeader title={kit.code} screenId="T5.1" subtitle={kit.id} />

      <ScrollView contentContainerClassName="gap-4 p-4">
        <View className="flex-row items-center justify-between">
          <Pill
            label={
              kit.state === "sealed"
                ? t("detail.sealed")
                : kit.state === "open"
                  ? t("detail.opened")
                  : t("detail.consumed")
            }
            tone={kit.state === "open" ? "primary" : kit.state === "consumed" ? "success" : "neutral"}
          />
          <Text variant="caption" tone="muted">
            {t("detail.unlocksAt", { step: kit.unlocksAtStep })}
          </Text>
        </View>

        <Card className="gap-2 p-4">
          <Text variant="caption" tone="subtle">
            {t("screens.materials")}
          </Text>
          <Text variant="body">{kit.contents}</Text>
          {step ? (
            <View className="flex-row items-center gap-2 pt-1">
              <Feather name="corner-down-right" size={spec.textBase} className="text-subtle" />
              <Text variant="caption" tone="muted">
                {step.title}
              </Text>
            </View>
          ) : null}
        </Card>

        {kit.state === "sealed" ? (
          <BlockedByGateState
            gate="verifiedEvidence"
            detail={t("detail.unlocksAt", { step: kit.unlocksAtStep })}
          />
        ) : (
          <View className="gap-2">
            <Text variant="caption" tone="muted">
              {t("detail.evidence")}
            </Text>
            <EvidenceGrid
              items={[
                { id: kit.id + "-OPEN", label: kit.code, status: "passed" },
              ]}
            />
          </View>
        )}
      </ScrollView>

      <HelpBubble screenId="T5.1" />
    </SafeAreaView>
  );
}
