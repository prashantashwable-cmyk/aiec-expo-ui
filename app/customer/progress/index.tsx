import { useRouter } from "expo-router";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

import { HelpBubble, RoleTabBar } from "@/components/anatomy";
import { Card, ScreenHeader, Text } from "@/components/ui";
import { CUSTOMER_PROGRESS_DAYS } from "@/contract/fixtures-detail";
import { useThemeSpec } from "@/design/theme-provider";
import { useFormat, useT } from "@/i18n";

/**
 * C7 Installation progress — layer 2.
 *
 * Day by day, from the technician evidence. The customer sees the same photos
 * the payout was judged against, which is what makes the two-week deadline
 * enforceable: when every delay has an owner in the data, nobody can blame the
 * other party without the record contradicting them.
 */
export default function ProgressScreen() {
  const t = useT();
  const f = useFormat();
  const router = useRouter();
  const spec = useThemeSpec();

  return (
    <SafeAreaView className="flex-1" edges={["top", "left", "right"]}>
      <ScreenHeader title={t("screens.installProgress")} screenId="C7" showBack={false} />

      <ScrollView contentContainerClassName="gap-3 p-4">
        {CUSTOMER_PROGRESS_DAYS.map((entry) => (
          <Card
            key={entry.day}
            className={`gap-3 p-4 ${entry.state === "active" ? "border-primary" : ""}`}
            onTouchEnd={() => router.push(`/customer/progress/${entry.day}` as never)}
          >
            <View className="flex-row items-baseline justify-between">
              <Text variant="body" weight="600">
                {t("detail.day", { day: entry.day })}
              </Text>
              <Text variant="caption" tone="subtle">
                {f.date(entry.date)}
              </Text>
            </View>

            <Text variant="body">{entry.title}</Text>

            <View className="flex-row items-center gap-2">
              <Feather name="image" size={spec.textBase} className="text-subtle" />
              <Text variant="caption" tone="muted">
                {t("detail.photos", { count: entry.photos })}
              </Text>
            </View>
          </Card>
        ))}
      </ScrollView>

      <HelpBubble screenId="C7" />
      <RoleTabBar />
    </SafeAreaView>
  );
}
