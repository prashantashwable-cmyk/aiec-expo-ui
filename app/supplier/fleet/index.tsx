import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { HelpBubble, MapShell, RoleTabBar } from "@/components/anatomy";
import { ListRow, ScreenHeader } from "@/components/ui";
import { SUPPLIER_ORDERS } from "@/contract/fixtures-console";
import { CONTAINER_ROUTE, FLEET_PINS, PUNE } from "@/contract/geo";
import { useFormat, useT } from "@/i18n";

/**
 * P4 Live fleet map — layer 2.
 *
 * Every container is a moving pin, visible to the supplier, the admin and its
 * own customer at the same time. Route deviation over two kilometres raises an
 * alert; off-hours motion trips the siren and pushes a CCTV clip to all three.
 */
export default function FleetMapScreen() {
  const t = useT();
  const f = useFormat();
  const inTransit = SUPPLIER_ORDERS.filter((o) => o.state === "transit");

  return (
    <SafeAreaView className="flex-1" edges={["top", "left", "right"]}>
      <ScreenHeader title={t("screens.fleetMap")} screenId="P4" showBack={false} />

      <View className="flex-1">
        <MapShell
          center={PUNE}
          zoom={11}
          pins={FLEET_PINS}
          trail={CONTAINER_ROUTE}
        />
      </View>

      <View className="gap-2 p-3">
        {inTransit.map((order) => (
          <ListRow
            key={order.id}
            title={order.site}
            subtitle={order.id}
            monoSubtitle
            icon="truck"
            iconTone="text-warning"
            meta={f.paise(order.valuePaise)}
          />
        ))}
      </View>

      <HelpBubble screenId="P4" />
      <RoleTabBar />
    </SafeAreaView>
  );
}
