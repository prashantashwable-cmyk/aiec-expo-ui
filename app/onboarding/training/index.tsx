import { useRouter } from "expo-router";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

import { HelpBubble, RoleTabBar } from "@/components/anatomy";
import { Button, Card, ScreenHeader, Text } from "@/components/ui";
import { ONBOARDING_MODULES } from "@/contract/fixtures-console";
import { useThemeSpec } from "@/design/theme-provider";
import { useFormat, useT } from "@/i18n";

const PER_MODULE_PAISE = 5000;

/**
 * B4 Training — layer 2.
 *
 * Short vertical videos, watchable offline on a cheap phone, and a credit for
 * each module finished. The worker earns before their first job, and that
 * first few hundred rupees in the wallet is the single strongest predictor of
 * whether they ever show up to work at all.
 *
 * Safety is the one module that requires a perfect score, retaken until passed.
 */
export default function OnboardingTrainingScreen() {
  const t = useT();
  const f = useFormat();
  const router = useRouter();
  const spec = useThemeSpec();

  const earnedPaise = ONBOARDING_MODULES.filter((m) => m.done).length * PER_MODULE_PAISE;

  return (
    <SafeAreaView className="flex-1" edges={["top", "left", "right"]}>
      <ScreenHeader title={t("screens.training")} screenId="B4" showBack={false} />

      <ScrollView contentContainerClassName="gap-3 p-4">
        <Card className="gap-1 p-4">
          <Text variant="caption" tone="subtle">
            {t("money.todayEarnings")}
          </Text>
          <Text variant="display" weight="600" tone="success">
            {f.paise(earnedPaise)}
          </Text>
          <Text variant="caption" tone="muted">
            {t("join.perModule", { amount: f.paise(PER_MODULE_PAISE) })}
          </Text>
        </Card>

        {ONBOARDING_MODULES.map((module) => (
          <Card key={module.id} className="flex-row items-center gap-3 p-4">
            <Feather
              name={module.done ? "check-circle" : "play-circle"}
              size={spec.textLarge}
              className={module.done ? "text-success" : "text-primary"}
            />
            <View className="min-w-0 flex-1">
              <Text variant="body">{module.title}</Text>
              {module.required > 0 ? (
                <Text
                  variant="caption"
                  tone={module.required === 100 ? "warning" : "subtle"}
                >
                  {f.percent(module.required, 0)}
                </Text>
              ) : null}
            </View>
            {module.done ? (
              <Text variant="caption" weight="600" tone="success">
                {"+" + f.paise(PER_MODULE_PAISE)}
              </Text>
            ) : null}
          </Card>
        ))}

        <Button
          label={t("common.next")}
          onPress={() => router.push("/onboarding/first-job" as never)}
        />
      </ScrollView>

      <HelpBubble screenId="B4" />
      <RoleTabBar />
    </SafeAreaView>
  );
}
