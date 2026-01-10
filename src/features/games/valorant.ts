import {
    SlashCommandBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder,
} from "discord.js";

export const valorantCommand = {
    data: new SlashCommandBuilder()
        .setName("valorant")
        .setDescription("Register for Valorant Competitive/Scrims"),

    async execute(interaction: any) {
        if (!interaction.isChatInputCommand()) return;

        const modal = new ModalBuilder()
            .setCustomId("valorant_modal")
            .setTitle("Valorant Registration");

        const nameInput = new TextInputBuilder()
            .setCustomId("valorant_name")
            .setLabel("Player Name / IGN")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        modal.addComponents(
            new ActionRowBuilder<TextInputBuilder>().addComponents(nameInput)
        );

        await interaction.showModal(modal);
    },
};
