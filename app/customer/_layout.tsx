import { Stack } from "expo-router";

import { RoleThemeProvider } from "@/design/theme-provider";
import { ROLE_DEFAULT_LANGUAGE } from "@/design/themes";
import { RoleLanguageDefault } from "@/i18n";

export default function CustomerLayout() {
  return (
    <RoleThemeProvider role="customer">
      <RoleLanguageDefault language={ROLE_DEFAULT_LANGUAGE.customer} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "transparent" },
        }}
      />
    </RoleThemeProvider>
  );
}
