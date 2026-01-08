import {
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  ModalSubmitInteraction
} from "discord.js";
import { CART_PAGES } from "../data/shopItems";
import { userCarts } from "../utils/cartStore";

export function createCartModal(cartNumber: number) {
  const modal = new ModalBuilder()
    .setCustomId(`cart_modal_${cartNumber}`)
    .setTitle(`🛒 Cart ${cartNumber}`);

  const rows: ActionRowBuilder<TextInputBuilder>[] = [];

  for (const item of CART_PAGES[cartNumber]) {
    const input = new TextInputBuilder()
      .setCustomId(item)
      .setLabel(item)
      .setStyle(TextInputStyle.Short)
      .setRequired(false);

    rows.push(new ActionRowBuilder<TextInputBuilder>().addComponents(input));
  }

  modal.addComponents(...rows);
  return modal;
}

export async function handleCartModal(interaction: ModalSubmitInteraction) {
  const userId = interaction.user.id;

  if (!userCarts.has(userId)) {
    userCarts.set(userId, {});
  }

  const cart = userCarts.get(userId)!;

  // ✅ CORRECT WAY (discord.js v14)
 for (const [id, component] of interaction.fields.fields) {
  const value = (component as any).value;
  if (value) {
    cart[id] = Number(value);
  }
}


  await interaction.reply({
    content: "✅ Cart updated successfully",
    flags: 64
  });
}
