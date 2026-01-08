import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ButtonInteraction,
  EmbedBuilder
} from "discord.js";

import { createCartModal } from "./shopModal";
import { userCarts } from "../utils/cartStore";
import { SHOP_ITEMS } from "../data/shopItems";
import { saveShopHistory } from "../utils/shopHistory";

/* =========================
   SHOP BUTTON ROW
========================= */
export function shopButtonsRow() {
  return new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId("cart_1")
      .setLabel("🛒 Cart 1")
      .setStyle(ButtonStyle.Primary),

    new ButtonBuilder()
      .setCustomId("cart_2")
      .setLabel("🛒 Cart 2")
      .setStyle(ButtonStyle.Primary),

    new ButtonBuilder()
      .setCustomId("cart_3")
      .setLabel("🛒 Cart 3")
      .setStyle(ButtonStyle.Primary),

    new ButtonBuilder()
      .setCustomId("cart_4")
      .setLabel("🛒 Cart 4")
      .setStyle(ButtonStyle.Primary),

    new ButtonBuilder()
      .setCustomId("cart_final")
      .setLabel("✅ Final Submit")
      .setStyle(ButtonStyle.Success)
  );
}

/* =========================
   SHOP BUTTON HANDLER
========================= */
export async function handleShopButtons(interaction: ButtonInteraction) {
  const userId = interaction.user.id;

  /* -------- OPEN CART MODAL -------- */
  if (
    interaction.customId.startsWith("cart_") &&
    interaction.customId !== "cart_final"
  ) {
    const cartNumber = Number(interaction.customId.split("_")[1]);
    await interaction.showModal(createCartModal(cartNumber));
    return;
  }

  /* -------- FINAL SUBMIT -------- */
  if (interaction.customId === "cart_final") {
    const cart = userCarts.get(userId);

    if (!cart || Object.keys(cart).length === 0) {
      await interaction.reply({
        content: "❌ Cart is empty",
        flags: 64
      });
      return;
    }

    let total = 0;
    let text = "";

    for (const [item, qty] of Object.entries(cart)) {
      const price = SHOP_ITEMS[item];
      total += price * qty;
      text += `• **${item}** × ${qty} = ₹${price * qty}\n`;
    }

    // ⏱ Discord timestamp
    const orderTime = Math.floor(Date.now() / 1000);

    const embed = new EmbedBuilder()
      .setTitle("🧾 Final Order")
      .setDescription(text)
      .addFields(
        { name: "💰 Total", value: `₹${total}`, inline: true },
        { name: "👤 Buyer", value: `<@${interaction.user.id}>`, inline: true },
        { name: "⏱ Order Time", value: `<t:${orderTime}:R>`, inline: false }
      )
      .setColor(0x8b0000);

    // ✅ Safe send
    const channel = interaction.channel;
    if (channel && "send" in channel) {
      await channel.send({ embeds: [embed] });
    }

    // 🧾 SAVE TO HISTORY (THIS WAS MISSING EARLIER)
    saveShopHistory({
      buyerId: interaction.user.id,
      items: cart,
      total,
      timestamp: orderTime
    });

    await interaction.reply({
      content: "✅ Order placed successfully",
      flags: 64
    });

    // Clear cart
    userCarts.delete(userId);
  }
}
