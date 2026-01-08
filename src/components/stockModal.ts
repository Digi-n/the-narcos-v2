import {
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder
} from "discord.js";

export function stockModal(type: string) {
  return new ModalBuilder()
    .setCustomId(`stock_modal_${type}`)
    .setTitle("Add Stock")
    .addComponents(
      new ActionRowBuilder<TextInputBuilder>().addComponents(
        new TextInputBuilder()
          .setCustomId("amount")
          .setLabel("Enter amount to ADD")
          .setStyle(TextInputStyle.Short)
          .setRequired(true)
      )
    );
}
