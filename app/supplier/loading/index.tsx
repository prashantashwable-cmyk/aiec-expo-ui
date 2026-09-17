import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

import { EvidenceGrid, HelpBubble, RoleTabBar } from "@/components/anatomy";
import { Button, Card, ScreenHeader, Text } from "@/components/ui";
import { LEAD_EVIDENCE } from "@/contract/fixtures-detail";
import { useThemeSpec } from "@/design/theme-provider";
import { useT } from "@/i18n";
import type { TranslationKey } from "@/i18n";

const SENSORS = [
  { icon: "map-pin", labelKey: "container.gps" },
  { icon: "activity", labelKey: "container.motion" },
  { icon: "lock", labelKey: "container.door" },
  { icon: "video", labelKey: "container.cctv" },
] as const satisfies ReadonlyArray<{
  icon: keyof typeof Feather.glyphMap;
  labelKey: TranslationKey;
}>;

/**
 * P3 Container loading — layer 2.
 *
 * Every kit scanned in, a photo of the loaded container, the digital seal
 * applied, then the IoT array armed. From that moment the container reports
 * its own position, motion, door state and interior — which is what lets the
 * company carry no inventory while still being able to prove who controlled
 * the goods at any minute.
 */
export default function ContainerLoadingScreen() {
  const t = useT();
  const spec = useThemeSpec();

  return (
    <SafeAreaView className="flex-1" edges={["top", "left", "right"]}>
      <ScreenHeader title={t("screens.containerLoading")} screenId="P3" showBack={false} />

      <ScrollView contentContainerClassName="gap-4 p-4">
        <View className="gap-2">
          <Text variant="caption" tone="muted">
            {t("detail.evidence")}
          </Text>
          <EvidenceGrid items={LEAD_EVIDENCE} />
        </View>

        <View className="flex-row flex-wrap gap-2">
          {SENSORS.map((sensor) => (
            <Card
              key={sensor.labelKey}
              tone="surface"
              bordered={false}
              className="flex-row items-center gap-2 px-3 py-2"
            >
              <Feather name={sensor.icon} size={spec.textBase} className="text-success" />
              <Text variant="caption" tone="muted">
                {t(sensor.labelKey)}
              </Text>
            </Card>
          ))}
        </View>

        <Card className="gap-2 p-4">
          <Text variant="caption" tone="subtle">
            {t("customer.containerLocked")}
          </Text>
          <Text variant="body" tone="muted">
            {t("gates.dispatchBlocks")}
          </Text>
        </Card>

        <Button label={t("console.sealAndArm")} onPress={() => undefined} />
      </ScrollView>

      <HelpBubble screenId="P3" />
      <RoleTabBar />
    </SafeAreaView>
  );
}
