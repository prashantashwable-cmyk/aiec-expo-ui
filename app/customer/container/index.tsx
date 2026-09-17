import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

import { HelpBubble, MapShell, RoleTabBar, Timeline } from "@/components/anatomy";
import { BlockedByGateState } from "@/components/states";
import { Card, ScreenHeader, Text } from "@/components/ui";
import { CUSTOMER_LIFT } from "@/contract/fixtures";
import { CONTAINER_ROUTE, PUNE } from "@/contract/geo";
import { useThemeSpec } from "@/design/theme-provider";
import { useFormat, useT } from "@/i18n";
import type { TranslationKey } from "@/i18n";

const SENSORS = [
  { icon: "map-pin", labelKey: "container.gps" },
  { icon: "activity", labelKey: "container.motion" },
  { icon: "lock", labelKey: "container.door" },
  { icon: "video", labelKey: "container.cctv" },
] as const satisfies ReadonlyArray<{ icon: keyof typeof Feather.glyphMap; labelKey: TranslationKey }>;

/**
 * C6 Live container — layer 2.
 *
 * The customer watches their own material move. The triple-key seal and the
 * IoT array are shown as status rather than marketing: this is the screen the
 * customer opens when they want to know where their five and a half lakh
 * rupees of material physically is.
 */
export default function LiveContainerScreen() {
  const t = useT();
  const f = useFormat();
  const spec = useThemeSpec();

  return (
    <SafeAreaView className="flex-1" edges={["top", "left", "right"]}>
      <ScreenHeader title={t("screens.liveContainer")} screenId="C6" showBack={false} />

      <View className="h-52">
        <MapShell
          center={PUNE}
          zoom={11}
          pins={[
            {
              id: "MH-PUN-KOT-CONT-0112-R",
              ...CONTAINER_ROUTE[CONTAINER_ROUTE.length - 2],
              status: "transit",
            },
          ]}
          trail={CONTAINER_ROUTE}
        />
      </View>

      <ScrollView contentContainerClassName="gap-4 p-4">
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

        <BlockedByGateState
          gate="preDispatchPayment"
          actionLabel={t("customer.payNow")}
          onAction={() => undefined}
        />

        <View className="gap-3">
          <Text variant="caption" tone="muted">
            {t("detail.timeline")}
          </Text>
          <Timeline
            entries={[
              {
                id: "MH-PUN-KOT-CONT-0112-R",
                label: t("customer.materialArrived"),
                at: CUSTOMER_LIFT.arrivedAt,
                icon: "truck",
                tone: "success",
              },
              {
                id: "MH-PUN-KOT-PAYT-0502-B",
                label: t("customer.windowCloses", {
                  hours: CUSTOMER_LIFT.hoursToWindowClose,
                }),
                at: CUSTOMER_LIFT.arrivedAt,
                icon: "clock",
                tone: "warning",
              },
            ]}
          />
        </View>

        <Text variant="caption" tone="subtle">
          {f.paise(CUSTOMER_LIFT.duePaise)}
        </Text>
      </ScrollView>

      <HelpBubble screenId="C6" />
      <RoleTabBar />
    </SafeAreaView>
  );
}
