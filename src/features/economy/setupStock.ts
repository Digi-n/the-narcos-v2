import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
  TextChannel,
  GuildMember
} from "discord.js";
import { loadStock } from "./stockStore";
import { stockButtons } from "../../components/stockButtons";
import { CONFIG } from "../../config/config";

export const setupStockCommand = {
  data: new SlashCommandBuilder()
    .setName("setup_stock")
    .setDescription("Create Weed, Meth & Distribution stock panels"),

  async execute(interaction: ChatInputCommandInteraction) {
    const member = interaction.member as GuildMember;
    if (!member.roles.cache.has(CONFIG.RESTRICTED_ROLE_ID)) {
      return interaction.reply({
        content: "❌ You do not have permission to use this command.",
        flags: 64
      });
    }

    // ✅ ACK silently (no banner, no timeout)
    await interaction.reply({
      content: "✅ Stock panels created",
      flags: 64
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
