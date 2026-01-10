import { AttachmentBuilder } from "discord.js";
import { generatePubgCard } from "../features/games/pubgCard";

const PUBG_CHANNEL_ID = "1455792128218366095";

export async function handlePubgModal(interaction: any) {
    if (!interaction.isModalSubmit()) return;
    if (interaction.customId !== "pubg_modal") return;

    await interaction.deferReply({ flags: 64 });

    const playerName = interaction.fields.getTextInputValue("pubg_name");
    const user = interaction.user;

    // Generate the card
    const cardBuffer = await generatePubgCard(
        playerName,
        "Battlegrounds (PUBG)",
        "Ready for Squad / Scrims",
        user.displayAvatarURL({ extension: "png", size: 512 }),
        user.username
    );

    const attachment = new AttachmentBuilder(cardBuffer, {
        name: "pubg-card.png",
    });

    const pubgChannel = interaction.guild?.channels.cache.get(PUBG_CHANNEL_ID);

    if (!pubgChannel || !pubgChannel.isTextBased()) {
        await interaction.editReply({
            content: "❌ PUBG channel not found.",
        });
        return;
    }

    // Send the image
    await pubgChannel.send({
        files: [attachment],
    });

    // Confirm to user
    await interaction.editReply({
        content: `✅ Registered successfully! Check <#${PUBG_CHANNEL_ID}>`,
    });
}
