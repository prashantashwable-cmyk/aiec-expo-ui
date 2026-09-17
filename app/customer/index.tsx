import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Circle } from "react-native-svg";

import { HelpBubble, RoleTabBar } from "@/components/anatomy";
import { BlockedByGateState } from "@/components/states";
import { Card, LanguageSwitch, Text } from "@/components/ui";
import { CUSTOMER_LIFT } from "@/contract/fixtures";
import { useThemeColor } from "@/design/theme-provider";
import { useFormat, useT } from "@/i18n";

function ProgressRing({ percent }: { percent: number }) {
  const track = useThemeColor("--border");
  const fill = useThemeColor("--primary");
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const filled = (percent / 100) * circumference;

  return (
    <View className="h-24 w-24 items-center justify-center">
      <Svg width={96} height={96} style={{ position: "absolute" }}>
        <Circle cx={48} cy={48} r={radius} stroke={track} strokeWidth={9} fill="none" />
        <Circle
          cx={48}
          cy={48}
          r={radius}
          stroke={fill}
          strokeWidth={9}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference + " " + circumference}
          strokeDashoffset={circumference - filled}
          transform="rotate(-90 48 48)"
        />
      </Svg>
      <Text variant="heading" weight="600">
        {percent + "%"}
      </Text>
    </View>
  );
}

/**
 * C1 My lift. Premium theme, and the customer installs nothing to reach it.
 *
 * The screen is showing the seventh state: blocked by the pre-dispatch payment
 * gate. It names the gate, what unblocks it, who can act, and says plainly
 * that no override exists. A gate that blocks without explaining itself
 * produces a phone call to the office, which is the cost this app exists to
 * remove.
 */
export default function MyLiftScreen() {
  const t = useT();
  const f = useFormat();
  const lift = CUSTOMER_LIFT;

  return (
    <SafeAreaView className="flex-1" edges={["top", "left", "right"]}>
      <View className="flex-row items-start justify-between px-5 pb-3 pt-3">
        <View>
          <Text variant="caption" tone="subtle">
            {lift.site}
          </Text>
          <Text variant="heading" weight="600">
            {t("customer.yourLift")}
          </Text>
        </View>
        <LanguageSwitch />
      </View>

      <ScrollView contentContainerClassName="gap-5 px-5 pb-8">
        <View className="flex-row items-center gap-4">
          <ProgressRing percent={lift.percentComplete} />
          <View className="flex-1 gap-1">
            <Text variant="caption" tone="subtle">
              {t("customer.stageOf", { current: lift.stage, total: lift.totalStages })}
            </Text>
            <Text variant="heading" weight="600">
              {t("customer.materialArrived")}
            </Text>
            <Text variant="body" tone="muted">
              {f.time(lift.arrivedAt)}
            </Text>
          </View>
        </View>

        <BlockedByGateState
          gate="preDispatchPayment"
          actionLabel={t("customer.payNow")}
          onAction={() => undefined}
        />

        <Card className="gap-3 p-4">
          <View className="flex-row items-baseline justify-between">
            <Text variant="body" tone="muted">
              {t("customer.dueNow")}
            </Text>
            <Text variant="heading" weight="600">
              {f.paise(lift.duePaise)}
            </Text>
          </View>
          <View className="flex-row items-baseline justify-between">
            <Text variant="caption" tone="subtle">
              {t("customer.windowCloses", { hours: lift.hoursToWindowClose })}
            </Text>
          </View>
        </Card>

        <View className="flex-row gap-2">
          <Card tone="surface" bordered={false} className="flex-1 p-3">
            <Text variant="caption" tone="subtle">
              {t("customer.paidSoFar")}
            </Text>
            <Text variant="body" weight="600">
              {f.paise(lift.paidPaise)}
            </Text>
          </Card>
          <Card tone="surface" bordered={false} className="flex-1 p-3">
            <Text variant="caption" tone="subtle">
              {t("customer.daysToHandover")}
            </Text>
            <Text variant="body" weight="600">
              {f.count(lift.daysToHandover)}
            </Text>
          </Card>
          <Card tone="surface" bordered={false} className="flex-1 p-3">
            <Text variant="caption" tone="subtle">
              {t("customer.noc")}
            </Text>
            <Text variant="body" weight="600" tone="muted">
              {t("customer.locked")}
            </Text>
          </Card>
        </View>
      </ScrollView>

      <HelpBubble screenId="C1" />
      <RoleTabBar />
    </SafeAreaView>
  );
}
