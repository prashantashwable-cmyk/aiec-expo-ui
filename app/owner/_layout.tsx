import { Stack } from "expo-router";

import { RoleThemeProvider } from "@/design/theme-provider";
import { ROLE_DEFAULT_LANGUAGE } from "@/design/themes";
import { RoleLanguageDefault } from "@/i18n";

export default function OwnerLayout() {
  return (
    <RoleThemeProvider role="owner">
      <RoleLanguageDefault language={ROLE_DEFAULT_LANGUAGE.owner} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "transparent" },
        }}
      />
    </RoleThemeProvider>
  );
}
