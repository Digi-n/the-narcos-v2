import { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } from "discord.js";
import { saveStatusPanelInfo } from "./statusStore";
import { updateStatusPanel } from "./statusPanel";

export const setupStatusCommand = {
    data: new SlashCommandBuilder()
        .setName("setupstatus")
        .setDescription("Initialize the real-time Bot Status Panel")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction: any) {
        await interaction.deferReply({ flags: 64 }); // Ephemeral defer

        const channel = interaction.channel;

        // Send initial placeholder
        const embed = new EmbedBuilder()
            .setTitle("🤖 BOT STATUS PANEL")
            .setDescription("Initializing system monitor...")
            .setColor(0xffff00); // Yellow initially

        const message = await channel.send({ embeds: [embed] });

        // Save ID
        saveStatusPanelInfo(channel.id, message.id);

        // Trigger immediate update
        updateStatusPanel(interaction.client);

        await interaction.editReply({
            content: "✅ Status Panel set up! It will update every minute."
        });
    },
};
