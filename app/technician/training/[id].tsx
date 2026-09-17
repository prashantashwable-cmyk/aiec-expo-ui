import { useLocalSearchParams } from "expo-router";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

import { HelpBubble } from "@/components/anatomy";
import { Button, Card, ScreenHeader, Text } from "@/components/ui";
import { useThemeSpec } from "@/design/theme-provider";
import { useT } from "@/i18n";

/**
 * T8.1 Training module — layer 3.
 *
 * Video with subtitles and audio in the active language, per Law 6. The
 * language switch reaches the training track too, which is the part most
 * builds forget: translating the interface and leaving the teaching in English
 * is how you end up with a workforce that can navigate the app but cannot
 * learn from it.
 */
export default function TrainingModuleScreen() {
  const t = useT();
  const spec = useThemeSpec();
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <SafeAreaView className="flex-1" edges={["top", "left", "right"]}>
      <ScreenHeader title={t("screens.trainingModule")} screenId="T8.1" subtitle={id} />

      <ScrollView contentContainerClassName="gap-4 p-4">
        <View
          className="items-center justify-center bg-surface"
          style={{ height: 200, borderRadius: spec.radius }}
        >
          <Feather name="play-circle" size={56} className="text-primary" />
        </View>

        <Card className="gap-2 p-4">
          <Text variant="caption" tone="subtle">
            {t("screens.training")}
          </Text>
          <Text variant="body">
            {t("technician.frameGuide")}
          </Text>
        </Card>

        <Button label={t("technician.startStep")} onPress={() => undefined} />
      </ScrollView>

      <HelpBubble screenId="T8.1" />
    </SafeAreaView>
  );
}
