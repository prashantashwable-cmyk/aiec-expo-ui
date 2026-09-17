import { Pressable, View } from "react-native";

import { useI18n, useT } from "@/i18n";
import { useThemeSpec } from "@/design/theme-provider";
import { Text } from "./text";

const LANGUAGES = [
  { code: "en", label: "EN" },
  { code: "mr", label: "मराठी" },
  { code: "hi", label: "हिंदी" },
] as const;

/**
 * Law 6 — the switch lives in the top bar of every screen and is never buried.
 * Changing language swaps a context value; nothing remounts, so form data
 * being typed at the moment of the switch survives it.
 */
export function LanguageSwitch() {
  const { language, setLanguage } = useI18n();
  const t = useT();
  const spec = useThemeSpec();

  /**
   * A utility control, not a primary action, so it does not take the theme's
   * full control height. At Sunlight's 56px it overflowed the header and
   * clipped against the screen edge, which Law 9 forbids outright.
   */
  const height = Math.min(spec.controlHeightSm, 38);

  return (
    <View
      accessibilityRole="radiogroup"
      accessibilityLabel={t("common.language")}
      className="shrink-0 flex-row overflow-hidden border border-line"
      style={{ borderRadius: spec.radius }}
    >
      {LANGUAGES.map((item) => {
        const active = item.code === language;
        return (
          <Pressable
            key={item.code}
            role="radio"
            // Passed as an ARIA prop directly: neither accessibilityState
            // `selected` nor `checked` reaches aria-checked on web, and a radio
            // that never reports its state is unusable with a screen reader.
            aria-checked={active}
            accessibilityLabel={item.label}
            onPress={() => setLanguage(item.code)}
            className={`px-2.5 ${active ? "bg-primary" : "bg-transparent"}`}
            style={{ height, justifyContent: "center" }}
          >
            <Text
              variant="caption"
              weight={active ? "600" : "400"}
              family="sans"
              tone={active ? "onPrimary" : "muted"}
            >
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
