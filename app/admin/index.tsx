import { useRouter } from "expo-router";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { HelpBubble, MapShell, RoleTabBar } from "@/components/anatomy";
import { Card, LanguageSwitch, Pill, ScreenHeader, Text } from "@/components/ui";
import { ADMIN_MAP } from "@/contract/fixtures";
import { CITY_PINS, PUNE } from "@/contract/geo";
import { MAP_COLORS } from "@/design/palette";
import { MAP_LEGEND } from "@/design/themes";
import { useFormat, useT } from "@/i18n";
import type { TranslationKey } from "@/i18n";

const FILTERS = ["admin.alertsOnly", "screens.roleMonitors", "screens.analytics"] as const;

/**
 * A1 Live city map — layer 1 for admin.
 *
 * Everything, live, on Pune. Red pins pulse; everything else stays calm. The
 * console shows exceptions, not operations — a dashboard displaying four
 * hundred healthy jobs is a dashboard nobody can monitor.
 */
export default function AdminCityMapScreen() {
  const t = useT();
  const f = useFormat();
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1" edges={["top", "left", "right"]}>
      <ScreenHeader
        title={t("screens.cityMap")}
        screenId="A1"
        subtitle="Pune"
        showBack={false}
        trailing={
          <View className="flex-row items-center gap-1.5">
            <Pill label={"P0 " + ADMIN_MAP.counts.p0} tone="danger" />
            <Pill label={"P1 " + ADMIN_MAP.counts.p1} tone="warning" />
            <LanguageSwitch />
          </View>
        }
      />

      <View className="flex-row gap-1.5 border-b border-line px-3 py-2">
        {FILTERS.map((key) => (
          <Pill key={key} label={t(key as TranslationKey)} />
        ))}
      </View>

      <View className="flex-1">
        <MapShell center={PUNE} zoom={11} pins={CITY_PINS} />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-3 px-3 py-2"
        className="border-t border-line"
      >
        {MAP_LEGEND.map((status) => (
          <View key={status} className="flex-row items-center gap-1.5">
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: MAP_COLORS[status],
              }}
            />
            <Text variant="caption" tone="muted">
              {t(`mapStatus.${status}` as TranslationKey)}
            </Text>
          </View>
        ))}
      </ScrollView>

      <View className="flex-row border-t border-line">
        <Card tone="surface" bordered={false} className="flex-1 px-3 py-2">
          <Text variant="caption" tone="subtle">
            {t("owner.cashLive")}
          </Text>
          <Text variant="body" weight="600">
            {f.paise(ADMIN_MAP.money.tokensPaise)}
          </Text>
        </Card>
        <Card tone="surface" bordered={false} className="flex-1 px-3 py-2">
          <Text variant="caption" tone="subtle">
            {t("money.pending")}
          </Text>
          <Text variant="body" weight="600">
            {f.paise(ADMIN_MAP.money.escrowPaise)}
          </Text>
        </Card>
        <Card tone="surface" bordered={false} className="flex-1 px-3 py-2">
          <Text variant="caption" tone="subtle">
            {t("owner.target")
              .replace("{{value}}", f.percent(ADMIN_MAP.money.rewardCapLimit))}
          </Text>
          <Text variant="body" weight="600" tone="success">
            {f.percent(ADMIN_MAP.money.rewardCapUsed)}
          </Text>
        </Card>
      </View>

      <HelpBubble screenId="A1" onOpen={() => router.push("/admin/alerts" as never)} />
      <RoleTabBar />
    </SafeAreaView>
  );
}
