import { useRouter } from "expo-router";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

import { HelpBubble, RoleTabBar } from "@/components/anatomy";
import { Card, Pill, ScreenHeader, Text } from "@/components/ui";
import { PINK_SETTINGS } from "@/contract/fixtures-console";
import { useThemeSpec } from "@/design/theme-provider";
import { useFormat, useT } from "@/i18n";

/**
 * A7 SOP and rate configuration — layer 2. Where the business itself is edited.
 *
 * Immovable 4 in one screen: every tunable number in the product lives here
 * rather than in the code, each with a unit, a range and an effective date. A
 * numeric literal anywhere else is a bug, and this list is the reason it never
 * needs to be one.
 *
 * Changing a value never moves a closed job — the job keeps the config version
 * it ran under.
 */
export default function ConfigScreen() {
  const t = useT();
  const f = useFormat();
  const router = useRouter();
  const spec = useThemeSpec();

  return (
    <SafeAreaView className="flex-1" edges={["top", "left", "right"]}>
      <ScreenHeader title={t("screens.sopConfig")} screenId="A7" showBack={false} />

      <ScrollView contentContainerClassName="gap-2 p-3">
        {PINK_SETTINGS.map((setting) => (
          <Card
            key={setting.key}
            className="gap-2 p-3"
            onTouchEnd={() => router.push(`/admin/config/${encodeURIComponent(setting.key)}` as never)}
          >
            <View className="flex-row items-center justify-between gap-2">
              <Text
                variant="body"
                numberOfLines={1}
                style={{ fontFamily: "monospace" }}
                className="flex-1"
              >
                {setting.key}
              </Text>
              <Text variant="body" weight="600" tone="primary">
                {setting.value}
              </Text>
            </View>

            <View className="flex-row items-center gap-2">
              <Text variant="caption" tone="subtle" className="flex-1">
                {setting.unit} · {setting.min}–{setting.max}
              </Text>
              {setting.ownerOnly ? (
                <Pill label={t("console.ownerOnly")} tone="gate" />
              ) : null}
              <Feather name="clock" size={spec.textMin} className="text-subtle" />
              <Text variant="caption" tone="subtle">
                {f.date(setting.effectiveFrom)}
              </Text>
            </View>
          </Card>
        ))}
      </ScrollView>

      <HelpBubble screenId="A7" />
      <RoleTabBar />
    </SafeAreaView>
  );
}
