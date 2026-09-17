import { Pressable, View } from "react-native";
import { Feather } from "@expo/vector-icons";

import { useThemeSpec } from "@/design/theme-provider";
import { Text, type TextTone } from "./text";

/** The workhorse row for every layer-2 list. */
export function ListRow({
  title,
  subtitle,
  meta,
  metaTone = "muted",
  icon,
  iconTone = "text-subtle",
  onPress,
  disabled,
  monoSubtitle,
}: {
  title: string;
  subtitle?: string;
  meta?: string;
  metaTone?: TextTone;
  icon?: keyof typeof Feather.glyphMap;
  iconTone?: string;
  onPress?: () => void;
  disabled?: boolean;
  monoSubtitle?: boolean;
}) {
  const spec = useThemeSpec();

  return (
    <Pressable
      accessibilityRole={onPress ? "button" : undefined}
      accessibilityLabel={title}
      accessibilityState={{ disabled: !!disabled }}
      onPress={onPress}
      disabled={disabled || !onPress}
      className={`flex-row items-center gap-3 border border-line bg-surface-raised px-4 ${disabled ? "opacity-50" : "active:opacity-80"}`}
      style={{
        borderRadius: spec.radius,
        minHeight: Math.max(56, spec.controlHeightSm),
        paddingVertical: 10,
      }}
    >
      {icon ? (
        <Feather name={icon} size={spec.textLarge} className={iconTone} />
      ) : null}

      <View className="min-w-0 flex-1">
        <Text variant="body" numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text
            variant="caption"
            tone="subtle"
            numberOfLines={1}
            style={monoSubtitle ? { fontFamily: "monospace" } : undefined}
          >
            {subtitle}
          </Text>
        ) : null}
      </View>

      {meta ? (
        <Text variant="body" weight="600" tone={metaTone}>
          {meta}
        </Text>
      ) : null}

      {onPress ? (
        <Feather name="chevron-right" size={spec.textBase} className="text-subtle" />
      ) : null}
    </Pressable>
  );
}
