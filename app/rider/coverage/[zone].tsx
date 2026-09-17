import { useLocalSearchParams } from "expo-router";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { HelpBubble, MapShell } from "@/components/anatomy";
import { EmptyState } from "@/components/states";
import { Card, ScreenHeader, Text } from "@/components/ui";
import { RIDER_LEADS, RIDER_ZONES } from "@/contract/fixtures-detail";
import { RIDER_HEAT, RIDER_PINS, ZONES } from "@/contract/geo";
import { useFormat, useT } from "@/i18n";

/**
 * R4.1 Zone detail — layer 3.
 *
 * The zone as the AI scores it, and the pins the rider has already dropped
 * inside it. The heat cells are the model output described in Part 2: new
 * building-plan approvals, historical conversion, days since last visit,
 * construction density. Darkest means go there now.
 */
export default function ZoneDetailScreen() {
  const t = useT();
  const f = useFormat();
  const { zone: code } = useLocalSearchParams<{ zone: string }>();
  const zone = RIDER_ZONES.find((z) => z.code === code);
  const leads = RIDER_LEADS.filter((l) => l.zone === code);

  if (!zone) {
    return (
      <SafeAreaView className="flex-1" edges={["top", "left", "right"]}>
        <ScreenHeader title={t("screens.zoneDetail")} screenId="R4.1" />
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
      <ScreenHeader title={zone.name} screenId="R4.1" subtitle={zone.code} />

      <View className="h-56">
        <MapShell
          center={ZONES[zone.code] ?? undefined}
          zoom={14}
          pins={RIDER_PINS.filter((p) => !p.foreign)}
          heat={RIDER_HEAT}
        />
      </View>

      <ScrollView contentContainerClassName="gap-3 p-4">
        <View className="flex-row gap-2">
          <Card tone="surface" bordered={false} className="flex-1 p-3">
            <Text variant="caption" tone="subtle">
              {t("detail.covered")}
            </Text>
            <Text variant="body" weight="600">
              {zone.coveredKm2} km²
            </Text>
          </Card>
          <Card tone="surface" bordered={false} className="flex-1 p-3">
            <Text variant="caption" tone="subtle">
              {t("detail.target")}
            </Text>
            <Text variant="body" weight="600">
              {zone.targetKm2} km²
            </Text>
          </Card>
          <Card tone="surface" bordered={false} className="flex-1 p-3">
            <Text variant="caption" tone="subtle">
              {t("detail.leadsHere")}
            </Text>
            <Text variant="body" weight="600">
              {f.count(zone.leads)}
            </Text>
          </Card>
        </View>

        {leads.length === 0 ? (
          <EmptyState
            icon="map-pin"
            title={t("states.emptyTitle")}
            body={t("states.emptyLeads")}
          />
        ) : (
          <View className="gap-2">
            <Text variant="caption" tone="muted">
              {t("screens.myLeads")}
            </Text>
            {leads.map((lead) => (
              <Card key={lead.id} className="p-3">
                <Text variant="body">{lead.site}</Text>
                <Text variant="caption" tone="subtle" style={{ fontFamily: "monospace" }}>
                  {lead.id}
                </Text>
              </Card>
            ))}
          </View>
        )}
      </ScrollView>

      <HelpBubble screenId="R4.1" />
    </SafeAreaView>
  );
}
