import { useRouter } from "expo-router";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

import { HelpBubble, RoleTabBar } from "@/components/anatomy";
import { Card, ScreenHeader, Text } from "@/components/ui";
import { SOP_TREE } from "@/contract/fixtures-detail";
import { useThemeSpec } from "@/design/theme-provider";
import { useFormat, useT } from "@/i18n";

const STATE_ICON = {
  verified: "check-circle",
  active: "play-circle",
  locked: "lock",
} as const;

const STATE_TONE = {
  verified: "text-success",
  active: "text-primary",
  locked: "text-subtle",
} as const;

/**
 * T3 Full SOP tree — layer 2. All 24 steps, locked, unlocked or done.
 *
 * The lock is the mechanism, not decoration: step N+1 cannot be captured until
 * step N is verified, and that ordering is enforced in the query layer rather
 * than by hiding a button. Safety steps are marked because they are
 * structurally excluded from any time bonus — the bonus engine cannot reach
 * them, so nobody is ever paid to hurry through one.
 */
export default function SopTreeScreen() {
  const t = useT();
  const f = useFormat();
  const router = useRouter();
  const spec = useThemeSpec();

  const verified = SOP_TREE.filter((s) => s.state === "verified").length;

  return (
    <SafeAreaView className="flex-1" edges={["top", "left", "right"]}>
      <ScreenHeader
        title={t("screens.sopTree")}
        screenId="T3"
        subtitle={t("technician.stepOf", { current: verified, total: SOP_TREE.length })}
        showBack={false}
      />

      <ScrollView contentContainerClassName="gap-2 p-4">
        {SOP_TREE.map((step) => (
          <Card
            key={step.index}
            className={`flex-row items-center gap-3 p-3 ${step.state === "active" ? "border-primary" : ""}`}
            onTouchEnd={() =>
              step.state !== "locked"
                ? router.push(`/technician/sop/${step.index}` as never)
                : undefined
            }
          >
            <Text
              variant="caption"
              tone="subtle"
              weight="600"
              style={{ width: 24 }}
            >
              {step.index}
            </Text>

            <Feather
              name={STATE_ICON[step.state]}
              size={spec.textLarge}
              className={STATE_TONE[step.state]}
            />

            <View className="min-w-0 flex-1">
              <Text
                variant="body"
                tone={step.state === "locked" ? "muted" : "default"}
                numberOfLines={1}
              >
                {step.title}
              </Text>
              <View className="flex-row items-center gap-2">
                {step.kit ? (
                  <Text variant="caption" tone="subtle">
                    {step.kit}
                  </Text>
                ) : null}
                {step.safety ? (
                  <Text variant="caption" tone="warning">
                    {t("detail.safetyStep")}
                  </Text>
                ) : null}
              </View>
            </View>

            <Text
              variant="label"
              weight="600"
              tone={step.state === "locked" ? "subtle" : "primary"}
            >
              {f.paise(step.valuePaise)}
            </Text>
          </Card>
        ))}
      </ScrollView>

      <HelpBubble screenId="T3" />
      <RoleTabBar />
    </SafeAreaView>
  );
}
