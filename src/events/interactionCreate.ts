import { Client, Interaction, EmbedBuilder } from "discord.js";
import { pingCommand } from "../commands/ping";
import { setNameCommand, resetNameCommand } from "../commands/setname";
import { embedCreateCommand } from "../commands/embedcreate";
import { handleEmbedModal } from "./embedModal";
import { handleEmbedButtons } from "./embedButtons";
import { rolesCommand } from "../commands/roles";
import { applyCommand } from "../commands/apply";
import * as historyCommand from "../commands/history";

// 🛒 SHOP
import * as shopCommand from "../commands/shop";
import { handleCartModal } from "./shopModal";
import { handleShopButtons } from "./shopButtons";

// 🌿 STOCK SYSTEM
import { stockModal } from "../components/stockModal";
import { updateStock } from "../utils/stockStore";
import { setupStockCommand } from "../commands/setupStock";

export function registerInteractionEvent(client: Client) {
  client.on("interactionCreate", async (interaction: Interaction) => {

    /* ================= MODALS ================= */
    await handleEmbedModal(interaction);

    if (interaction.isModalSubmit()) {

      // 🛒 CART MODAL
      if (interaction.customId.startsWith("cart_modal_")) {
        await handleCartModal(interaction);
        return;
      }

      // 🌿🧪🚚 STOCK MODAL
      if (interaction.customId.startsWith("stock_modal_")) {
        const type = interaction.customId.replace("stock_modal_", "") as
          | "weed"
          | "meth"
          | "distribution";

        const amount = parseInt(
          interaction.fields.getTextInputValue("amount")
        );

        // allow negative, block zero
        if (isNaN(amount) || amount === 0) {
          await interaction.reply({
            content: "❌ Enter a valid number (use - to subtract)",
            flags: 64
          });
          return;
        }

        try {
          const stock = updateStock(type, amount);

          const embed = new EmbedBuilder()
            .setTitle(
              type === "weed"
                ? "🌿 WEED STOCK"
                : type === "meth"
                ? "🧪 METH STOCK"
                : "🚚 DISTRIBUTION LOG"
            )
            .setDescription(
              type === "distribution"
                ? `Total Distributed: **${stock[type]} g**`
                : `Current Stock: **${stock[type]} g**`
            )
            .setColor(
              type === "weed" ? 0x1aff00 :
              type === "meth" ? 0x00b3ff :
              0xff0000
            );

          // 🔁 Update panel message
          if (interaction.message) {
            await interaction.message.edit({ embeds: [embed] });
          }

          await interaction.reply({
            content: `✅ **${amount > 0 ? "+" : ""}${amount} g applied**`,
            flags: 64
          });

        } catch {
          await interaction.reply({
            content: "❌ Not enough stock to subtract",
            flags: 64
          });
        }

        return;
      }
    }

    /* ================= BUTTONS ================= */
    await handleEmbedButtons(interaction);

    if (interaction.isButton()) {

      // 🛒 SHOP CART BUTTONS
      if (interaction.customId.startsWith("cart_")) {
        await handleShopButtons(interaction);
        return;
      }

      // 🌿🧪🚚 STOCK BUTTONS
      if (interaction.customId.startsWith("stock_")) {
        const type = interaction.customId.split("_")[1];
        await interaction.showModal(stockModal(type));
        return;
      }
    }

    /* ================= SLASH COMMANDS ================= */
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === "ping") {
      await interaction.reply({ content: "🏓 Pong!", flags: 64 });
      return;
    }

    if (interaction.commandName === "setname") {
      await setNameCommand.execute(interaction);
      return;
    }

    if (interaction.commandName === "resetname") {
      await resetNameCommand.execute(interaction);
      return;
    }

    if (interaction.commandName === "embedcreate") {
      await embedCreateCommand.execute(interaction);
      return;
    }

    if (interaction.commandName === "roles") {
      await rolesCommand.execute(interaction);
      return;
    }

    if (interaction.commandName === "apply") {
      await applyCommand.execute(interaction);
      return;
    }

    if (interaction.commandName === "shop") {
      await shopCommand.execute(interaction);
      return;
    }

    if (interaction.commandName === "history") {
      await interaction.deferReply({ flags: 64 });
      await historyCommand.execute(interaction);
      return;
    }

    // 🚚 STOCK SETUP
    if (interaction.commandName === "setup_stock") {
      await setupStockCommand.execute(interaction);
      return;
    }

  });
}
