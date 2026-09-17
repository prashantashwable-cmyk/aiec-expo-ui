import { useRouter } from "expo-router";
import { Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

import { LanguageSwitch, Text } from "@/components/ui";
import { ThemeProvider } from "@/design/theme-provider";
import { ROLE_THEME, type Role } from "@/design/themes";
import { PALETTES } from "@/design/palette";
import { useT } from "@/i18n";
import type { TranslationKey } from "@/i18n";

interface RoleTile {
  role: Role;
  labelKey: TranslationKey;
  icon: keyof typeof Feather.glyphMap;
  href: string;
}

/**
 * Law 10 / Part 1.3 — tap a tile and you are inside. No password, no OTP.
 *
 * Every tile carries an icon, a word and its theme's own colour together.
 * Research on low-literate users is unambiguous that abstract glyphs alone do
 * not read, so the icon never carries the meaning by itself.
 */
const TILES: RoleTile[] = [
  { role: "rider", labelKey: "roles.rider", icon: "navigation", href: "/rider" },
  { role: "sales", labelKey: "roles.sales", icon: "trending-up", href: "/sales" },
  { role: "customer", labelKey: "roles.customer", icon: "home", href: "/customer" },
  { role: "technician", labelKey: "roles.technician", icon: "tool", href: "/technician" },
  { role: "qc", labelKey: "roles.qc", icon: "check-square", href: "/qc" },
  { role: "supplier", labelKey: "roles.supplier", icon: "package", href: "/supplier" },
  { role: "admin", labelKey: "roles.admin", icon: "grid", href: "/admin" },
  { role: "owner", labelKey: "roles.owner", icon: "bar-chart-2", href: "/owner" },
];

export default function DemoRolePicker() {
  const t = useT();
  const router = useRouter();

  return (
    <ThemeProvider theme="premium">
      <SafeAreaView className="flex-1">
        <View className="bg-warning px-4 py-2">
          <Text variant="caption" weight="600" tone="onPrimary">
            {t("firstRun.demoRibbon")}
          </Text>
        </View>

        <View className="flex-row items-center justify-between px-5 pb-2 pt-4">
          <Text variant="heading" weight="600">
            {t("firstRun.pickRole")}
          </Text>
          <LanguageSwitch />
        </View>

        <ScrollView contentContainerClassName="flex-row flex-wrap gap-3 p-4">
          {TILES.map((tile) => {
            const palette = PALETTES[ROLE_THEME[tile.role]];
            const accent = palette["--primary"];
            const onAccent = palette["--primary-foreground"];
            return (
              <Pressable
                key={tile.role}
                accessibilityRole="button"
                accessibilityLabel={t(tile.labelKey)}
                onPress={() => router.push(tile.href as never)}
                className="min-w-[45%] flex-1 items-start gap-3 rounded-xl border border-line bg-surface-raised p-4 active:opacity-80"
              >
                <View
                  className="h-12 w-12 items-center justify-center rounded-xl"
                  style={{ backgroundColor: `rgb(${accent})` }}
                >
                  <Feather name={tile.icon} size={22} color={`rgb(${onAccent})`} />
                </View>
                <Text variant="body" weight="500">
                  {t(tile.labelKey)}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </SafeAreaView>
    </ThemeProvider>
  );
}
