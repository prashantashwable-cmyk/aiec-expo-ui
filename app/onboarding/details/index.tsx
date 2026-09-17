import { useRouter } from "expo-router";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

import { HelpBubble, RoleTabBar } from "@/components/anatomy";
import { Button, Card, ScreenHeader, Text } from "@/components/ui";
import { useThemeSpec } from "@/design/theme-provider";
import { useT } from "@/i18n";
import type { TranslationKey } from "@/i18n";

const STEPS = [
  { id: "aadhaar", labelKey: "kyc.aadhaar", icon: "credit-card", done: true },
  { id: "pan", labelKey: "kyc.pan", icon: "file-text", done: true },
  { id: "bank", labelKey: "kyc.bank", icon: "home", done: false },
  { id: "address", labelKey: "kyc.address", icon: "map-pin", done: false },
  { id: "selfie", labelKey: "kyc.selfie", icon: "camera", done: false },
  { id: "emergency", labelKey: "kyc.emergency", icon: "phone", done: false },
] as const satisfies ReadonlyArray<{
  id: string;
  labelKey: TranslationKey;
  icon: keyof typeof Feather.glyphMap;
  done: boolean;
}>;

/**
 * B3 Your details — layer 2. Same-day onboarding.
 *
 * The promise is under forty-eight hours from "I want to start" to "first job
 * accepted". Anything slower and the candidate takes another job, so the
 * verification steps run in parallel rather than in sequence and the partner
 * agreement is e-signed in the language they already chose.
 *
 * The selfie is a live capture. There is no gallery option here, for the same
 * reason there is none anywhere else in this product.
 */
export default function DetailsScreen() {
  const t = useT();
  const router = useRouter();
  const spec = useThemeSpec();
  const done = STEPS.filter((s) => s.done).length;

  return (
    <SafeAreaView className="flex-1" edges={["top", "left", "right"]}>
      <ScreenHeader
        title={t("screens.kyc")}
        screenId="B3"
        subtitle={`${done} / ${STEPS.length}`}
        showBack={false}
      />

      <ScrollView contentContainerClassName="gap-2 p-4">
        {STEPS.map((step) => (
          <Card key={step.id} className="flex-row items-center gap-3 p-4">
            <Feather
              name={step.icon}
              size={spec.textLarge}
              className={step.done ? "text-success" : "text-subtle"}
            />
            <Text variant="body" className="flex-1">
              {t(step.labelKey)}
            </Text>
            <Feather
              name={step.done ? "check-circle" : "chevron-right"}
              size={spec.textBase}
              className={step.done ? "text-success" : "text-subtle"}
            />
          </Card>
        ))}

        <View className="pt-2">
          <Button
            label={t("common.next")}
            onPress={() => router.push("/onboarding/training" as never)}
          />
        </View>
      </ScrollView>

      <HelpBubble screenId="B3" />
      <RoleTabBar />
    </SafeAreaView>
  );
}
