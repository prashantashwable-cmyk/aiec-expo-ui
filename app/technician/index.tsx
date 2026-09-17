import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

import { HelpBubble, RoleTabBar } from "@/components/anatomy";
import { BlockedByGateState, OfflineBanner } from "@/components/states";
import { Button, LanguageSwitch, Text } from "@/components/ui";
import { TECHNICIAN_STEP } from "@/contract/fixtures";
import { useThemeSpec } from "@/design/theme-provider";
import { useFormat, useT } from "@/i18n";

const EVIDENCE_ICON = {
  passed: "check-circle",
  retake: "alert-triangle",
  pending: "circle",
} as const;

const EVIDENCE_TONE = {
  passed: "text-success",
  retake: "text-warning",
  pending: "text-subtle",
} as const;

/**
 * T2 Today's SOP step. Slate theme, for a dim shaft and gloved hands.
 *
 * This is the mechanism the money model rests on: the step is sequence-locked,
 * the evidence is camera-only and geofenced, and the payout accrues only when
 * every photo passes. The gate that holds step 7 is shown as a gate, never as
 * a bare error, and the appeal route ships alongside the rejection rather than
 * after it, so an honest technician is never left simply unpaid.
 */
export default function SopStepScreen() {
  const t = useT();
  const f = useFormat();
  const spec = useThemeSpec();
  const step = TECHNICIAN_STEP;
  const failed = step.evidence.find((item) => item.status === "retake");

  return (
    <SafeAreaView className="flex-1" edges={["top", "left", "right"]}>
      <View className="flex-row items-center justify-between bg-surface px-4 py-2">
        <Text variant="caption" tone="success">
          {t("technician.daysRemaining", {
            days: step.daysRemaining,
            hours: step.hoursRemaining,
          })}
        </Text>
        <View className="flex-row items-center gap-3">
          <Text variant="caption" tone="muted">
            {step.percentComplete + "% · " + t("technician.onTrack")}
          </Text>
          <LanguageSwitch />
        </View>
      </View>

      {!step.online ? <OfflineBanner queued={step.queuedPhotos} /> : null}

      <ScrollView contentContainerClassName="pb-6">
        <View className="border-b border-line px-4 py-3">
          <View className="flex-row items-start justify-between gap-3">
            <View className="flex-1">
              <Text variant="caption" tone="muted">
                {t("technician.stepOf", { current: step.current, total: step.total })}
              </Text>
              <Text variant="heading" weight="600">
                {step.title}
              </Text>
            </View>
            <Text variant="heading" weight="600" tone="primary">
              {f.paise(step.valuePaise)}
            </Text>
          </View>
          <View className="mt-2 flex-row items-center gap-2">
            <Feather name="unlock" size={14} className="text-success" />
            <Text variant="caption" tone="muted">
              {t("technician.unlockedAt", {
                previous: step.previousStep,
                time: f.time(step.previousVerifiedAt),
              })}
            </Text>
          </View>
        </View>

        <View className="h-48 items-center justify-center bg-surface-raised">
          <View
            className="h-32 w-40 border-2 border-primary"
            style={{ borderRadius: spec.radius / 2 }}
          />
          <View className="absolute left-3 top-3 flex-row items-center gap-1.5 rounded-full bg-background px-2.5 py-1">
            <Feather name="map-pin" size={12} className="text-success" />
            <Text variant="caption" tone="success">
              {f.distance(step.geofenceMetres)}
            </Text>
          </View>
          <Text variant="caption" tone="muted" className="absolute bottom-3">
            {t("technician.frameGuide")}
          </Text>
        </View>

        <View className="gap-3 px-4 py-4">
          <Text variant="caption" tone="muted">
            {t("technician.requiredEvidence")}
          </Text>

          {step.evidence.map((item) => (
            <View key={item.id} className="flex-row items-center gap-3">
              <Feather
                name={EVIDENCE_ICON[item.status]}
                size={22}
                className={EVIDENCE_TONE[item.status]}
              />
              <View className="flex-1">
                <Text variant="body" tone={item.status === "pending" ? "muted" : "default"}>
                  {item.label}
                </Text>
                {item.status === "retake" ? (
                  <Text variant="caption" tone="warning">
                    {t("technician.illegible", {
                      used: item.retries,
                      allowed: item.maxRetries,
                    })}
                  </Text>
                ) : null}
              </View>
            </View>
          ))}
        </View>

        <View className="px-4">
          <BlockedByGateState
            gate="verifiedEvidence"
            detail={t("technician.lockedUntil", { next: step.current + 1 })}
            actionLabel={t("technician.appeal")}
            onAction={() => undefined}
          />
        </View>

        <View className="px-4 pt-3">
          <Text variant="caption" tone="success">
            {t("technician.paidWhilePending")}
          </Text>
        </View>

        <View className="px-4 pt-4">
          <Button
            label={failed ? t("technician.retakePhoto") : t("technician.startStep")}
            onPress={() => undefined}
          />
        </View>
      </ScrollView>

      <HelpBubble screenId="T2" />
      <RoleTabBar />
    </SafeAreaView>
  );
}
