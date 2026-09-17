import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

import { HelpBubble, RoleTabBar } from "@/components/anatomy";
import { Card, ScreenHeader, Text } from "@/components/ui";
import { TECHNICIAN_KITS } from "@/contract/fixtures-detail";
import { useThemeSpec } from "@/design/theme-provider";
import { useT } from "@/i18n";

/**
 * P2 Kit packing — layer 2. The micro-theft firewall.
 *
 * Not a loose pile of bolts and cable, but phase-sealed pouches, each with its
 * own KITB id and QR, each openable only at the site at a specific verified
 * SOP stage. The cable length is computed from the shaft height, so a request
 * for extra cable is an anomaly the system flags rather than a routine phone
 * call to the office.
 */
export default function KitPackingScreen() {
  const t = useT();
  const spec = useThemeSpec();

  return (
    <SafeAreaView className="flex-1" edges={["top", "left", "right"]}>
      <ScreenHeader title={t("screens.kitPacking")} screenId="P2" showBack={false} />

      <ScrollView contentContainerClassName="gap-2 p-3">
        {TECHNICIAN_KITS.map((kit) => (
          <Card key={kit.id} className="flex-row items-center gap-3 p-3">
            <View
              className="items-center justify-center bg-surface"
              style={{ width: 44, height: 44, borderRadius: spec.radius }}
            >
              <Feather name="maximize" size={20} className="text-foreground" />
            </View>

            <View className="min-w-0 flex-1">
              <Text variant="body" weight="600">
                {kit.code}
              </Text>
              <Text variant="caption" tone="subtle" numberOfLines={1}>
                {kit.contents}
              </Text>
              <Text variant="caption" tone="muted" style={{ fontFamily: "monospace" }}>
                {kit.id}
              </Text>
            </View>

            <Feather
              name={kit.state === "sealed" ? "lock" : "check-circle"}
              size={spec.textLarge}
              className={kit.state === "sealed" ? "text-primary" : "text-success"}
            />
          </Card>
        ))}

        <Text variant="caption" tone="subtle" className="px-1 pt-2">
          {t("console.scanKit")}
        </Text>
      </ScrollView>

      <HelpBubble screenId="P2" />
      <RoleTabBar />
    </SafeAreaView>
  );
}
