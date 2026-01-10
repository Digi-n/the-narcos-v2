import { Client, Message } from "discord.js";
import { getMafiaReply } from "../features/ai/ai";

export function registerMessageEvent(client: Client) {
  client.on("messageCreate", async (message: Message) => {
    // Ignore bots
    if (message.author.bot) return;

    // Check if mentioned
    if (message.mentions.has(client.user!) && !message.mentions.everyone) {
      // Typing indicator
      if ('sendTyping' in message.channel) {
        await (message.channel as any).sendTyping();
      }

      const userMessage = message.content.replace(`<@${client.user?.id}>`, "").trim();

      if (!userMessage) {
        await message.reply("Que paso? You summon me without words?");
        return;
      }

      const reply = await getMafiaReply(message.author.username, userMessage);
      await message.reply(reply);
    }
  });
}
