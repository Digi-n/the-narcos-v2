import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { getUserEconomy, addCoins, updateUserEconomy } from "../cards/cardStore";
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

// --- DAILY ---
export const dailyCommand = {
    data: new SlashCommandBuilder()
        .setName("daily")
        .setDescription("Claim your daily reward"),

    async execute(interaction: any) {
        const userId = interaction.user.id;
        const eco = getUserEconomy(userId);
        const now = Date.now();
        const cooldown = 24 * 60 * 60 * 1000; // 24 hours

        if (now - eco.lastDaily < cooldown) {
            const remaining = cooldown - (now - eco.lastDaily);
            const hours = Math.floor(remaining / (1000 * 60 * 60));
            const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));

            await interaction.reply({
                content: `⏳ You have already claimed your daily reward. Come back in **${hours}h ${minutes}m**.`,
                flags: 64,
            });
            return;
        }

        // Reward Logic
        let coins = 500;
        let gems = 10;
        const isSyndicate = interaction.member.roles.cache.has(CONFIG.ROLES.SYNDICATE);

        // Syndicate Bonus (1.5x)
        if (isSyndicate) {
            coins = Math.floor(coins * 1.5);
            gems = Math.floor(gems * 1.5);
        }

        updateUserEconomy(userId, {
            coins: eco.coins + coins,
            gems: eco.gems + gems,
            lastDaily: now,
        });

        const embed = new EmbedBuilder()
            .setTitle("📅 Daily Reward Claimed!")
            .setColor(0x00ff00)
            .setDescription(`You received:\n**+${coins} Coins** 🪙\n**+${gems} Gems** 💎`)
            .setFooter({ text: isSyndicate ? "Syndicate Member Bonus Applied! (1.5x)" : "Join the Syndicate for bigger rewards!" })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};
