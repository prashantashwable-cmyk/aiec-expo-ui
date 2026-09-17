import { useRouter } from "expo-router";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

import { HelpBubble, MoneyMeter, RoleTabBar } from "@/components/anatomy";
import { ListRow, ScreenHeader, Text } from "@/components/ui";
import { RIDER_DAY } from "@/contract/fixtures";
import { RIDER_LEDGER } from "@/contract/fixtures-detail";
import { useFormat, useT } from "@/i18n";

/**
 * R5 Earnings — layer 2.
 *
 * Law 4, layer 1 and 2 together: the credit that just landed, and how far the
 * next tier is. Every line carries its WLET id and opens the evidence that
 * earned it, which is what makes the wallet auditable by the worker rather
 * than something they have to take on trust.
 */
export default function EarningsScreen() {
  const t = useT();
  const f = useFormat();
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1" edges={["top", "left", "right"]}>
      <ScreenHeader title={t("screens.earnings")} screenId="R5" showBack={false} />

      <ScrollView>
        <MoneyMeter
          todayPaise={RIDER_DAY.todayPaise}
          pendingPaise={RIDER_DAY.pendingPaise}
          clearedPaise={RIDER_DAY.clearedPaise}
          toNextTierPaise={RIDER_DAY.toNextTierPaise}
          tierProgress={RIDER_DAY.tierProgress}
        />

        <View className="gap-2 px-4 pb-4">
          {RIDER_LEDGER.map((entry) => (
            <ListRow
              key={entry.id}
              title={entry.label}
              subtitle={entry.id}
              monoSubtitle
              meta={"+" + f.paise(entry.paise)}
              metaTone={entry.cleared ? "success" : "warning"}
              onPress={() => router.push(`/rider/earnings/${entry.id}` as never)}
            />
          ))}
        </View>

        <View className="mb-4 flex-row items-center gap-2 bg-surface px-4 py-3">
          <Feather name="calendar" size={16} className="text-muted" />
          <Text variant="label" tone="muted">
            {t("money.payoutCountdown", { days: 2 })}
          </Text>
        </View>
      </ScrollView>

      <HelpBubble screenId="R5" />
      <RoleTabBar />
    </SafeAreaView>
  );
}
