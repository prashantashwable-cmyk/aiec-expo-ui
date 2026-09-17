import { useRouter } from "expo-router";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { HelpBubble, RoleTabBar } from "@/components/anatomy";
import { ListRow, ScreenHeader } from "@/components/ui";
import { ADMIN_APPROVALS } from "@/contract/fixtures-console";
import { useFormat, useT } from "@/i18n";

const KIND_ICON = {
  evidence: "camera",
  margin: "percent",
  suspension: "user-x",
  penalty: "alert-triangle",
  refund: "corner-down-left",
} as const;

/**
 * A4 Approval desk — layer 2.
 *
 * The small number of things a machine should not decide alone. Anything
 * below the margin floor is listed but not decidable here: admin sees it,
 * admin cannot approve it, and it routes to the owner. A queue that shows
 * only what you are allowed to approve hides the fact that a limit exists.
 */
export default function ApprovalDeskScreen() {
  const t = useT();
  const f = useFormat();
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1" edges={["top", "left", "right"]}>
      <ScreenHeader title={t("screens.approvalDesk")} screenId="A4" showBack={false} />

      <ScrollView contentContainerClassName="gap-2 p-3">
        {ADMIN_APPROVALS.map((approval) => (
          <ListRow
            key={approval.id}
            title={approval.title}
            subtitle={approval.id}
            monoSubtitle
            icon={KIND_ICON[approval.kind]}
            iconTone={approval.adminCanDecide ? "text-primary" : "text-gate"}
            meta={approval.paise ? f.paise(approval.paise) : t("console.ownerOnly")}
            metaTone={approval.adminCanDecide ? "default" : "gate"}
            onPress={() => router.push(`/admin/approvals/${approval.id}` as never)}
          />
        ))}
      </ScrollView>

      <HelpBubble screenId="A4" />
      <RoleTabBar />
    </SafeAreaView>
  );
}
