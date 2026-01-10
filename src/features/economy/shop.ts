import { SlashCommandBuilder, ChatInputCommandInteraction, GuildMember } from "discord.js";
import { CONFIG } from "../../config/config";
import { shopButtonsRow } from "../../events/shopButtons";

export const data = new SlashCommandBuilder()
  .setName("shop")
  .setDescription("Open black market shop");

export async function execute(interaction: ChatInputCommandInteraction) {
  const member = interaction.member as GuildMember;
  if (!member.roles.cache.has(CONFIG.RESTRICTED_ROLE_ID)) {
    return interaction.reply({
      content: "❌ You do not have permission to use this command.",
      flags: 64
    });
  }

  await interaction.reply({
    content: "🛒 **Black Market**\nChoose your cart:",
    components: [shopButtonsRow()],
    flags: 64
  });
}
