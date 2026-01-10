import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
  GuildMember
} from "discord.js";
import { loadShopHistory } from "./shopHistory";

const MANAGEMENT_ROLES = ["Management", "Boss"];

export const data = new SlashCommandBuilder()
  .setName("history")
  .setDescription("View purchase history")
  .addSubcommand(sub =>
    sub.setName("shop").setDescription("View shop purchase history")
  );

export async function execute(interaction: ChatInputCommandInteraction) {
  const member = interaction.member as GuildMember | null;

  if (
    !member ||
    !member.roles.cache.some(role =>
      MANAGEMENT_ROLES.includes(role.name)
    )
  ) {
    await interaction.editReply({
      content: "❌ Only Management or Boss can use this command."
    });
    return;
  }

  const history = loadShopHistory();

  if (history.length === 0) {
    await interaction.editReply({
      content: "📭 No shop history found."
    });
    return;
  }

  let totalSpent = 0;
  let logText = "";

  for (const entry of history.slice(-10)) {
    totalSpent += entry.total;

    const itemList = Object.entries(entry.items)
      .map(([item, qty]) => `${item} × ${qty}`)
      .join(", ");

    logText +=
      `👤 <@${entry.buyerId}>\n` +
      `🧾 ${itemList}\n` +
      `💰 ₹${entry.total}\n` +
      `⏱ <t:${entry.timestamp}:R>\n\n`;
  }

  const embed = new EmbedBuilder()
    .setTitle("📜 Shop Purchase History")
    .setDescription(logText)
    .addFields({
      name: "💸 Total Spent (All Orders)",
      value: `₹${totalSpent}`,
      inline: false
    })
    .setColor(0x8b0000);

  await interaction.editReply({
    embeds: [embed]
  });
}
