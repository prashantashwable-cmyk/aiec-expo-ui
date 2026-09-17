import { useRouter } from "expo-router";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

import { Button, LanguageSwitch, Text } from "@/components/ui";
import { ThemeProvider } from "@/design/theme-provider";
import { useT } from "@/i18n";

/**
 * Law 10 — two doors. Exactly two buttons, nothing else on screen.
 * No signup form, no email field, no "learn more" clutter.
 *
 * Language chips appear before login, so a Marathi-speaking rider never has
 * to read an English word to get in.
 */
export default function FirstRunScreen() {
  const t = useT();
  const router = useRouter();

  return (
    <ThemeProvider theme="premium">
      <SafeAreaView className="flex-1">
        <View className="flex-row justify-end px-5 pt-2">
          <LanguageSwitch />
        </View>

        <View className="flex-1 items-center justify-center gap-4 px-8">
          <View className="h-20 w-20 items-center justify-center rounded-2xl bg-primary">
            <Feather name="chevrons-up" size={40} className="text-primary-foreground" />
          </View>

          <Text variant="display" weight="600" className="text-center">
            {t("common.appName")}
          </Text>

          <Text variant="body" tone="muted" className="text-center">
            {t("common.tagline")}
          </Text>
        </View>

        <View className="gap-3 px-6 pb-8">
          <Button
            label={t("firstRun.continueWithGoogle")}
            variant="secondary"
            onPress={() => router.push("/demo")}
          />
          <Button
            label={t("firstRun.tryDemo")}
            variant="primary"
            onPress={() => router.push("/demo")}
          />
        </View>
      </SafeAreaView>
    </ThemeProvider>
  );
}
