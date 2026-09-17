import { useLocalSearchParams } from "expo-router";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

import { EvidenceGrid, HelpBubble } from "@/components/anatomy";
import { BlockedByGateState, EmptyState } from "@/components/states";
import { Card, Pill, ScreenHeader, Text } from "@/components/ui";
import { TECHNICIAN_STEP } from "@/contract/fixtures";
import { SOP_TREE, TECHNICIAN_KITS } from "@/contract/fixtures-detail";
import { useThemeSpec } from "@/design/theme-provider";
import { useFormat, useT } from "@/i18n";

/**
 * T3.1 Step detail — layer 3.
 *
 * A single SOP step with its evidence requirements, the kit that unlocks with
 * it, and its money. A locked step shows the gate rather than a dead button,
 * because the technician needs to know what unblocks it and who can act — not
 * simply that they cannot proceed.
 */
export default function SopStepDetailScreen() {
  const t = useT();
  const f = useFormat();
  const spec = useThemeSpec();
  const { step: raw } = useLocalSearchParams<{ step: string }>();
  const index = Number(raw);
  const step = SOP_TREE.find((s) => s.index === index);
  const kit = TECHNICIAN_KITS.find((k) => k.code === step?.kit);

  if (!step) {
    return (
      <SafeAreaView className="flex-1" edges={["top", "left", "right"]}>
        <ScreenHeader title={t("screens.stepDetail")} screenId="T3.1" />
        <EmptyState
          icon="search"
          title={t("states.emptyTitle")}
          body={t("states.errorTitle")}
        />
      </SafeAreaView>
    );
  }

  const stateLabel = {
    verified: t("detail.verified"),
    active: t("detail.inProgress"),
    locked: t("detail.locked"),
  }[step.state];

  return (
    <SafeAreaView className="flex-1" edges={["top", "left", "right"]}>
      <ScreenHeader
        title={step.title}
        screenId="T3.1"
        subtitle={t("technician.stepOf", { current: step.index, total: SOP_TREE.length })}
      />

      <ScrollView contentContainerClassName="gap-4 p-4">
        <View className="flex-row items-center justify-between">
          <Pill
            label={stateLabel}
            tone={
              step.state === "verified"
                ? "success"
                : step.state === "active"
                  ? "primary"
                  : "neutral"
            }
          />
          <Text variant="heading" weight="600" tone="primary">
            {f.paise(step.valuePaise)}
          </Text>
        </View>

        {step.safety ? (
          <Card tone="gate" className="flex-row items-center gap-3 p-3">
            <Feather name="shield" size={spec.textLarge} className="text-gate" />
            <Text variant="label" tone="gate" className="flex-1">
              {t("detail.safetyStep")}
            </Text>
          </Card>
        ) : null}

        {step.verifiedAt ? (
          <Card tone="surface" bordered={false} className="gap-1 p-3">
            <Text variant="caption" tone="subtle">
              {t("detail.verified")}
            </Text>
            <Text variant="body">
              {f.date(step.verifiedAt)} · {f.time(step.verifiedAt)}
            </Text>
          </Card>
        ) : null}

        {kit ? (
          <Card className="flex-row items-center gap-3 p-3">
            <Feather name="package" size={spec.textLarge} className="text-primary" />
            <View className="flex-1">
              <Text variant="body">{kit.code}</Text>
              <Text variant="caption" tone="subtle">
                {kit.contents}
              </Text>
            </View>
          </Card>
        ) : null}

        {step.state === "active" ? (
          <View className="gap-2">
            <Text variant="caption" tone="muted">
              {t("technician.requiredEvidence")}
            </Text>
            <EvidenceGrid items={[...TECHNICIAN_STEP.evidence]} />
          </View>
        ) : null}

        {step.state === "locked" ? (
          <BlockedByGateState
            gate="verifiedEvidence"
            detail={t("technician.lockedUntil", { next: step.index })}
          />
        ) : null}
      </ScrollView>

      <HelpBubble screenId="T3.1" />
    </SafeAreaView>
  );
}
