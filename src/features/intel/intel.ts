import {
  SlashCommandBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  GuildMember
} from "discord.js";
import { CONFIG } from "../../config/config";

export const intelCommand = {
  data: new SlashCommandBuilder()
    .setName("intel")
    .setDescription("Submit classified intelligence anonymously"),

  async execute(interaction: any) {
    if (!interaction.isChatInputCommand()) return;

    const member = interaction.member as GuildMember;
    if (!member.roles.cache.has(CONFIG.RESTRICTED_ROLE_ID)) {
      return interaction.reply({
        content: "❌ You do not have permission to use this command.",
        flags: 64
      });
    }
    const modal = new ModalBuilder()
      .setCustomId("intel_modal")
      .setTitle("🕵️ Classified Intel");

    const titleInput = new TextInputBuilder()
      .setCustomId("intel_title")
      .setLabel("Intel Title")
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const contentInput = new TextInputBuilder()
      .setCustomId("intel_content")
      .setLabel("Intel Information")
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true);

    modal.addComponents(
      new ActionRowBuilder<TextInputBuilder>().addComponents(titleInput),
      new ActionRowBuilder<TextInputBuilder>().addComponents(contentInput)
    );

    await interaction.showModal(modal);
  },
};
