import { Stack } from "expo-router";

import { RoleThemeProvider } from "@/design/theme-provider";
import { ROLE_DEFAULT_LANGUAGE } from "@/design/themes";
import { RoleLanguageDefault } from "@/i18n";

export default function QcLayout() {
  return (
    <RoleThemeProvider role="qc">
      <RoleLanguageDefault language={ROLE_DEFAULT_LANGUAGE.qc} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "transparent" },
        }}
      />
    </RoleThemeProvider>
  );
}
