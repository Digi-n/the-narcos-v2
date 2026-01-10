import { AttachmentBuilder } from "discord.js";
import { generateValorantCard } from "../features/games/valorantCard";

const VALORANT_CHANNEL_ID = "1455794155564568756";

export async function handleValorantModal(interaction: any) {
    if (!interaction.isModalSubmit()) return;
    if (interaction.customId !== "valorant_modal") return;

    await interaction.deferReply({ flags: 64 });

    const playerName = interaction.fields.getTextInputValue("valorant_name");
    const user = interaction.user;

    // Generate the card
    const cardBuffer = await generateValorantCard(
        playerName,
        "Competitive / Scrims",
        "Looking for Team",
        user.displayAvatarURL({ extension: "png", size: 512 }),
        user.username
    );

    const attachment = new AttachmentBuilder(cardBuffer, {
        name: "valorant-card.png",
    });

    const valorantChannel = interaction.guild?.channels.cache.get(VALORANT_CHANNEL_ID);

    if (!valorantChannel || !valorantChannel.isTextBased()) {
        await interaction.editReply({
            content: "❌ Valorant channel not found.",
        });
        return;
    }

    // Send the image
    await valorantChannel.send({
        files: [attachment],
    });

    // Confirm to user
    await interaction.editReply({
        content: `✅ Registered successfully! Check <#${VALORANT_CHANNEL_ID}>`,
    });
}
