import { AttachmentBuilder } from "discord.js";
import { generateFreeFireCard } from "../features/games/freefireCard";

const FREEFIRE_CHANNEL_ID = "1455793280284623013";

export async function handleFreefireModal(interaction: any) {
    if (!interaction.isModalSubmit()) return;
    if (interaction.customId !== "freefire_modal") return;

    await interaction.deferReply({ flags: 64 });

    const playerName = interaction.fields.getTextInputValue("freefire_name");
    const user = interaction.user;

    // Generate the card
    const cardBuffer = await generateFreeFireCard(
        playerName,
        "Battle Royale / Scrims",
        "Ready for Squad",
        user.displayAvatarURL({ extension: "png", size: 512 }),
        user.username
    );

    const attachment = new AttachmentBuilder(cardBuffer, {
        name: "freefire-card.png",
    });

    const ffChannel = interaction.guild?.channels.cache.get(FREEFIRE_CHANNEL_ID);

    if (!ffChannel || !ffChannel.isTextBased()) {
        await interaction.editReply({
            content: "❌ Free Fire channel not found.",
        });
        return;
    }

    // Send the image
    await ffChannel.send({
        files: [attachment],
    });

    // Confirm to user
    await interaction.editReply({
        content: `✅ Registered successfully! Check <#${FREEFIRE_CHANNEL_ID}>`,
    });
}
