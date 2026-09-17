import { View } from "react-native";
import { Feather } from "@expo/vector-icons";

import { Button, Card, Text } from "@/components/ui";
import { useThemeSpec } from "@/design/theme-provider";
import { useFormat, useT } from "@/i18n";

/**
 * Law 5 — the Task Card. Four lines and nothing else: work, distance, time,
 * money. The format is identical for rider, technician, QC and helper; only
 * the content changes.
 *
 * The money is shown before acceptance deliberately. A worker deciding whether
 * to take a job needs to know what it pays at the moment of deciding, not
 * after they have done it.
 */
export function TaskCard({
  title,
  place,
  distanceMetres,
  minutes,
  paise,
  badge,
  onAccept,
  onSkip,
  acceptLabel,
}: {
  title: string;
  place: string;
  distanceMetres: number;
  minutes: number;
  paise: number;
  badge?: string;
  onAccept?: () => void;
  onSkip?: () => void;
  acceptLabel?: string;
}) {
  const t = useT();
  const f = useFormat();
  const spec = useThemeSpec();

  return (
    <Card className="gap-3 p-4">
      <View className="flex-row items-center gap-2">
        <Feather name="map-pin" size={spec.textBase} className="text-subtle" />
        <Text variant="label" tone="muted" className="flex-1" numberOfLines={1}>
          {place} · {f.distance(distanceMetres)}
        </Text>
        {badge ? (
          <Text variant="caption" weight="600" tone="warning">
            {badge}
          </Text>
        ) : null}
      </View>

      <Text variant="body" weight="600">
        {title}
      </Text>

      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <Feather name="clock" size={spec.textBase} className="text-subtle" />
          <Text variant="label" tone="muted">
            {minutes} min
          </Text>
        </View>
        <Text variant="heading" weight="600" tone="primary">
          {f.paise(paise)}
        </Text>
      </View>

      {onAccept || onSkip ? (
        <View className="flex-row gap-2">
          {onAccept ? (
            <View className="flex-1">
              <Button
                label={acceptLabel ?? t("common.submit")}
                size="small"
                onPress={onAccept}
              />
            </View>
          ) : null}
          {onSkip ? (
            <View className="flex-1">
              <Button
                label={t("common.cancel")}
                variant="secondary"
                size="small"
                onPress={onSkip}
              />
            </View>
          ) : null}
        </View>
      ) : null}
    </Card>
  );
}
