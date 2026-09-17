import { useRouter } from "expo-router";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { HelpBubble, RoleTabBar } from "@/components/anatomy";
import { EmptyState } from "@/components/states";
import { ListRow, ScreenHeader } from "@/components/ui";
import { SALES_LEADS } from "@/contract/fixtures-console";
import { useFormat, useT } from "@/i18n";

/**
 * S4 Manual desk — layer 2. Only the deals escalated to a human.
 *
 * An empty desk is the target state, not an idle one: every lead sitting here
 * is one the automation could not close, and the count is a direct read on how
 * well the bot is doing. If this list grows, the script needs work — not the
 * operator.
 */
export default function ManualDeskScreen() {
  const t = useT();
  const f = useFormat();
  const router = useRouter();
  const escalated = SALES_LEADS.filter((lead) => lead.escalated);

  return (
    <SafeAreaView className="flex-1" edges={["top", "left", "right"]}>
      <ScreenHeader title={t("screens.manualDesk")} screenId="S4" showBack={false} />

      {escalated.length === 0 ? (
        <EmptyState
          icon="check-circle"
          title={t("states.emptyTitle")}
          body={t("admin.systemAlreadyDid")}
        />
      ) : (
        <ScrollView contentContainerClassName="gap-2 p-3">
          {escalated.map((lead) => (
            <ListRow
              key={lead.id}
              title={lead.site}
              subtitle={lead.id}
              monoSubtitle
              icon="headphones"
              iconTone="text-warning"
              meta={f.paise(lead.botFloorPaise)}
              onPress={() => router.push(`/sales/leads/${lead.id}` as never)}
            />
          ))}
        </ScrollView>
      )}

      <HelpBubble screenId="S4" />
      <RoleTabBar />
    </SafeAreaView>
  );
}
