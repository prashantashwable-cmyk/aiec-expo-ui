import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

import { HelpBubble, MoneyMeter, RoleTabBar } from "@/components/anatomy";
import { Card, ScreenHeader, Text } from "@/components/ui";
import { useThemeSpec } from "@/design/theme-provider";
import { useFormat, useT } from "@/i18n";

/**
 * Q6 Earnings and rating — layer 2.
 *
 * The rate card is the anti-rubber-stamp mechanism made visible. Catching a
 * defect that is later confirmed pays a bonus; missing one that surfaces later
 * costs more than the inspection earned. Passing quickly is not the profitable
 * behaviour here — being correct is.
 */
const RATES = [
  { labelKey: "screens.shaftChecklist", paise: 45000, positive: true },
  { labelKey: "detail.opportunity", paise: 15000, positive: true },
  { labelKey: "screens.auditChecklist", paise: 80000, positive: true },
  { labelKey: "states.errorTitle", paise: -100000, positive: false },
] as const;

export default function QcEarningsScreen() {
  const t = useT();
  const f = useFormat();
  const spec = useThemeSpec();

  return (
    <SafeAreaView className="flex-1" edges={["top", "left", "right"]}>
      <ScreenHeader title={t("screens.earningsRating")} screenId="Q6" showBack={false} />

      <ScrollView>
        <MoneyMeter
          todayPaise={125000}
          pendingPaise={45000}
          clearedPaise={80000}
          toNextTierPaise={175000}
          tierProgress={0.41}
        />

        <View className="gap-2 px-4 pb-4">
          <Card className="flex-row items-center gap-3 p-4">
            <Feather name="target" size={spec.textDisplay} className="text-success" />
            <View className="flex-1">
              <Text variant="caption" tone="subtle">
                {t("owner.efficiencyIndex")}
              </Text>
              <Text variant="heading" weight="600" tone="success">
                {f.percent(96.4)}
              </Text>
            </View>
          </Card>

          {RATES.map((rate) => (
            <View
              key={rate.labelKey}
              className="flex-row items-center justify-between border-b border-line py-3"
            >
              <Text variant="body" tone="muted" className="flex-1">
                {t(rate.labelKey)}
              </Text>
              <Text
                variant="body"
                weight="600"
                tone={rate.positive ? "success" : "danger"}
              >
                {rate.positive ? "+" : ""}
                {f.paise(rate.paise)}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <HelpBubble screenId="Q6" />
      <RoleTabBar />
    </SafeAreaView>
  );
}
