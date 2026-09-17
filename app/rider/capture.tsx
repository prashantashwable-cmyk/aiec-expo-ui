import { useRouter } from "expo-router";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

import { HelpBubble } from "@/components/anatomy";
import { Button, Card, Pill, Text } from "@/components/ui";
import { RIDER_CAPTURE } from "@/contract/fixtures";
import { useThemeSpec } from "@/design/theme-provider";
import { useT } from "@/i18n";

/**
 * R2 Capture confirm, the last of the three taps.
 *
 * Everything is pre-filled by OCR and nothing is mandatory: the design target
 * is eleven seconds with a helmet on, and a required field would blow it.
 * The lead ID already exists, stamped at creation with all three photos
 * attached, because there is no attach-to-job step anywhere in this product.
 *
 * There is no gallery picker on this screen and there never will be. Evidence
 * comes from the in-app camera only.
 */
export default function CaptureConfirmScreen() {
  const t = useT();
  const router = useRouter();
  const spec = useThemeSpec();

  return (
    <SafeAreaView className="flex-1" edges={["top", "left", "right"]}>
      <View className="border-b border-line px-4 py-3">
        <Text variant="heading" weight="600">
          {t("rider.checkAndSend")}
        </Text>
        <Text variant="caption" tone="muted">
          {t("rider.nothingRequired")}
        </Text>
      </View>

      <ScrollView contentContainerClassName="gap-4 p-4">
        <View className="flex-row gap-2">
          {RIDER_CAPTURE.photos.map((photo) => (
            <View
              key={photo.id}
              className="h-24 flex-1 items-end justify-end bg-surface p-1.5"
              style={{ borderRadius: spec.radius }}
              accessibilityLabel={photo.label}
            >
              <Feather name="check-circle" size={20} className="text-success" />
            </View>
          ))}
        </View>

        <Card className="gap-3 p-4">
          <View className="flex-row items-center gap-2">
            <Feather name="cpu" size={16} className="text-warning" />
            <Text variant="caption" tone="warning">
              {t("rider.autoDetected")}
            </Text>
          </View>

          <View className="flex-row items-start gap-3">
            <Feather name="map-pin" size={20} className="text-subtle" />
            <Text variant="body" className="flex-1">
              {RIDER_CAPTURE.address}
            </Text>
          </View>
          <View className="flex-row items-center gap-3">
            <Feather name="home" size={20} className="text-subtle" />
            <Text variant="body">{RIDER_CAPTURE.builder}</Text>
          </View>
          <View className="flex-row items-center gap-3">
            <Feather name="phone" size={20} className="text-subtle" />
            <Text variant="body">{RIDER_CAPTURE.phone}</Text>
          </View>

          <View className="flex-row gap-2">
            <Pill label={t("rider.floors") + " " + RIDER_CAPTURE.floors} />
            <Pill label={t("rider.shaftReady")} tone="success" />
          </View>
        </Card>

        <Card bordered className="flex-row items-center gap-3 border-dashed p-4">
          <Feather name="mic" size={22} className="text-primary" />
          <Text variant="body" tone="muted">
            {t("rider.addVoiceNote")}
          </Text>
        </Card>

        <Text variant="caption" tone="subtle" style={{ fontFamily: "monospace" }}>
          {RIDER_CAPTURE.leadId}
        </Text>
      </ScrollView>

      <View className="px-4 pb-4">
        <Button label={t("common.submit")} onPress={() => router.push("/rider/earnings")} />
      </View>

      <HelpBubble screenId="R2" />
    </SafeAreaView>
  );
}
