import type { ReactNode } from "react";
import { View } from "react-native";

import { Text } from "@/components/ui";
import { useT } from "@/i18n";

/**
 * Law 10 — visually obvious. A persistent ribbon on every demo screen.
 *
 * It also carries the language switch, because on the Sunlight theme the
 * stats strip needs the full screen width at 22px minimum text and the two
 * cannot share a row on a 360px phone.
 */
export function DemoRibbon({ trailing }: { trailing?: ReactNode }) {
  const t = useT();
  return (
    <View className="flex-row items-center justify-between gap-3 bg-warning px-4 py-1.5">
      <Text variant="caption" weight="600" tone="onPrimary">
        {t("firstRun.demoRibbon")}
      </Text>
      {trailing}
    </View>
  );
}
