import { useRouter } from "expo-router";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { HelpBubble, RoleTabBar } from "@/components/anatomy";
import { Card, Pill, ScreenHeader, Text } from "@/components/ui";
import { SALES_LEADS } from "@/contract/fixtures-console";
import { useFormat, useT } from "@/i18n";
import type { TranslationKey } from "@/i18n";

/**
 * S2 Lead cards — layer 2.
 *
 * The lead scoring engine runs the moment a rider capture lands. Seventy or
 * above enters the automated sequence within sixty seconds; forty to
 * sixty-nine waits for the next batch; below forty is held for a re-visit
 * rather than burned on contact attempts.
 */
export default function SalesLeadsScreen() {
  const t = useT();
  const f = useFormat();
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1" edges={["top", "left", "right"]}>
      <ScreenHeader title={t("screens.leadCard")} screenId="S2" showBack={false} />

      <ScrollView contentContainerClassName="gap-3 p-3">
        {SALES_LEADS.map((lead) => (
          <Card
            key={lead.id}
            className="gap-3 p-4"
            onTouchEnd={() => router.push(`/sales/leads/${lead.id}` as never)}
          >
            <View className="flex-row items-start justify-between gap-2">
              <View className="min-w-0 flex-1">
                <Text variant="body" weight="600" numberOfLines={1}>
                  {lead.site}
                </Text>
                <Text variant="caption" tone="subtle" style={{ fontFamily: "monospace" }}>
                  {lead.id}
                </Text>
              </View>
              <View className="items-end">
                <Text variant="caption" tone="subtle">
                  {t("console.score")}
                </Text>
                <Text
                  variant="heading"
                  weight="600"
                  tone={lead.band === "hot" ? "danger" : lead.band === "warm" ? "warning" : "subtle"}
                >
                  {lead.score}
                </Text>
              </View>
            </View>

            <View className="flex-row flex-wrap items-center gap-1.5">
              <Pill
                label={t(`console.${lead.band}` as TranslationKey)}
                tone={lead.band === "hot" ? "danger" : lead.band === "warm" ? "warning" : "neutral"}
              />
              <Pill
                label={t("console.attempts", {
                  used: lead.attemptsUsed,
                  allowed: lead.attemptsAllowed,
                })}
              />
              {lead.escalated ? (
                <Pill label={t("console.escalated")} tone="warning" />
              ) : null}
            </View>

            {lead.listPaise > 0 ? (
              <View className="flex-row items-baseline justify-between">
                <Text variant="caption" tone="subtle">
                  {t("console.listPrice")}
                </Text>
                <Text variant="body" weight="600">
                  {f.paise(lead.listPaise)}
                </Text>
              </View>
            ) : null}
          </Card>
        ))}
      </ScrollView>

      <HelpBubble screenId="S2" />
      <RoleTabBar />
    </SafeAreaView>
  );
}
