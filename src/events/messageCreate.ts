import {
  Client,
  Message,
  ChannelType,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  TextChannel,
} from "discord.js";
import { getMafiaReply } from "../features/ai/ai";
import { activeApplications } from "../features/core/apply";
import { questions } from "../features/core/questions";
import { CONFIG } from "../config/config";

export function registerMessageEvent(client: Client) {
  client.on("messageCreate", async (message: Message) => {
    // Ignore bots
    if (message.author.bot) return;

    // ==========================================
    // 1. HANDLE DM APPLICATIONS
    // ==========================================
    if (message.channel.type === ChannelType.DM) {
      if (activeApplications.has(message.author.id)) {
        const app = activeApplications.get(message.author.id)!;

        // Save answer
        app.answers.push(message.content);
        app.index++;

        // Next Question?
        if (app.index < questions.length) {
          await message.author.send(
            `**Question ${app.index + 1}/${questions.length}:**\n${questions[app.index]
            }`
          );
          return;
        }

        // FINISHED!
        await message.author.send(
          "✅ **Application Received!**\nThank you for applying. Management will review your answers shortly."
        );

        // Remove from active
        activeApplications.delete(message.author.id);

        // SEND TO LOG CHANNEL
        try {
          const logChannel = client.channels.cache.get(
            CONFIG.CHANNELS.APPLY_LOG
          ) as TextChannel;

          if (logChannel) {
            const embed = new EmbedBuilder()
              .setTitle("📝 New Application Received")
              .setAuthor({
                name: message.author.tag,
                iconURL: message.author.displayAvatarURL(),
              })
              .setDescription(`**User:** <@${message.author.id}>`)
              .setColor(0xffd700)
              .setTimestamp();

            // Add fields for questions/answers
            questions.forEach((q, i) => {
              embed.addFields({
                name: `${i + 1}. ${q}`,
                value: app.answers[i] || "No answer",
              });
            });

            // Buttons
            const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
              new ButtonBuilder()
                .setCustomId(`accept_${message.author.id}`)
                .setLabel("Accept")
                .setStyle(ButtonStyle.Success),
              new ButtonBuilder()
                .setCustomId(`accept_reason_${message.author.id}`)
                .setLabel("Accept w/ Reason")
                .setStyle(ButtonStyle.Secondary),
              new ButtonBuilder()
                .setCustomId(`deny_${message.author.id}`)
                .setLabel("Deny")
                .setStyle(ButtonStyle.Danger),
              new ButtonBuilder()
                .setCustomId(`deny_reason_${message.author.id}`)
                .setLabel("Deny w/ Reason")
                .setStyle(ButtonStyle.Secondary)
            );

            await logChannel.send({ embeds: [embed], components: [row] });
          } else {
            console.error(
              "❌ Apply Log Channel not found. Check CONFIG.CHANNELS.APPLY_LOG"
            );
          }
        } catch (err) {
          console.error("❌ Error sending application to log channel:", err);
        }

        return;
      }
    }

    // ==========================================
    // 2. HANDLE MENTIONS (AI CHAT)
    // ==========================================
    if (message.mentions.has(client.user!) && !message.mentions.everyone) {
      // Typing indicator
      if ("sendTyping" in message.channel) {
        await (message.channel as any).sendTyping();
      }

      const userMessage = message.content
        .replace(`<@${client.user?.id}>`, "")
        .trim();

      if (!userMessage) {
        await message.reply("Que paso? You summon me without words?");
        return;
      }

      const reply = await getMafiaReply(message.author.username, userMessage);
      await message.reply(reply);
    }
  });
}
