import {
  Message,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  TextChannel,
  Events
} from "discord.js";

import { activeApplications } from "../commands/apply";
import { questions } from "../utils/questions";
import { saveApplication } from "../utils/applicationStore";

// 🔴 APPLICATIONS CHANNEL ID
const APPLICATIONS_CHANNEL_ID = "1453666676594704488";

export function registerMessageEvent(client: any) {
  client.on(Events.MessageCreate, async (message: Message) => {
    if (message.author.bot) return;

    /* =========================
       📩 APPLICATION SYSTEM (DM ONLY)
    ========================== */
    if (!message.guild) {
      const data = activeApplications.get(message.author.id);
      if (!data) return;

      data.answers.push(message.content);
      data.index++;

      if (data.index >= questions.length) {
        activeApplications.delete(message.author.id);

        const duration = `${Math.floor(
          (Date.now() - data.start) / 1000
        )}s`;

        saveApplication(message.author.id, {
          answers: data.answers,
          status: "pending",
          duration,
        });

        const guild = client.guilds.cache.first();
        if (!guild) return;

        const member = await guild.members.fetch(message.author.id);
        const channel = guild.channels.cache.get(
          APPLICATIONS_CHANNEL_ID
        ) as TextChannel;
        if (!channel) return;

        const embed = new EmbedBuilder()
          .setTitle("📋 New Application Submitted")
          .setColor(0x2f3136)
          .setThumbnail(message.author.displayAvatarURL())
          .addFields(
            {
              name: "👤 User",
              value: `<@${message.author.id}> (${message.author.tag})`,
            },
            {
              name: "⏱ Duration",
              value: duration,
              inline: true,
            },
            {
              name: "📅 Joined Server",
              value: `<t:${Math.floor(
                (member.joinedTimestamp ?? Date.now()) / 1000
              )}:R>`,
              inline: true,
            }
          );

        questions.forEach((q, i) => {
          embed.addFields({
            name: `${i + 1}. ${q}`,
            value: data.answers[i] || "—",
          });
        });

        const row1 = new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder()
            .setCustomId(`accept_${message.author.id}`)
            .setLabel("Accept")
            .setStyle(ButtonStyle.Success),
          new ButtonBuilder()
            .setCustomId(`deny_${message.author.id}`)
            .setLabel("Deny")
            .setStyle(ButtonStyle.Danger)
        );

        const row2 = new ActionRowBuilder<ButtonBuilder>().addComponents(
          new ButtonBuilder()
            .setCustomId(`accept_reason_${message.author.id}`)
            .setLabel("Accept with reason")
            .setStyle(ButtonStyle.Success),
          new ButtonBuilder()
            .setCustomId(`deny_reason_${message.author.id}`)
            .setLabel("Deny with reason")
            .setStyle(ButtonStyle.Danger)
        );

        await channel.send({
          embeds: [embed],
          components: [row1, row2],
        });

        await message.reply(
          "✅ Your application has been submitted.\nOur management team will review it."
        );
        return;
      }

      await message.reply(
        `**Question ${data.index + 1}/${questions.length}:**\n${questions[data.index]}`
      );
      return;
    }
  });
}
