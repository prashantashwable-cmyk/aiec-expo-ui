import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

import { HelpBubble } from "@/components/anatomy";
import { BlockedByGateState } from "@/components/states";
import { Card, ScreenHeader, Text } from "@/components/ui";
import { useThemeColor, useThemeSpec } from "@/design/theme-provider";
import { useT } from "@/i18n";

const TRIALS = Array.from({ length: 10 }, (_, i) => ({
  run: i + 1,
  done: i < 6,
}));

/**
 * C8 Handover and NOC — layer 2.
 *
 * Gate 5. Ten trial runs, then the final ten percent, then the NOC — in that
 * order and no other. The certificate is a real document with its own ID and a
 * verifiable QR, which is why it cannot be issued early as a goodwill gesture:
 * the moment one customer gets the NOC without paying, every gate in the
 * system becomes negotiable.
 */
export default function HandoverScreen() {
  const t = useT();
  const spec = useThemeSpec();
  const doneColor = useThemeColor("--success");
  const pendingColor = useThemeColor("--surface");
  const completed = TRIALS.filter((trial) => trial.done).length;

  return (
    <SafeAreaView className="flex-1" edges={["top", "left", "right"]}>
      <ScreenHeader title={t("screens.handoverNoc")} screenId="C8" />

      <ScrollView contentContainerClassName="gap-4 p-4">
        <Card className="gap-3 p-4">
          <View className="flex-row items-baseline justify-between">
            <Text variant="body" weight="600">
              {t("screens.trialRuns")}
            </Text>
            <Text variant="caption" tone="muted">
              {completed} / {TRIALS.length}
            </Text>
          </View>

          <View className="flex-row flex-wrap gap-2">
            {TRIALS.map((trial) => (
              <View
                key={trial.run}
                className="items-center justify-center"
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: spec.radius,
                  backgroundColor: trial.done ? doneColor : pendingColor,
                }}
              >
                <Text
                  variant="caption"
                  weight="600"
                  tone={trial.done ? "onPrimary" : "subtle"}
                >
                  {trial.run}
                </Text>
              </View>
            ))}
          </View>
        </Card>

        <BlockedByGateState gate="finalPayment" />

        <Card tone="surface" bordered={false} className="flex-row items-center gap-3 p-4">
          <Feather name="award" size={spec.textDisplay} className="text-subtle" />
          <View className="flex-1">
            <Text variant="body" tone="muted">
              {t("customer.noc")}
            </Text>
            <Text variant="caption" tone="subtle">
              {t("customer.locked")}
            </Text>
          </View>
        </Card>
      </ScrollView>

      <HelpBubble screenId="C8" />
    </SafeAreaView>
  );
}
