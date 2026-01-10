import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
} from "discord.js";

// 🔴 PUT YOUR BOT ID HERE
const BOT_ID = "1458294328504881276";

export const activeApplications = new Map<
  string,
  { index: number; answers: string[]; start: number }
>();

export const applyCommand = {
  data: new SlashCommandBuilder()
    .setName("apply")
    .setDescription("Apply for recruitment"),

  async execute(interaction: ChatInputCommandInteraction) {
    try {
      // ✅ PREVENT TIMEOUT
      await interaction.deferReply({ flags: 64 });

      const embed = new EmbedBuilder()
        .setTitle("Recruit status")
        .setDescription(
          "Are you sure you want to apply?\n\n" +
          "Once started, you must complete all questions."
        )
        .setColor(0x2f3136);

      // START / CANCEL BUTTONS (DM)
      const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId("start_apply")
          .setLabel("Start application")
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId("cancel_apply")
          .setLabel("Cancel application")
          .setStyle(ButtonStyle.Danger)
      );

      // SEND DM
      await interaction.user.send({
        embeds: [embed],
        components: [row],
      });

      // CREATE DM + JUMP BUTTON
      const dm = await interaction.user.createDM();

      const jumpRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setLabel("Jump to application")
          .setStyle(ButtonStyle.Link)
          .setURL(dm.url)
      );

      // SERVER CONFIRMATION
      await interaction.editReply({
        content: "📩 Application started in your DMs.",
        components: [jumpRow],
      });

    } catch (error) {
      console.error("❌ /apply error:", error);

      if (interaction.deferred || interaction.replied) {
        await interaction.editReply({
          content:
            "❌ I couldn’t send you a DM.\n" +
            "Please enable **Direct Messages** from this server and try again.",
        });
      } else {
        await interaction.reply({
          content:
            "❌ Something went wrong.\nPlease try again or contact staff.",
          flags: 64,
        });
      }
    }
  },
};
