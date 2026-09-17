import { useRouter } from "expo-router";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { HelpBubble, MapShell, RoleTabBar } from "@/components/anatomy";
import { ListRow, ScreenHeader, Text } from "@/components/ui";
import { SALES_LEADS } from "@/contract/fixtures-console";
import { SALES_PIN_SET, ZONES } from "@/contract/geo";
import { useT } from "@/i18n";
import type { TranslationKey } from "@/i18n";

const BAND_TONE = {
  hot: "text-danger",
  warm: "text-warning",
  cold: "text-subtle",
} as const;

/**
 * S1 Pipeline map — layer 1 for sales.
 *
 * This role is roughly ninety percent machine. A single human desk exists only
 * to catch what the bot cannot close: negotiations below the discount line and
 * customers who explicitly ask for a person. So the map is a monitor, not a
 * worklist — most of these pins will never be touched by a human at all.
 */
export default function PipelineMapScreen() {
  const t = useT();
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1" edges={["top", "left", "right"]}>
      <ScreenHeader title={t("screens.pipelineMap")} screenId="S1" showBack={false} />

      <View className="h-52">
        <MapShell center={ZONES.KOT} zoom={12} pins={SALES_PIN_SET} />
      </View>

      <ScrollView contentContainerClassName="gap-2 p-3">
        {SALES_LEADS.map((lead) => (
          <ListRow
            key={lead.id}
            title={lead.site}
            subtitle={lead.id}
            monoSubtitle
            icon={lead.escalated ? "headphones" : "cpu"}
            iconTone={lead.escalated ? "text-warning" : BAND_TONE[lead.band]}
            meta={t(`console.${lead.band}` as TranslationKey)}
            metaTone={lead.band === "hot" ? "danger" : lead.band === "warm" ? "warning" : "subtle"}
            onPress={() => router.push(`/sales/leads/${lead.id}` as never)}
          />
        ))}

        <Text variant="caption" tone="subtle" className="px-1 pt-1">
          {t("console.escalated")}
        </Text>
      </ScrollView>

      <HelpBubble screenId="S1" />
      <RoleTabBar />
    </SafeAreaView>
  );
}
