import { usePathname, useRouter } from "expo-router";
import { Pressable, View } from "react-native";
import { Feather } from "@expo/vector-icons";

import { Text } from "@/components/ui";
import { useRole, useThemeSpec } from "@/design/theme-provider";
import { useT } from "@/i18n";
import { primaryScreens } from "@/navigation/screens";

/**
 * Law 9 — bottom navigation at phone widths, so the map stays full-bleed and
 * every destination is reachable with the thumb of the hand holding the phone.
 *
 * Targets are sized from the theme: the rider gets large ones because they are
 * gloved and moving, admin gets small ones because they have a mouse.
 */
export function RoleTabBar() {
  const role = useRole();
  const t = useT();
  const spec = useThemeSpec();
  const router = useRouter();
  const pathname = usePathname();
  const screens = primaryScreens(role);

  if (screens.length === 0) return null;

  return (
    <View
      className="flex-row border-t border-line bg-surface"
      style={{ paddingBottom: spec.edgeGuard }}
    >
      {screens.map((screen) => {
        const active =
          screen.href === pathname ||
          (screen.href !== `/${role}` && pathname.startsWith(screen.href));

        return (
          <Pressable
            key={screen.id}
            accessibilityRole="tab"
            aria-selected={active}
            accessibilityLabel={t(screen.labelKey)}
            onPress={() => router.push(screen.href as never)}
            className="min-w-0 flex-1 items-center justify-center gap-1 px-1 py-2 active:opacity-70"
            style={{ minHeight: Math.max(48, spec.controlHeightSm) }}
          >
            <Feather
              name={screen.icon}
              size={Math.max(18, spec.textBase)}
              className={active ? "text-primary" : "text-subtle"}
            />
            <Text
              variant="caption"
              family="sans"
              weight={active ? "600" : "400"}
              tone={active ? "primary" : "subtle"}
              numberOfLines={1}
              adjustsFontSizeToFit
              // Navigation chrome, not content: capped so five labels fit a
              // 360px screen. Sunlight text is 18px minimum, which overflowed
              // and clipped the last tab against the edge Law 9 protects.
              style={{ fontSize: 12, lineHeight: 15 }}
            >
              {t(screen.tabLabelKey ?? screen.labelKey)}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
