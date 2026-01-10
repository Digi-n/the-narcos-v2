import {
    SlashCommandBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder,
} from "discord.js";

export const freefireCommand = {
    data: new SlashCommandBuilder()
        .setName("freefire")
        .setDescription("Register for Free Fire Squad/Scrims"),

    async execute(interaction: any) {
        if (!interaction.isChatInputCommand()) return;

        const modal = new ModalBuilder()
            .setCustomId("freefire_modal")
            .setTitle("Free Fire Registration");

        const nameInput = new TextInputBuilder()
            .setCustomId("freefire_name")
            .setLabel("Player Name / IGN")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        modal.addComponents(
            new ActionRowBuilder<TextInputBuilder>().addComponents(nameInput)
        );

        await interaction.showModal(modal);
    },
};
