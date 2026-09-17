import { useState } from "react";
import { Modal, Pressable, View } from "react-native";
import { Feather } from "@expo/vector-icons";

import { Text } from "@/components/ui";
import { useThemeSpec } from "@/design/theme-provider";
import { useT } from "@/i18n";

const TABS = [
  { key: "help.whatIsThis", icon: "info" },
  { key: "help.showMe", icon: "play-circle" },
  { key: "help.askAi", icon: "message-circle" },
  { key: "help.callAdmin", icon: "phone" },
] as const;

/**
 * Law 8 — a `?` bubble on every screen, never covering a primary action.
 *
 * Every open is logged with its `screenId`. If enough users open help on the
 * same screen in a week, admin gets a "confusing screen" alert — the help
 * button doubles as a live UX defect detector.
 */
export function HelpBubble({
  screenId,
  onOpen,
}: {
  screenId: string;
  onOpen?: (screenId: string) => void;
}) {
  const t = useT();
  const spec = useThemeSpec();
  const [open, setOpen] = useState(false);

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t("help.button")}
        onPress={() => {
          onOpen?.(screenId);
          setOpen(true);
        }}
        className="absolute bottom-24 right-4 h-14 w-14 items-center justify-center rounded-full border border-line bg-surface-raised active:opacity-80"
      >
        <Feather name="help-circle" size={26} className="text-foreground" />
      </Pressable>

      <Modal visible={open} transparent animationType="fade">
        <Pressable
          className="flex-1 justify-end bg-black/50"
          onPress={() => setOpen(false)}
        >
          <View
            className="gap-2 bg-surface-raised p-4"
            style={{
              borderTopLeftRadius: spec.radius * 2,
              borderTopRightRadius: spec.radius * 2,
            }}
          >
            <Text variant="caption" tone="subtle">
              {screenId}
            </Text>
            {TABS.map((tab) => (
              <Pressable
                key={tab.key}
                accessibilityRole="button"
                className="flex-row items-center gap-3 border-b border-line py-4 active:opacity-70"
              >
                <Feather name={tab.icon} size={20} className="text-primary" />
                <Text variant="body">{t(tab.key)}</Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Modal>
    </>
  );
}
