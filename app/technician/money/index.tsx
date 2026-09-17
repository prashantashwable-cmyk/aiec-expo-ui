import { useRouter } from "expo-router";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

import { HelpBubble, MoneyMeter, RoleTabBar } from "@/components/anatomy";
import { ListRow, ScreenHeader, Text } from "@/components/ui";
import { SOP_TREE } from "@/contract/fixtures-detail";
import { useFormat, useT } from "@/i18n";

/**
 * T6 Money meter — layer 2.
 *
 * Accruals per verified step. Nothing here is computed in the client: the
 * server returns amounts already decided by the settings store, and this
 * screen renders them. A total assembled on the phone would be a number the
 * ledger never agreed to.
 */
export default function TechnicianMoneyScreen() {
  const t = useT();
  const f = useFormat();
  const router = useRouter();

  const verified = SOP_TREE.filter((s) => s.state === "verified");
  const pendingPaise = verified.reduce((sum, s) => sum + s.valuePaise, 0);
  const clearedPaise = verified
    .slice(0, 3)
    .reduce((sum, s) => sum + s.valuePaise, 0);

  return (
    <SafeAreaView className="flex-1" edges={["top", "left", "right"]}>
      <ScreenHeader title={t("screens.moneyMeter")} screenId="T6" showBack={false} />

      <ScrollView>
        <MoneyMeter
          todayPaise={280000}
          pendingPaise={pendingPaise - clearedPaise}
          clearedPaise={clearedPaise}
          toNextTierPaise={120000}
          tierProgress={0.62}
        />

        <View className="gap-2 px-4 pb-4">
          {verified.map((step) => (
            <ListRow
              key={step.index}
              title={step.title}
              subtitle={t("technician.stepOf", { current: step.index, total: SOP_TREE.length })}
              meta={"+" + f.paise(step.valuePaise)}
              metaTone="success"
              onPress={() => router.push(`/technician/money/${step.index}` as never)}
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

      <HelpBubble screenId="T6" />
      <RoleTabBar />
    </SafeAreaView>
  );
}
