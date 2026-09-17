import { View } from "react-native";
import { Feather } from "@expo/vector-icons";

import { Button, Card, Text } from "@/components/ui";
import { PAYMENT_GATES, type GateId } from "@/contract/gates";
import { useThemeSpec } from "@/design/theme-provider";
import { useT } from "@/i18n";

/**
 * The seven states. A screen is not done until every applicable one exists
 * and has been seen rendered. They live together so that "all seven exist"
 * is visible in one file rather than asserted in a checklist.
 */

/** 1 — Loading. Skeleton or progress, never a blank frame. */
export function LoadingState({ lines = 3 }: { lines?: number }) {
  const t = useT();
  const spec = useThemeSpec();

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel={t("states.loadingTitle")}
      className="gap-3 p-4"
    >
      {Array.from({ length: lines }, (_, i) => (
        <View
          key={i}
          className="bg-surface"
          style={{
            height: spec.textBase,
            width: `${96 - i * 14}%`,
            borderRadius: spec.radius / 2,
          }}
        />
      ))}
    </View>
  );
}

/** 2 — Empty. What this is, why it is empty, what to do about it. */
export function EmptyState({
  title,
  body,
  actionLabel,
  onAction,
  icon = "inbox",
}: {
  title: string;
  body: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: keyof typeof Feather.glyphMap;
}) {
  const spec = useThemeSpec();

  return (
    <View className="items-center gap-3 px-6 py-10">
      <Feather name={icon} size={spec.textDisplay} className="text-subtle" />
      <Text variant="heading" weight="600" className="text-center">
        {title}
      </Text>
      <Text variant="body" tone="muted" className="text-center">
        {body}
      </Text>
      {actionLabel && onAction ? (
        <View className="mt-2 w-full">
          <Button label={actionLabel} onPress={onAction} />
        </View>
      ) : null}
    </View>
  );
}

/** 3 — Error. What broke, in the user's language, and the recovery action. */
export function ErrorState({
  body,
  onRetry,
}: {
  body: string;
  onRetry?: () => void;
}) {
  const t = useT();
  const spec = useThemeSpec();

  return (
    <View className="items-center gap-3 px-6 py-10">
      <Feather
        name="alert-circle"
        size={spec.textDisplay}
        className="text-danger"
      />
      <Text variant="heading" weight="600" className="text-center">
        {t("states.errorTitle")}
      </Text>
      <Text variant="body" tone="muted" className="text-center">
        {body}
      </Text>
      {onRetry ? (
        <View className="mt-2 w-full">
          <Button label={t("states.errorAction")} onPress={onRetry} />
        </View>
      ) : null}
    </View>
  );
}

/** 4 — Partial. Some data loaded, some failed. Never a whole-screen crash. */
export function PartialBanner({ detail }: { detail?: string }) {
  const t = useT();

  return (
    <View className="flex-row items-center gap-2 border-b border-line bg-surface px-4 py-2">
      <Feather name="alert-triangle" size={16} className="text-warning" />
      <Text variant="caption" tone="muted" className="flex-1">
        {detail ?? t("states.partialNotice")}
      </Text>
    </View>
  );
}

/** 5 — Permission denied. Distinct from error, distinct from empty. */
export function PermissionDeniedState({ body }: { body?: string }) {
  const t = useT();
  const spec = useThemeSpec();

  return (
    <View className="items-center gap-3 px-6 py-10">
      <Feather name="lock" size={spec.textDisplay} className="text-subtle" />
      <Text variant="heading" weight="600" className="text-center">
        {t("states.deniedTitle")}
      </Text>
      <Text variant="body" tone="muted" className="text-center">
        {body ?? t("states.deniedBody")}
      </Text>
    </View>
  );
}

/**
 * 6 — Offline. Degraded, not dead, with queue depth visible.
 * The worker must be able to see that their evidence is safe.
 */
export function OfflineBanner({ queued }: { queued: number }) {
  const t = useT();

  return (
    <View className="flex-row items-center gap-2 bg-warning px-4 py-2">
      <Feather name="cloud-off" size={16} className="text-warning-foreground" />
      <Text variant="caption" weight="500" tone="onPrimary" className="flex-1">
        {t("states.offlineTitle")} · {t("states.offlineQueue", { count: queued })}
      </Text>
    </View>
  );
}

/**
 * 7 — Blocked by gate. The one unique to this product, and the most important.
 *
 * A gate that blocks without explaining itself produces a phone call to the
 * office, which is the exact cost this app exists to remove. So it always
 * names the gate, what unblocks it, and who can act — and states plainly that
 * no override exists, because none does.
 */
export function BlockedByGateState({
  gate,
  detail,
  actionLabel,
  onAction,
}: {
  gate: GateId;
  detail?: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  const t = useT();
  const spec = useThemeSpec();
  const definition = PAYMENT_GATES[gate];

  return (
    <Card tone="gate" className="overflow-hidden">
      <View className="flex-row items-center gap-2 border-b border-gate px-4 py-3">
        <Feather name="lock" size={spec.textBase} className="text-gate" />
        <Text variant="body" weight="600" tone="gate" className="flex-1">
          {t(definition.titleKey)}
        </Text>
      </View>

      <View className="gap-3 px-4 py-4">
        <Text variant="body" tone="default">
          {detail ?? t(definition.blocksKey)}
        </Text>

        <View className="gap-1">
          <Text variant="caption" tone="muted">
            {t(definition.unblockKey)}
          </Text>
          <Text variant="caption" tone="muted">
            {t("states.gateWhoActs")}: {t(definition.whoActsKey)}
          </Text>
        </View>

        <Text variant="caption" tone="subtle">
          {t("gates.noOverride")}
        </Text>

        {actionLabel && onAction ? (
          <Button label={actionLabel} onPress={onAction} />
        ) : null}
      </View>
    </Card>
  );
}
