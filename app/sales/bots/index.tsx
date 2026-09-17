import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { HelpBubble, RoleTabBar } from "@/components/anatomy";
import { EmptyState } from "@/components/states";
import { ListRow, ScreenHeader, Text } from "@/components/ui";
import { BOT_CONVERSATIONS } from "@/contract/fixtures-console";
import { useT } from "@/i18n";

/**
 * S3 Bot console — layer 2. Every automated conversation, live.
 *
 * The bot collects six data points and books the next step; it does not
 * improvise on price or specification, and every claim it makes is scripted
 * and logged. It hands off to a human the moment it detects frustration, a
 * price challenged more than twice, or any safety or legal question.
 */
export default function BotConsoleScreen() {
  const t = useT();
  const live = BOT_CONVERSATIONS.filter((c) => c.live);

  return (
    <SafeAreaView className="flex-1" edges={["top", "left", "right"]}>
      <ScreenHeader
        title={t("screens.botConsole")}
        screenId="S3"
        subtitle={`${live.length} / ${BOT_CONVERSATIONS.length}`}
        showBack={false}
      />

      {BOT_CONVERSATIONS.length === 0 ? (
        <EmptyState
          icon="message-circle"
          title={t("states.emptyTitle")}
          body={t("states.emptyLeads")}
        />
      ) : (
        <ScrollView contentContainerClassName="gap-2 p-3">
          {BOT_CONVERSATIONS.map((conversation) => (
            <ListRow
              key={conversation.id}
              title={conversation.site}
              subtitle={conversation.id}
              monoSubtitle
              icon={conversation.live ? "radio" : "clock"}
              iconTone={conversation.live ? "text-success" : "text-subtle"}
              meta={conversation.stage}
              metaTone="muted"
            />
          ))}

          <View className="px-1 pt-2">
            <Text variant="caption" tone="subtle">
              {t("console.escalated")}
            </Text>
          </View>
        </ScrollView>
      )}

      <HelpBubble screenId="S3" />
      <RoleTabBar />
    </SafeAreaView>
  );
}
