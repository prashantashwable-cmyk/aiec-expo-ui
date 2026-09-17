import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

import { HelpBubble } from "@/components/anatomy";
import { Card, ScreenHeader, Text } from "@/components/ui";
import { useThemeSpec } from "@/design/theme-provider";
import { useFormat, useT } from "@/i18n";

const RANKS = [
  { rank: 1, name: "Sunil P.", zone: "BAN", leads: 14, streak: 21, self: false },
  { rank: 2, name: "Imran S.", zone: "HAD", leads: 11, streak: 9, self: false },
  { rank: 3, name: "Ravi K.", zone: "KOT", leads: 8, streak: 11, self: true },
  { rank: 4, name: "Prakash D.", zone: "WAK", leads: 7, streak: 4, self: false },
  { rank: 5, name: "Amit J.", zone: "KOT", leads: 6, streak: 2, self: false },
];

/**
 * R6 Leaderboard — layer 2.
 *
 * Law 4, layer 3: loss aversion. A streak can be lost, and losing one hurts
 * more than gaining it felt good. That is what sustains the habit once the
 * novelty of the coin animation wears off.
 *
 * Ranking is by leads captured, not by earnings — earnings vary with zone
 * difficulty, and ranking on them would quietly punish whoever drew the
 * harder ground.
 */
export default function LeaderboardScreen() {
  const t = useT();
  const f = useFormat();
  const spec = useThemeSpec();

  return (
    <SafeAreaView className="flex-1" edges={["top", "left", "right"]}>
      <ScreenHeader title={t("screens.leaderboard")} screenId="R6" />

      <ScrollView contentContainerClassName="gap-2 p-4">
        {RANKS.map((entry) => (
          <Card
            key={entry.rank}
            className={`flex-row items-center gap-3 p-3 ${entry.self ? "border-primary" : ""}`}
          >
            <Text
              variant="heading"
              weight="600"
              tone={entry.rank <= 3 ? "primary" : "subtle"}
              style={{ width: 32 }}
            >
              {entry.rank}
            </Text>

            <View className="min-w-0 flex-1">
              <Text variant="body" weight={entry.self ? "600" : "400"} numberOfLines={1}>
                {entry.name}
              </Text>
              <Text variant="caption" tone="subtle">
                {entry.zone} · {f.count(entry.leads)}
              </Text>
            </View>

            <View className="flex-row items-center gap-1">
              <Feather name="zap" size={spec.textBase} className="text-warning" />
              <Text variant="body" weight="600" tone="warning">
                {f.count(entry.streak)}
              </Text>
            </View>
          </Card>
        ))}
      </ScrollView>

      <HelpBubble screenId="R6" />
    </SafeAreaView>
  );
}
