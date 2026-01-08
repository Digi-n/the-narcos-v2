import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
  TextChannel
} from "discord.js";
import { loadStock } from "../utils/stockStore";
import { stockButtons } from "../components/stockButtons";

export const setupStockCommand = {
  data: new SlashCommandBuilder()
    .setName("setup_stock")
    .setDescription("Create Weed, Meth & Distribution stock panels"),

  async execute(interaction: ChatInputCommandInteraction) {

    // ✅ ACK silently (no banner, no timeout)
    await interaction.reply({
      content: "✅ Stock panels created",
      ephemeral: true
    });

    // ✅ ENSURE GUILD TEXT CHANNEL
    if (!interaction.channel || interaction.channel.type !== 0) return;
    const channel = interaction.channel as TextChannel;

    const stock = loadStock();

    // 🌿 WEED
    await channel.send({
      embeds: [
        new EmbedBuilder()
          .setTitle("🌿 WEED STOCK")
          .setDescription(`Current Stock: **${stock.weed} g**`)
          .setColor(0x1aff00)
      ],
      components: [stockButtons("weed")]
    });

    // 🧪 METH
    await channel.send({
      embeds: [
        new EmbedBuilder()
          .setTitle("🧪 METH STOCK")
          .setDescription(`Current Stock: **${stock.meth} g**`)
          .setColor(0x00b3ff)
      ],
      components: [stockButtons("meth")]
    });

    // 🚚 DISTRIBUTION
    await channel.send({
      embeds: [
        new EmbedBuilder()
          .setTitle("🚚 DISTRIBUTION LOG")
          .setDescription(`Total Distributed: **${stock.distribution} g**`)
          .setColor(0xff0000)
      ],
      components: [stockButtons("distribution")]
    });
  }
};
