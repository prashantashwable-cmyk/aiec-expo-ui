import { useRouter } from "expo-router";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

import { HelpBubble, RoleTabBar } from "@/components/anatomy";
import { Card, Pill, ScreenHeader, Text } from "@/components/ui";
import { PINK_SETTINGS } from "@/contract/fixtures-console";
import { useThemeSpec } from "@/design/theme-provider";
import { useT } from "@/i18n";

const QUOTE_KEYS = [
  "quote.margin.floor",
  "quote.bot.discount.max",
];

/**
 * S5 Quote builder — layer 2, admin-locked.
 *
 * Sales can read the rate configuration but not change it. The margin floor in
 * particular is owner-only: it cannot be typed under by any bot or any human
 * below the owner, which is what stops a quarter-end discount becoming a
 * permanent one.
 */
export default function QuoteBuilderScreen() {
  const t = useT();
  const router = useRouter();
  const spec = useThemeSpec();
  const settings = PINK_SETTINGS.filter((s) => QUOTE_KEYS.includes(s.key));

  return (
    <SafeAreaView className="flex-1" edges={["top", "left", "right"]}>
      <ScreenHeader title={t("screens.quoteBuilder")} screenId="S5" showBack={false} />

      <ScrollView contentContainerClassName="gap-2 p-3">
        {settings.map((setting) => (
          <Card key={setting.key} className="gap-2 p-4">
            <View className="flex-row items-center justify-between gap-2">
              <Text
                variant="caption"
                tone="subtle"
                style={{ fontFamily: "monospace" }}
                className="flex-1"
                numberOfLines={1}
              >
                {setting.key}
              </Text>
              <Text variant="heading" weight="600" tone="primary">
                {setting.value}
              </Text>
            </View>

            <View className="flex-row items-center gap-2">
              <Feather name="lock" size={spec.textMin} className="text-gate" />
              <Text variant="caption" tone="muted" className="flex-1">
                {setting.unit}
              </Text>
              {setting.ownerOnly ? (
                <Pill label={t("console.ownerOnly")} tone="gate" />
              ) : (
                <Pill label={t("roles.admin")} />
              )}
            </View>
          </Card>
        ))}

        <Text variant="caption" tone="subtle" className="px-1 pt-2">
          {t("console.noOverrideAdmin")}
        </Text>
      </ScrollView>

      <HelpBubble screenId="S5" onOpen={() => router.push("/sales" as never)} />
      <RoleTabBar />
    </SafeAreaView>
  );
}
