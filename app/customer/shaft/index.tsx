import { useRouter } from "expo-router";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ChecklistRow, HelpBubble, RoleTabBar } from "@/components/anatomy";
import { ScreenHeader, Text } from "@/components/ui";
import { CUSTOMER_SHAFT_ITEMS } from "@/contract/fixtures-detail";
import { useT } from "@/i18n";

/**
 * C3 Shaft readiness — layer 2.
 *
 * What the customer must build before anything can ship. Gate 2 sits at the
 * end of it: no QC clearance, no drawings, no material. Shaft-readiness delay
 * is the single largest source of SLA misses in the delay ledger, which is why
 * this screen is one tap from the customer home rather than buried.
 */
export default function ShaftReadinessScreen() {
  const t = useT();
  const router = useRouter();

  const outstanding = CUSTOMER_SHAFT_ITEMS.filter(
    (item) => item.verdict !== "pass",
  ).length;

  return (
    <SafeAreaView className="flex-1" edges={["top", "left", "right"]}>
      <ScreenHeader
        title={t("screens.shaftSop")}
        screenId="C3"
        subtitle={t("customer.stageOf", {
          current: CUSTOMER_SHAFT_ITEMS.length - outstanding,
          total: CUSTOMER_SHAFT_ITEMS.length,
        })}
        showBack={false}
      />

      <ScrollView contentContainerClassName="gap-2 p-4">
        {CUSTOMER_SHAFT_ITEMS.map((item) => (
          <View key={item.id} onTouchEnd={() => router.push(`/customer/shaft/${item.id}` as never)}>
            <ChecklistRow
              label={item.label}
              verdict={item.verdict}
              note={"note" in item ? item.note : undefined}
            />
          </View>
        ))}

        <Text variant="caption" tone="subtle" className="px-1 pt-2">
          {t("gates.qcUnblock")}
        </Text>
      </ScrollView>

      <HelpBubble screenId="C3" />
      <RoleTabBar />
    </SafeAreaView>
  );
}
