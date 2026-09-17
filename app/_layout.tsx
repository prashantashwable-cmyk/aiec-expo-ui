import "../src/design/global.css";

import {
  DarkTheme,
  Stack,
  ThemeProvider as NavigationThemeProvider,
  type Theme,
} from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { I18nProvider } from "@/i18n";
import { deviceLanguage } from "@/i18n/device";

/**
 * The navigator paints its own screen background — rgb(242,242,242) in the
 * default light theme — inside our theme wrapper, which washed out every dark
 * role theme. Each role's ThemeProvider owns its background, so the navigator
 * is handed a transparent one and gets out of the way.
 *
 * These come from expo-router itself: since SDK 56 it vendors navigation
 * internally and is no longer compatible with the react-navigation packages.
 */
const TRANSPARENT_NAVIGATION_THEME: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: "transparent",
    card: "transparent",
  },
};

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <NavigationThemeProvider value={TRANSPARENT_NAVIGATION_THEME}>
        <I18nProvider initialLanguage={deviceLanguage()}>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: "transparent" },
            }}
          />
          <StatusBar style="auto" />
        </I18nProvider>
      </NavigationThemeProvider>
    </SafeAreaProvider>
  );
}
