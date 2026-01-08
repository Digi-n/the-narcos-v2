import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";

export const pingCommand = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Check if bot is alive"),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.reply({
      content: "🏓 Pong!",
      ephemeral: true,
    });
  },
};
