import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";
import { shopButtonsRow } from "../events/shopButtons";

export const data = new SlashCommandBuilder()
  .setName("shop")
  .setDescription("Open black market shop");

export async function execute(interaction: ChatInputCommandInteraction) {
  await interaction.reply({
    content: "🛒 **Black Market**\nChoose your cart:",
    components: [shopButtonsRow()],
    ephemeral: true
  });
}
