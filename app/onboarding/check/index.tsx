import { useState } from "react";
import { useRouter } from "expo-router";
import { Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

import { HelpBubble, RoleTabBar } from "@/components/anatomy";
import { Button, Card, ScreenHeader, Text } from "@/components/ui";
import { ONBOARDING_SKILLS } from "@/contract/fixtures-console";
import { useThemeSpec } from "@/design/theme-provider";
import { useT } from "@/i18n";

/**
 * B2 Quick check — layer 2. The automatic filter, about four minutes.
 *
 * Skills are declared by tapping icons rather than reading a list, and the
 * aptitude test that follows is picture-based — identify the tool, spot the
 * unsafe act, read the measurement — so literacy is never the thing being
 * tested.
 *
 * The safety screen is absolute: failing any one of its questions ends the
 * application, with no override anywhere in the product.
 */
export default function QuickCheckScreen() {
  const t = useT();
  const router = useRouter();
  const spec = useThemeSpec();
  const [selected, setSelected] = useState<string[]>(["electrical"]);

  const toggle = (id: string) =>
    setSelected((current) =>
      current.includes(id) ? current.filter((s) => s !== id) : [...current, id],
    );

  return (
    <SafeAreaView className="flex-1" edges={["top", "left", "right"]}>
      <ScreenHeader title={t("screens.filter")} screenId="B2" showBack={false} />

      <ScrollView contentContainerClassName="gap-4 p-4">
        <View className="flex-row flex-wrap gap-2">
          {ONBOARDING_SKILLS.map((skill) => {
            const active = selected.includes(skill.id);
            return (
              <Pressable
                key={skill.id}
                accessibilityRole="checkbox"
                aria-checked={active}
                accessibilityLabel={skill.id}
                onPress={() => toggle(skill.id)}
                className={`items-center justify-center gap-1 ${active ? "bg-primary" : "bg-surface"}`}
                style={{
                  width: "23%",
                  aspectRatio: 1,
                  borderRadius: spec.radius,
                }}
              >
                <Feather
                  name={skill.icon}
                  size={26}
                  className={active ? "text-primary-foreground" : "text-muted"}
                />
              </Pressable>
            );
          })}
        </View>

        <Card tone="gate" className="flex-row items-start gap-3 p-4">
          <Feather name="shield" size={spec.textLarge} className="text-gate" />
          <Text variant="caption" tone="gate" className="flex-1">
            {t("join.safetyNonNegotiable")}
          </Text>
        </Card>

        <Card tone="surface" bordered={false} className="p-4">
          <Text variant="caption" tone="muted">
            {t("join.everyoneStartsL1")}
          </Text>
        </Card>

        <Button
          label={t("common.next")}
          onPress={() => router.push("/onboarding/details" as never)}
        />
      </ScrollView>

      <HelpBubble screenId="B2" />
      <RoleTabBar />
    </SafeAreaView>
  );
}
