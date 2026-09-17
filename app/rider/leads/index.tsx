import { useRouter } from "expo-router";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { HelpBubble, RoleTabBar } from "@/components/anatomy";
import { EmptyState } from "@/components/states";
import { ListRow, ScreenHeader } from "@/components/ui";
import { RIDER_LEADS } from "@/contract/fixtures-detail";
import { MAP_COLORS } from "@/design/palette";
import { useFormat, useT } from "@/i18n";

/**
 * R3 My leads — layer 2.
 *
 * Every pin the rider dropped, with what it became. The commission column is
 * the point of the screen: a rider who cannot see whether their lead converted
 * has no reason to care about lead quality.
 */
export default function MyLeadsScreen() {
  const t = useT();
  const f = useFormat();
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1" edges={["top", "left", "right"]}>
      <ScreenHeader title={t("screens.myLeads")} screenId="R3" />

      {RIDER_LEADS.length === 0 ? (
        <EmptyState
          icon="map-pin"
          title={t("states.emptyTitle")}
          body={t("states.emptyLeads")}
          actionLabel={t("rider.startRide")}
          onAction={() => router.push("/rider")}
        />
      ) : (
        <ScrollView contentContainerClassName="gap-2 p-4">
          {RIDER_LEADS.map((lead) => (
            <View key={lead.id} className="flex-row items-stretch gap-2">
              <View
                style={{
                  width: 4,
                  borderRadius: 2,
                  backgroundColor: MAP_COLORS[lead.status],
                }}
              />
              <View className="flex-1">
                <ListRow
                  title={lead.site}
                  subtitle={lead.id}
                  monoSubtitle
                  meta={
                    lead.commissionPaise > 0
                      ? f.paise(lead.commissionPaise)
                      : f.paise(lead.creditPaise)
                  }
                  metaTone={lead.commissionCleared ? "success" : "warning"}
                  onPress={() => router.push(`/rider/leads/${lead.id}` as never)}
                />
              </View>
            </View>
          ))}
        </ScrollView>
      )}

      <HelpBubble screenId="R3" />
      <RoleTabBar />
    </SafeAreaView>
  );
}
