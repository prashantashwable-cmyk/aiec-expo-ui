import { useRouter } from "expo-router";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

import { HelpBubble, RoleTabBar } from "@/components/anatomy";
import { Card, ScreenHeader, Text } from "@/components/ui";
import { TECHNICIAN_KITS } from "@/contract/fixtures-detail";
import { useThemeSpec } from "@/design/theme-provider";
import { useT } from "@/i18n";

const STATE_ICON = {
  sealed: "lock",
  open: "unlock",
  consumed: "check-circle",
} as const;

const STATE_TONE = {
  sealed: "text-subtle",
  open: "text-primary",
  consumed: "text-success",
} as const;

/**
 * T5 Materials — layer 2. The phase-sealed pouches.
 *
 * Each pouch opens only at the site, by this technician, at a specific
 * verified SOP stage, with a photo of the opening required. Micro-theft in
 * this industry is not dramatic — it is twelve metres of cable here and a box
 * of fasteners there, three to five percent of material cost — and a sealed
 * pouch removes both the opportunity and the deniability at once.
 */
export default function MaterialsScreen() {
  const t = useT();
  const router = useRouter();
  const spec = useThemeSpec();

  return (
    <SafeAreaView className="flex-1" edges={["top", "left", "right"]}>
      <ScreenHeader title={t("screens.materials")} screenId="T5" showBack={false} />

      <ScrollView contentContainerClassName="gap-2 p-4">
        {TECHNICIAN_KITS.map((kit) => (
          <Card
            key={kit.id}
            className="flex-row items-center gap-3 p-3"
            onTouchEnd={() => router.push(`/technician/materials/${kit.code}` as never)}
          >
            <Feather
              name={STATE_ICON[kit.state]}
              size={spec.textLarge}
              className={STATE_TONE[kit.state]}
            />

            <View className="min-w-0 flex-1">
              <Text variant="body" weight="600">
                {kit.code}
              </Text>
              <Text variant="caption" tone="subtle" numberOfLines={1}>
                {kit.contents}
              </Text>
              <Text variant="caption" tone="muted">
                {t("detail.unlocksAt", { step: kit.unlocksAtStep })}
              </Text>
            </View>

            <Text
              variant="caption"
              weight="600"
              tone={kit.state === "open" ? "primary" : "subtle"}
            >
              {kit.state === "sealed"
                ? t("detail.sealed")
                : kit.state === "open"
                  ? t("detail.opened")
                  : t("detail.consumed")}
            </Text>
          </Card>
        ))}
      </ScrollView>

      <HelpBubble screenId="T5" />
      <RoleTabBar />
    </SafeAreaView>
  );
}
