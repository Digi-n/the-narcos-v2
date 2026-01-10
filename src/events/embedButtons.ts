import {
  Interaction,
  EmbedBuilder,
  TextChannel,
  GuildMember,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from "discord.js";

import { activeApplications } from "../features/core/apply";
import { questions } from "../features/core/questions";

/* =========================
   ROLE BUTTON MAP
========================= */
const ROLE_MAP: Record<string, string> = {
  role_pubg: "1455787876951527535",
  role_freefire: "1455790525360902229",
  role_valorant: "1455790668449579038",
  role_anime: "1455800551072731167",
};

// 🔴 CHANGE THESE IDS
const INTERVIEW_ROLE_ID = "1453665716653002774";
const INTERVIEW_VC_ID = "1453665716653002774";

export async function handleEmbedButtons(interaction: Interaction) {
  if (!interaction.isButton()) return;

  /* =========================
     APPLY – START APPLICATION
  ========================== */
  if (interaction.customId === "start_apply") {
    await interaction.deferReply({ flags: 64 });

    activeApplications.set(interaction.user.id, {
      index: 0,
      answers: [],
      start: Date.now(),
    });

    await interaction.user.send(
      `**Question 1/${questions.length}:**\n${questions[0]}`
    );

    return interaction.editReply({
      content: "✅ Application started. Check your DMs.",
    });
  }

  /* =========================
     APPLY – CANCEL
  ========================== */
  if (interaction.customId === "cancel_apply") {
    return interaction.reply({
      content: "❌ Application cancelled.",
      flags: 64,
    });
  }

  /* =========================
     EMBED SEND BUTTON
  ========================== */
  if (interaction.customId.startsWith("embed_send_")) {
    const channelId = interaction.customId.replace("embed_send_", "");
    const channel = interaction.guild?.channels.cache.get(channelId) as TextChannel;

    if (!channel) {
      return interaction.reply({
        content: "❌ Channel not found.",
        flags: 64,
      });
    }

    const previewEmbed = interaction.message.embeds[0];
    const finalEmbed = EmbedBuilder.from(previewEmbed).setFooter({
      text: "RP Management System",
    });

    const sentMessage = await channel.send({ embeds: [finalEmbed] });

    if (
      channel
        .permissionsFor(interaction.guild!.members.me!)
        ?.has("PinMessages")
    ) {
      await sentMessage.pin();
    }

    return interaction.update({
      content: "✅ Embed sent & pinned.",
      embeds: [],
      components: [],
    });
  }

  /* =========================
     EMBED CANCEL BUTTON
  ========================== */
  if (interaction.customId === "embed_cancel") {
    return interaction.update({
      content: "❌ Cancelled.",
      embeds: [],
      components: [],
    });
  }

  /* =========================
     ROLE BUTTONS
  ========================== */
  if (interaction.customId.startsWith("role_")) {
    const roleId = ROLE_MAP[interaction.customId];
    if (!roleId) return;

    const member = interaction.member as GuildMember;
    const role = interaction.guild?.roles.cache.get(roleId);
    if (!role) return;

    if (member.roles.cache.has(roleId)) {
      await member.roles.remove(roleId);
      return interaction.reply({
        content: `❌ Removed **${role.name}**`,
        flags: 64,
      });
    } else {
      await member.roles.add(roleId);
      return interaction.reply({
        content: `✅ Added **${role.name}**`,
        flags: 64,
      });
    }
  }

  /* =========================
     APPLY – ACCEPT (NO REASON)
  ========================== */
  if (interaction.customId.startsWith("accept_") && !interaction.customId.includes("reason")) {
    await interaction.deferReply({ flags: 64 });

    const userId = interaction.customId.split("_")[1];
    const guild = interaction.guild;
    if (!guild) return;

    const member = await guild.members.fetch(userId);

    await member.roles.add(INTERVIEW_ROLE_ID);

    const interviewVC = guild.channels.cache.get(INTERVIEW_VC_ID);
    if (interviewVC?.isVoiceBased()) {
      await interviewVC.permissionOverwrites.edit(userId, {
        Connect: true,
      });
    }

    await member.send(
      "✅ **Your application has been accepted.**\nYou can now join the **Interview Voice Channel**."
    );

    return interaction.editReply({
      content: `✅ Accepted <@${userId}> and unlocked interview VC.`,
    });
  }

  /* =========================
     APPLY – DENY (NO REASON)
  ========================== */
  if (interaction.customId.startsWith("deny_") && !interaction.customId.includes("reason")) {
    await interaction.deferReply({ flags: 64 });

    const userId = interaction.customId.split("_")[1];
    const member = await interaction.guild?.members.fetch(userId);

    if (member) {
      await member.send(
        "❌ **Your application has been denied.**\nYou may apply again later."
      );
    }

    return interaction.editReply({
      content: `❌ Application denied for <@${userId}>.`,
    });
  }

  /* =========================
     ACCEPT WITH REASON (MODAL)
  ========================== */
  if (interaction.customId.startsWith("accept_reason_")) {
    const userId = interaction.customId.split("_")[2];

    const modal = new ModalBuilder()
      .setCustomId(`accept_modal_${userId}`)
      .setTitle("Accept Application");

    const input = new TextInputBuilder()
      .setCustomId("reason")
      .setLabel("Reason for acceptance")
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true);

    modal.addComponents(
      new ActionRowBuilder<TextInputBuilder>().addComponents(input)
    );

    return interaction.showModal(modal);
  }

  /* =========================
     DENY WITH REASON (MODAL)
  ========================== */
  if (interaction.customId.startsWith("deny_reason_")) {
    const userId = interaction.customId.split("_")[2];

    const modal = new ModalBuilder()
      .setCustomId(`deny_modal_${userId}`)
      .setTitle("Deny Application");

    const input = new TextInputBuilder()
      .setCustomId("reason")
      .setLabel("Reason for denial")
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true);

    modal.addComponents(
      new ActionRowBuilder<TextInputBuilder>().addComponents(input)
    );

    return interaction.showModal(modal);
  }
}
