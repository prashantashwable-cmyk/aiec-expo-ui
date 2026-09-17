import { useLocalSearchParams } from "expo-router";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { EvidenceGrid, HelpBubble } from "@/components/anatomy";
import { BlockedByGateState, EmptyState } from "@/components/states";
import { Button, Card, ScreenHeader, Text } from "@/components/ui";
import { ADMIN_APPROVALS } from "@/contract/fixtures-console";
import { LEAD_EVIDENCE } from "@/contract/fixtures-detail";
import { useThemeSpec } from "@/design/theme-provider";
import { useFormat, useT } from "@/i18n";

/**
 * A4.1 Approval detail — layer 3.
 *
 * Evidence side by side with the reason the AI gave and the rule it applied,
 * plus a mandatory written reason before any decision. Where the request sits
 * below the margin floor there is no approve button at all — not disabled,
 * absent. The floor is code, not policy, and not even the admin can type
 * under it.
 */
export default function ApprovalDetailScreen() {
  const t = useT();
  const f = useFormat();
  const spec = useThemeSpec();
  const { id } = useLocalSearchParams<{ id: string }>();
  const approval = ADMIN_APPROVALS.find((a) => a.id === id);

  if (!approval) {
    return (
      <SafeAreaView className="flex-1" edges={["top", "left", "right"]}>
        <ScreenHeader title={t("screens.approvalDetail")} screenId="A4.1" />
        <EmptyState
          icon="search"
          title={t("states.emptyTitle")}
          body={t("states.errorTitle")}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1" edges={["top", "left", "right"]}>
      <ScreenHeader title={approval.title} screenId="A4.1" subtitle={approval.id} />

      <ScrollView contentContainerClassName="gap-4 p-4">
        <Card className="gap-2 p-4">
          <Text variant="body">{approval.detail}</Text>
          {approval.paise ? (
            <Text variant="heading" weight="600">
              {f.paise(approval.paise)}
            </Text>
          ) : null}
        </Card>

        {approval.kind === "evidence" ? (
          <View className="gap-2">
            <Text variant="caption" tone="muted">
              {t("admin.sideBySide")}
            </Text>
            <EvidenceGrid items={LEAD_EVIDENCE.slice(0, 2)} />
          </View>
        ) : null}

        {approval.adminCanDecide ? (
          <View className="gap-3">
            <Card tone="surface" bordered={false} className="gap-2 p-4">
              <Text variant="caption" tone="subtle">
                {t("console.reason")}
              </Text>
              <View
                className="border border-line bg-background"
                style={{ height: 72, borderRadius: spec.radius }}
              />
              <Text variant="caption" tone="subtle">
                {t("console.auditedToo")}
              </Text>
            </Card>

            <View className="flex-row gap-2">
              <View className="flex-1">
                <Button label={t("admin.approve")} size="small" onPress={() => undefined} />
              </View>
              <View className="flex-1">
                <Button
                  label={t("admin.reject")}
                  variant="secondary"
                  size="small"
                  onPress={() => undefined}
                />
              </View>
            </View>
          </View>
        ) : (
          <BlockedByGateState
            gate="token"
            detail={t("console.noOverrideAdmin")}
          />
        )}
      </ScrollView>

      <HelpBubble screenId="A4.1" />
    </SafeAreaView>
  );
}
