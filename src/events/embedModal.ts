import {
  Interaction,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from "discord.js";

/* ======================================================
   MAIN MODAL HANDLER
====================================================== */
export async function handleEmbedModal(interaction: Interaction) {
  if (!interaction.isModalSubmit()) return;

  /* =========================
     EMBED CREATE MODAL
  ========================== */
  if (interaction.customId === "embed_modal") {
    const heading = interaction.fields.getTextInputValue("heading");
    const paragraph = interaction.fields.getTextInputValue("paragraph");
    const colorInput =
      interaction.fields.getTextInputValue("color") || "orange";
    const channelId = interaction.fields.getTextInputValue("channel");

    const colors: Record<string, number> = {
      red: 0xff0000,
      blue: 0x3498db,
      green: 0x2ecc71,
      orange: 0xff6a00,
    };

    const color =
      colors[colorInput.toLowerCase()] ??
      parseInt(colorInput.replace("#", ""), 16) ??
      colors.orange;

    const embed = new EmbedBuilder()
      .setTitle(heading)
      .setDescription(paragraph)
      .setColor(color)
      .setFooter({ text: "Preview Mode" });

    const buttons = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId(`embed_send_${channelId}`)
        .setLabel("✅ Send")
        .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId("embed_cancel")
        .setLabel("❌ Cancel")
        .setStyle(ButtonStyle.Danger)
    );

    await interaction.reply({
      content: "👀 Embed Preview",
      embeds: [embed],
      components: [buttons],
      ephemeral: true,
    });

    return;
  }

  /* =========================
     ACCEPT / DENY WITH REASON
  ========================== */
  if (
    interaction.customId.startsWith("accept_modal_") ||
    interaction.customId.startsWith("deny_modal_")
  ) {
    await interaction.deferReply({ ephemeral: true });

    const [action, , userId] = interaction.customId.split("_");
    const reason = interaction.fields.getTextInputValue("reason");

    const guild = interaction.guild;
    if (!guild) return;

    const member = await guild.members.fetch(userId);

    if (action === "accept") {
      await member.send(
        `✅ **Your application has been accepted**\n\n📝 Reason:\n${reason}`
      );

      await interaction.editReply({
        content: `✅ Accepted <@${userId}> with reason.`,
      });

      return;
    }

    if (action === "deny") {
      await member.send(
        `❌ **Your application has been denied**\n\n📝 Reason:\n${reason}`
      );

      await interaction.editReply({
        content: `❌ Denied <@${userId}> with reason.`,
      });

      return;
    }
  }
}
