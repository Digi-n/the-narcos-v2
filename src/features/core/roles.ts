import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionFlagsBits,
} from "discord.js";

export const rolesCommand = {
  data: new SlashCommandBuilder()
    .setName("roles")
    .setDescription("Send role selection buttons")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction: ChatInputCommandInteraction) {
    const embed = {
      title: "🎮 Choose Your Game Roles",
      description:
        "**Click a button to get access:**\n\n" +
        "🟦 **PUBG** – PUBG chat & VC\n" +
        "🔥 **Free Fire** – Free Fire rooms\n" +
        "🔫 **Valorant** – Valorant zone\n\n" +
        "🎌 **Anime** – Anime discussions & updates\n\n" +
        "_You can select multiple roles_",
      color: 0x2b2d31,
    };

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setCustomId("role_pubg")
        .setLabel("PUBG")
        .setStyle(ButtonStyle.Primary),

      new ButtonBuilder()
        .setCustomId("role_freefire")
        .setLabel("Free Fire")
        .setStyle(ButtonStyle.Success),

      new ButtonBuilder()
        .setCustomId("role_valorant")
        .setLabel("Valorant")
        .setStyle(ButtonStyle.Danger),

      new ButtonBuilder()
        .setCustomId("role_anime")
        .setLabel("Anime")
        .setStyle(ButtonStyle.Secondary),

    );

    await interaction.reply({
      embeds: [embed],
      components: [row],
    });
  },
};
