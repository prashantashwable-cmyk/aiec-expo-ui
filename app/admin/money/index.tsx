import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

import { HelpBubble, RoleTabBar } from "@/components/anatomy";
import { Card, ScreenHeader, Text } from "@/components/ui";
import { ADMIN_MAP, OWNER_TODAY } from "@/contract/fixtures";
import { useThemeSpec } from "@/design/theme-provider";
import { useFormat, useT } from "@/i18n";
import type { TranslationKey } from "@/i18n";

const FLAGS = [
  { icon: "alert-triangle", labelKey: "admin.systemAlreadyDid" },
  { icon: "repeat", labelKey: "money.pending" },
] as const;

/**
 * A5 Money control — layer 2. Every rupee in motion.
 *
 * The gamification line is the one to watch: micro-rewards are capped at a
 * percentage of each job's gross margin, and the app will not issue credits
 * beyond it. Without that cap, gamification eats the business — so the cap and
 * its consumption sit on the same row.
 */
export default function MoneyControlScreen() {
  const t = useT();
  const f = useFormat();
  const spec = useThemeSpec();

  const rows: { labelKey: TranslationKey; paise: number; tone?: "success" | "danger" }[] = [
    { labelKey: "owner.cashLive", paise: OWNER_TODAY.tokensPaise },
    { labelKey: "customer.dueNow", paise: OWNER_TODAY.materialPaise },
    { labelKey: "money.cleared", paise: OWNER_TODAY.finalPaise, tone: "success" },
    { labelKey: "roles.supplier", paise: OWNER_TODAY.supplierPaise, tone: "danger" },
    { labelKey: "money.payoutCountdown", paise: OWNER_TODAY.workerPaise, tone: "danger" },
  ];

  return (
    <SafeAreaView className="flex-1" edges={["top", "left", "right"]}>
      <ScreenHeader title={t("screens.moneyControl")} screenId="A5" showBack={false} />

      <ScrollView contentContainerClassName="gap-3 p-3">
        <Card className="gap-2 p-4">
          {rows.map((row) => (
            <View
              key={row.labelKey}
              className="flex-row items-baseline justify-between"
            >
              <Text variant="caption" tone="muted" className="flex-1" numberOfLines={1}>
                {t(row.labelKey).replace("{{days}}", "2")}
              </Text>
              <Text variant="body" weight="600" tone={row.tone ?? "default"}>
                {f.paise(row.paise)}
              </Text>
            </View>
          ))}
        </Card>

        <Card className="gap-2 p-4">
          <View className="flex-row items-baseline justify-between">
            <Text variant="caption" tone="subtle">
              {t("owner.netMargin")}
            </Text>
            <Text variant="heading" weight="600" tone="success">
              {f.paise(OWNER_TODAY.netMarginPaise)}
            </Text>
          </View>

          <View className="mt-2 flex-row items-baseline justify-between">
            <Text variant="caption" tone="subtle">
              {t("owner.target").replace(
                "{{value}}",
                f.percent(ADMIN_MAP.money.rewardCapLimit),
              )}
            </Text>
            <Text variant="body" weight="600" tone="success">
              {f.percent(ADMIN_MAP.money.rewardCapUsed)}
            </Text>
          </View>

          <View
            className="mt-1 overflow-hidden bg-surface"
            style={{ height: 6, borderRadius: 3 }}
          >
            <View
              className="h-full bg-success"
              style={{
                width: `${(ADMIN_MAP.money.rewardCapUsed / ADMIN_MAP.money.rewardCapLimit) * 100}%`,
              }}
            />
          </View>
        </Card>

        <View className="gap-2">
          {FLAGS.map((flag) => (
            <Card
              key={flag.labelKey}
              tone="surface"
              bordered={false}
              className="flex-row items-center gap-3 p-3"
            >
              <Feather name={flag.icon} size={spec.textLarge} className="text-warning" />
              <Text variant="caption" tone="muted" className="flex-1">
                {t(flag.labelKey)}
              </Text>
            </Card>
          ))}
        </View>
      </ScrollView>

      <HelpBubble screenId="A5" />
      <RoleTabBar />
    </SafeAreaView>
  );
}
