import { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } from "discord.js";
import {
    getAllCards,
    getUserInventory,
    addCardToInventory,
    getUserEconomy,
    removeCoins,
    Card
} from "./cardStore";

const GACHA_COST = 500;

// --- GACHA PULL ---
export const gachaCommand = {
    data: new SlashCommandBuilder()
        .setName("gacha")
        .setDescription(`Pull a random card for ${GACHA_COST} Coins`),

    async execute(interaction: any) {
        const userId = interaction.user.id;

        if (!removeCoins(userId, GACHA_COST)) {
            await interaction.reply({
                content: `❌ You need **${GACHA_COST} Coins** to pull a card! Use \`/daily\` or play games to earn more.`,
                flags: 64
            });
            return;
        }

        const cards = getAllCards();
        // Simple random selection (Weighted logic can be added later)
        const card = cards[Math.floor(Math.random() * cards.length)];

        addCardToInventory(userId, card.id);

        // Determine color based on rarity
        const colors: Record<string, number> = {
            "Common": 0xbdc3c7,
            "Rare": 0x3498db,
            "Epic": 0x9b59b6,
            "Legendary": 0xf1c40f,
            "Mythic": 0xe74c3c
        };

        const embed = new EmbedBuilder()
            .setTitle(`🎴 Gacha Pull!`)
            .setDescription(`You obtained: **${card.name}**`)
            .setImage(card.image)
            .setColor(colors[card.rarity] || 0xffffff)
            .addFields(
                { name: "Rarity", value: card.rarity, inline: true },
                { name: "Element", value: card.element, inline: true },
                { name: "Stats", value: `⚔️ ${card.stats.atk} | 🛡️ ${card.stats.def} | ❤️ ${card.stats.hp}`, inline: false }
            )
            .setFooter({ text: card.description });

        await interaction.reply({ embeds: [embed] });
    },
};

// --- INVENTORY ---
export const inventoryCommand = {
    data: new SlashCommandBuilder()
        .setName("inventory")
        .setDescription("View your card collection"),

    async execute(interaction: any) {
        const userId = interaction.user.id;
        const inventory = getUserInventory(userId);
        const allCards = getAllCards();

        if (inventory.length === 0) {
            await interaction.reply({ content: "Your inventory is empty! Use `/gacha` to get cards.", flags: 64 });
            return;
        }

        // Group counts
        const counts: Record<string, number> = {};
        inventory.forEach(id => counts[id] = (counts[id] || 0) + 1);

        const description = Object.entries(counts).map(([id, count]) => {
            const card = allCards.find(c => c.id === id);
            return card ? `**${card.name}** (x${count}) - *${card.rarity}*` : `Unknown Card (${id})`;
        }).join("\n");

        const embed = new EmbedBuilder()
            .setTitle(`🎒 Inventory: ${interaction.user.username}`)
            .setColor(0x2ecc71)
            .setDescription(description || "No cards found.")
            .setFooter({ text: `Total Cards: ${inventory.length}` });

        await interaction.reply({ embeds: [embed] });
    },
};

// --- VIEW CARD ---
export const viewCardCommand = {
    data: new SlashCommandBuilder()
        .setName("viewcard")
        .setDescription("View details of a card")
        .addStringOption(option =>
            option.setName("name")
                .setDescription("Name of the card to view")
                .setRequired(true)
                .setAutocomplete(true)
        ),

    async autocomplete(interaction: any) {
        const focusedValue = interaction.options.getFocused().toLowerCase();
        const cards = getAllCards();
        const filtered = cards.filter(c => c.name.toLowerCase().includes(focusedValue)).slice(0, 25);

        await interaction.respond(
            filtered.map(c => ({ name: c.name, value: c.id }))
        );
    },

    async execute(interaction: any) {
        const cardId = interaction.options.getString("name");
        const cards = getAllCards();
        const card = cards.find(c => c.id === cardId);

        if (!card) {
            await interaction.reply({ content: "❌ Card not found.", flags: 64 });
            return;
        }

        const colors: Record<string, number> = {
            "Common": 0xbdc3c7,
            "Rare": 0x3498db,
            "Epic": 0x9b59b6,
            "Legendary": 0xf1c40f,
            "Mythic": 0xe74c3c
        };

        const embed = new EmbedBuilder()
            .setTitle(card.name)
            .setDescription(card.description)
            .setImage(card.image)
            .setColor(colors[card.rarity] || 0xffffff)
            .addFields(
                { name: "Rarity", value: card.rarity, inline: true },
                { name: "Element", value: card.element, inline: true },
                { name: "Stats", value: `⚔️ ATK: ${card.stats.atk}\n🛡️ DEF: ${card.stats.def}\n❤️ HP: ${card.stats.hp}\n⚡ SPD: ${card.stats.spd}`, inline: false }
            );

        await interaction.reply({ embeds: [embed] });
    },
};
