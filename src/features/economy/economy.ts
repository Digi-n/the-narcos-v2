import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { getUserEconomy } from "../cards/cardStore";
import { CONFIG } from "../../config/config";

// --- BALANCE ---
export const balanceCommand = {
    data: new SlashCommandBuilder()
        .setName("balance")
        .setDescription("Check your Narcos wallet"),

    async execute(interaction: any) {
        const userId = interaction.user.id;
        const eco = getUserEconomy(userId);

        const embed = new EmbedBuilder()
            .setTitle(`💰 Wallet: ${interaction.user.username}`)
            .setColor(0xffd700)
            .addFields(
                { name: "Coins", value: `${eco.coins.toLocaleString()} 🪙`, inline: true },
                { name: "Gems", value: `${eco.gems.toLocaleString()} 💎`, inline: true }
            )
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};


