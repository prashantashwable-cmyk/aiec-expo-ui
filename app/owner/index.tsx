import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

import { Card, LanguageSwitch, Text } from "@/components/ui";
import { OWNER_TODAY } from "@/contract/fixtures";
import { useFormat, useT } from "@/i18n";

const HEAT = [
  0.95, 0.6, 0.4, 0.1, 0.3, 0.1, 0.62, 0.95, 0.1, 0.42, 0.1, 0.22,
];

/**
 * The owner's four panels. Executive theme: very large type, charts over
 * tables, readable in ten seconds while standing.
 *
 * The System Efficiency Index takes the hero position rather than revenue,
 * because revenue can be bought with spending and efficiency cannot. If SEI
 * falls while revenue rises, the asset-light model is quietly becoming a
 * labour-heavy one, which is the outcome the whole structure exists to avoid.
 */
export default function OwnerPanelsScreen() {
  const t = useT();
  const f = useFormat();
  const d = OWNER_TODAY;

  return (
    <SafeAreaView className="flex-1" edges={["top", "left", "right"]}>
      <View className="flex-row items-center justify-between px-4 py-3">
        <Text variant="body" tone="muted">
          {t("common.today")}
        </Text>
        <LanguageSwitch />
      </View>

      <ScrollView contentContainerClassName="gap-3 px-4 pb-8">
        <Card tone="surface" bordered={false} className="p-5">
          <Text variant="caption" tone="subtle">
            {t("owner.efficiencyIndex")}
          </Text>
          <Text variant="display" weight="600" tone="success">
            {f.percent(d.seiPercent)}
          </Text>
          <Text variant="caption" tone="muted">
            {"+" + f.percent(d.seiDelta) + " · " + t("owner.target", { value: f.percent(d.seiTarget, 0) })}
          </Text>

          <View className="mt-4 gap-2">
            {d.breakdown.map((row) => (
              <View key={row.label} className="flex-row items-center justify-between">
                <Text variant="caption" tone="muted">
                  {row.label}
                </Text>
                <Text variant="caption" tone={row.good ? "success" : "warning"}>
                  {row.value}
                </Text>
              </View>
            ))}
          </View>
        </Card>

        <Card tone="surface" bordered={false} className="p-5">
          <Text variant="caption" tone="subtle">
            {t("owner.cashLive")}
          </Text>
          <View className="mt-3 gap-2">
            <Row label="Tokens" value={f.paise(d.tokensPaise)} />
            <Row label="Material cleared" value={f.paise(d.materialPaise)} />
            <Row label="Final payments" value={f.paise(d.finalPaise)} />
            <View className="my-1 h-px bg-line" />
            <Row label="Supplier out" value={f.paise(d.supplierPaise)} danger />
            <Row label="Worker payouts" value={f.paise(d.workerPaise)} danger />
          </View>

          <Text variant="caption" tone="subtle" className="mt-4">
            {t("owner.netMargin")}
          </Text>
          <View className="flex-row items-baseline gap-3">
            <Text variant="heading" weight="600">
              {f.paise(d.netMarginPaise)}
            </Text>
            <Text variant="body" tone="success">
              {f.percent(d.netMarginPercent)}
            </Text>
          </View>
          <Text variant="caption" tone="muted" className="mt-1">
            {"MTD " + f.paiseCompact(d.mtdNetPaise) + " · +" + f.percent(d.mtdDeltaPercent, 0)}
          </Text>
        </Card>

        <Card tone="surface" bordered={false} className="p-5">
          <View className="flex-row items-center justify-between">
            <Text variant="caption" tone="subtle">
              {t("owner.growthHeatmap")}
            </Text>
            <Text variant="caption" tone="subtle">
              {t("owner.expandHere")}
            </Text>
          </View>
          <View className="mt-3 flex-row flex-wrap gap-1">
            {HEAT.map((intensity, i) => (
              <View
                key={i}
                className="h-7 flex-1 rounded"
                style={{
                  minWidth: 40,
                  backgroundColor: "rgba(132,204,22," + (0.12 + intensity * 0.8) + ")",
                }}
              />
            ))}
          </View>
          <View className="mt-3 flex-row items-baseline justify-between">
            <View>
              <Text variant="body">Wakad</Text>
              <Text variant="caption" tone="subtle">
                {"est. " + f.count(340) + " lifts / year"}
              </Text>
            </View>
            <Text variant="body" tone="success">
              {f.count(9) + " riders needed"}
            </Text>
          </View>
        </Card>

        <Card tone="surface" bordered={false} className="p-5">
          <Text variant="caption" tone="subtle">
            {t("owner.strategicAlerts")}
          </Text>
          <View className="mt-3 gap-3">
            {d.alerts.map((alert) => (
              <View key={alert.title} className="flex-row items-start gap-3">
                <Feather
                  name={alert.icon as keyof typeof Feather.glyphMap}
                  size={18}
                  className="text-warning"
                />
                <View className="flex-1">
                  <Text variant="body">{alert.title}</Text>
                  <Text variant="caption" tone="subtle">
                    {alert.detail}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

function Row({
  label,
  value,
  danger,
}: {
  label: string;
  value: string;
  danger?: boolean;
}) {
  return (
    <View className="flex-row items-baseline justify-between">
      <Text variant="caption" tone="muted">
        {label}
      </Text>
      <Text variant="body" tone={danger ? "danger" : "default"}>
        {value}
      </Text>
    </View>
  );
}
