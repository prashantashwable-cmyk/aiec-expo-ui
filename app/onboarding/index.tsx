import { useState } from "react";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

import { HelpBubble, RoleTabBar } from "@/components/anatomy";
import { Button, Card, LanguageSwitch, Text } from "@/components/ui";
import { useThemeSpec } from "@/design/theme-provider";
import { useFormat, useT } from "@/i18n";
import type { TranslationKey } from "@/i18n";

const HOURS = [4, 6, 8, 10];

const EXPERIENCE: { key: TranslationKey; multiplier: number }[] = [
  { key: "join.newcomer", multiplier: 1 },
  { key: "join.years12", multiplier: 1.25 },
  { key: "join.years3plus", multiplier: 1.55 },
];

/**
 * B1 The hook — layer 1 for onboarding.
 *
 * The page opens on an earnings calculator, not a form. Capacity in this model
 * is recruited rather than bought, so this single screen is the throughput
 * valve of the company: if it converts poorly, no amount of lead generation
 * matters because there will be nobody to install the lifts.
 *
 * The numbers must be the honest median. Inflated earning claims buy a
 * recruitment spike followed by mass churn and a reputation that cannot be
 * repaired, which is why the disclaimer sits next to the figure rather than in
 * a footnote.
 */
export default function EarningsCalculatorScreen() {
  const t = useT();
  const f = useFormat();
  const router = useRouter();
  const spec = useThemeSpec();

  const [hours, setHours] = useState(8);
  const [experience, setExperience] = useState(0);

  const base = 300000;
  const multiplier = EXPERIENCE[experience].multiplier;
  const lowPaise = Math.round(base * (hours / 8) * multiplier);
  const highPaise = Math.round(lowPaise * 1.33);

  return (
    <SafeAreaView className="flex-1" edges={["top", "left", "right"]}>
      <View className="flex-row items-center justify-between px-4 pb-2 pt-3">
        <Text variant="heading" weight="600" className="flex-1">
          {t("join.howMuch")}
        </Text>
        <LanguageSwitch />
      </View>

      <ScrollView contentContainerClassName="gap-4 p-4">
        <View className="gap-2">
          <Text variant="label" tone="muted">
            {t("join.hoursPerDay")}
          </Text>
          <View className="flex-row gap-2">
            {HOURS.map((option) => {
              const active = option === hours;
              return (
                <Pressable
                  key={option}
                  accessibilityRole="radio"
                  aria-checked={active}
                  accessibilityLabel={`${option} h`}
                  onPress={() => setHours(option)}
                  className={`flex-1 items-center justify-center ${active ? "bg-primary" : "bg-surface"}`}
                  style={{ height: spec.controlHeightSm, borderRadius: spec.radius }}
                >
                  <Text
                    variant="body"
                    weight="600"
                    tone={active ? "onPrimary" : "muted"}
                  >
                    {option} h
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View className="gap-2">
          <Text variant="label" tone="muted">
            {t("join.experience")}
          </Text>
          <View className="flex-row gap-2">
            {EXPERIENCE.map((option, index) => {
              const active = index === experience;
              return (
                <Pressable
                  key={option.key}
                  accessibilityRole="radio"
                  aria-checked={active}
                  accessibilityLabel={t(option.key)}
                  onPress={() => setExperience(index)}
                  className={`flex-1 items-center justify-center px-2 ${active ? "bg-primary" : "bg-surface"}`}
                  style={{ height: spec.controlHeightSm, borderRadius: spec.radius }}
                >
                  <Text
                    variant="caption"
                    weight="600"
                    tone={active ? "onPrimary" : "muted"}
                    numberOfLines={1}
                  >
                    {t(option.key)}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <Card className="gap-2 p-5">
          <Text variant="caption" tone="subtle">
            {t("join.monthlyEstimate")}
          </Text>
          <Text variant="display" weight="600" tone="primary">
            {f.paise(lowPaise)} – {f.paise(highPaise)}
          </Text>
          <View className="flex-row items-center gap-2">
            <Feather name="trending-up" size={spec.textBase} className="text-success" />
            <Text variant="caption" tone="success">
              {t("join.sixMonths", { amount: f.paise(5200000) })}
            </Text>
          </View>
          <Text variant="caption" tone="subtle">
            {t("join.honestNumbers")}
          </Text>
        </Card>

        <Button
          label={t("join.startNow")}
          onPress={() => router.push("/onboarding/check" as never)}
        />
      </ScrollView>

      <HelpBubble screenId="B1" />
      <RoleTabBar />
    </SafeAreaView>
  );
}
