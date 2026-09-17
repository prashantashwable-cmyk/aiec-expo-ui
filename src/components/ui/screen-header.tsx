import { useRouter } from "expo-router";
import { Pressable, View } from "react-native";
import { Feather } from "@expo/vector-icons";

import { useThemeSpec } from "@/design/theme-provider";
import { useT } from "@/i18n";
import { LanguageSwitch } from "./language-switch";
import { Text } from "./text";

/**
 * Header for every layer-2 and layer-3 screen. Carries the manual's own screen
 * id so a support call can be pinned to an exact screen, and keeps the language
 * switch in the top bar where Law 6 puts it.
 */
export function ScreenHeader({
  title,
  screenId,
  subtitle,
  showBack = true,
  trailing,
}: {
  title: string;
  screenId?: string;
  subtitle?: string;
  showBack?: boolean;
  trailing?: React.ReactNode;
}) {
  const router = useRouter();
  const spec = useThemeSpec();
  const t = useT();

  return (
    <View className="flex-row items-center gap-3 border-b border-line px-4 py-3">
      {showBack ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t("common.back")}
          onPress={() => router.back()}
          className="-ml-1 items-center justify-center active:opacity-70"
          style={{ width: 40, height: 40 }}
        >
          <Feather name="arrow-left" size={spec.textLarge} className="text-foreground" />
        </Pressable>
      ) : null}

      <View className="min-w-0 flex-1">
        <Text variant="heading" weight="600" numberOfLines={1}>
          {title}
        </Text>
        {subtitle || screenId ? (
          <Text variant="caption" tone="subtle" numberOfLines={1}>
            {[screenId, subtitle].filter(Boolean).join(" · ")}
          </Text>
        ) : null}
      </View>

      {trailing ?? <LanguageSwitch />}
    </View>
  );
}
