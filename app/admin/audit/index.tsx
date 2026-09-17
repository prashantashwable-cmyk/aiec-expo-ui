import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { HelpBubble, Timeline } from "@/components/anatomy";
import { ScreenHeader, Text } from "@/components/ui";
import { ADMIN_AUDIT } from "@/contract/fixtures-console";
import { useT } from "@/i18n";

/**
 * A9 Audit log — layer 2.
 *
 * Every admin decision, its written reason, the actor and the server
 * timestamp. This exists because the separation rule cuts both ways: the
 * person who does the work never approves it, and the person who approves is
 * recorded doing so.
 */
export default function AuditLogScreen() {
  const t = useT();

  return (
    <SafeAreaView className="flex-1" edges={["top", "left", "right"]}>
      <ScreenHeader title={t("screens.auditLog")} screenId="A9" />

      <ScrollView contentContainerClassName="gap-3 p-4">
        <Text variant="caption" tone="subtle">
          {t("console.auditedToo")}
        </Text>

        <Timeline
          entries={ADMIN_AUDIT.map((entry) => ({
            id: entry.id,
            label: entry.action,
            at: entry.at,
            actor: entry.actor,
            icon: "shield",
          }))}
        />

        <View className="gap-2">
          {ADMIN_AUDIT.map((entry) => (
            <View key={entry.id} className="border-l-2 border-line pl-3">
              <Text variant="caption" tone="subtle">
                {entry.id} · {t("console.reason")}
              </Text>
              <Text variant="body" tone="muted">
                {entry.reason}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <HelpBubble screenId="A9" />
    </SafeAreaView>
  );
}
