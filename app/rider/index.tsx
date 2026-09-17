import { useRouter } from "expo-router";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

import { DemoRibbon, HelpBubble, MapShell, RoleTabBar } from "@/components/anatomy";
import { OfflineBanner } from "@/components/states";
import { Button, LanguageSwitch, Text } from "@/components/ui";
import { RIDER_DAY } from "@/contract/fixtures";
import { RIDER_HEAT, RIDER_PINS, RIDER_SELF, RIDER_TRAIL, ZONES } from "@/contract/geo";
import { useFormat, useT } from "@/i18n";

/**
 * R1 Ride map, the rider home screen. Sunlight theme.
 *
 * One action on screen. The capture button is 72px and full width because the
 * rider is helmeted, one-handed and in glare; research puts the gloved floor
 * at 44px, so this is not generosity but the working minimum for the
 * conditions. No menu, no list view, no second call to action.
 */
export default function RideMapScreen() {
  const t = useT();
  const f = useFormat();
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1" edges={["top", "left", "right"]}>
      <DemoRibbon trailing={<LanguageSwitch />} />

      <View className="flex-row items-baseline justify-between gap-3 bg-surface px-4 py-2">
        <Text variant="body" weight="600" numberOfLines={1}>
          {t("rider.leadsToday", { count: RIDER_DAY.leadsToday })}
        </Text>
        <Text variant="label" tone="muted" numberOfLines={1}>
          {f.distance(RIDER_DAY.metresToday)}
        </Text>
        <Text variant="heading" weight="600" tone="primary" numberOfLines={1}>
          {f.paise(RIDER_DAY.todayPaise)}
        </Text>
      </View>

      {!RIDER_DAY.online ? <OfflineBanner queued={RIDER_DAY.queuedPhotos} /> : null}

      <MapShell
        center={ZONES.KOT}
        zoom={14}
        pins={RIDER_PINS}
        trail={RIDER_TRAIL}
        heat={RIDER_HEAT}
        self={RIDER_SELF}
      >
        <View className="absolute left-3 top-3 flex-row items-center gap-2 rounded-full bg-surface-raised px-3 py-1.5">
          <Feather name="zap" size={14} className="text-warning" />
          <Text variant="caption" weight="500" tone="warning">
            {t("rider.hotZoneNear", { distance: f.distance(RIDER_DAY.hotZoneMetres) })}
          </Text>
        </View>
      </MapShell>

      <View className="px-4 pb-4 pt-3">
        <Button
          label={t("rider.captureLead")}
          leading={<Feather name="camera" size={26} className="text-primary-foreground" />}
          onPress={() => router.push("/rider/capture")}
        />
      </View>

      <HelpBubble screenId="R1" />
      <RoleTabBar />
    </SafeAreaView>
  );
}
