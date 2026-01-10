import {
    SlashCommandBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder,
} from "discord.js";

export const pubgCommand = {
    data: new SlashCommandBuilder()
        .setName("pubg")
        .setDescription("Register for PUBG Squad/Scrims"),

    async execute(interaction: any) {
        if (!interaction.isChatInputCommand()) return;

        const modal = new ModalBuilder()
            .setCustomId("pubg_modal")
            .setTitle("PUBG Registration");

        const nameInput = new TextInputBuilder()
            .setCustomId("pubg_name")
            .setLabel("Player Name / ID")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        modal.addComponents(
            new ActionRowBuilder<TextInputBuilder>().addComponents(nameInput)
        );

        await interaction.showModal(modal);
    },
};
