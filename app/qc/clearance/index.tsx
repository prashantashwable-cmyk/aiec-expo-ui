import { useRouter } from "expo-router";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ChecklistRow, HelpBubble, RoleTabBar } from "@/components/anatomy";
import { Button, ScreenHeader, Text } from "@/components/ui";
import { QC_SHAFT_CHECKLIST } from "@/contract/fixtures-detail";
import { useT } from "@/i18n";

/**
 * Q2 Shaft clearance checklist — layer 2. Eighteen items, each needing a photo.
 *
 * One dimensional error caught here saves five to ten days of rework and
 * several thousand rupees of wasted labour, which is why the checklist is this
 * long and why every item that is not a PASS carries a mandatory note.
 *
 * The bonus is paid for catching defects that are later confirmed, never for
 * passing quickly. An inspector who passes everything is not rewarded.
 */
export default function ShaftClearanceScreen() {
  const t = useT();
  const router = useRouter();

  const groups = QC_SHAFT_CHECKLIST.reduce<Record<string, typeof QC_SHAFT_CHECKLIST>>(
    (acc, item) => {
      acc[item.group] = acc[item.group] ?? [];
      acc[item.group].push(item);
      return acc;
    },
    {},
  );

  const done = QC_SHAFT_CHECKLIST.filter((i) => i.verdict !== "pending").length;

  return (
    <SafeAreaView className="flex-1" edges={["top", "left", "right"]}>
      <ScreenHeader
        title={t("screens.shaftChecklist")}
        screenId="Q2"
        subtitle={`${done} / ${QC_SHAFT_CHECKLIST.length}`}
        showBack={false}
      />

      <ScrollView contentContainerClassName="gap-4 p-4">
        {Object.entries(groups).map(([group, items]) => (
          <View key={group} className="gap-2">
            <Text variant="caption" tone="muted">
              {group}
            </Text>
            {items.map((item) => (
              <View
                key={item.id}
                onTouchEnd={() => router.push(`/qc/clearance/${item.id}` as never)}
              >
                <ChecklistRow
                  label={item.label}
                  verdict={item.verdict}
                  note={item.note}
                />
              </View>
            ))}
          </View>
        ))}

        <Button label={t("screens.reportBuilder")} onPress={() => router.push("/qc/reports" as never)} />
      </ScrollView>

      <HelpBubble screenId="Q2" />
      <RoleTabBar />
    </SafeAreaView>
  );
}
