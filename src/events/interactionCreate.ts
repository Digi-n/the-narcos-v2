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

// 🕵️ INTEL SYSTEM
import { intelCommand } from "../commands/intel";
import { handleIntelModal } from "../interactions/intelModal";

export function registerInteractionEvent(client: Client) {
  client.on("interactionCreate", async (interaction: Interaction) => {
    try {

      /* ================= MODALS ================= */
      if (interaction.isModalSubmit()) {

        if (interaction.customId === "intel_modal") {
          await handleIntelModal(interaction);
          return;
        }

        if (interaction.customId.startsWith("embed_")) {
          await handleEmbedModal(interaction);
          return;
        }

        if (interaction.customId.startsWith("cart_modal_")) {
          await handleCartModal(interaction);
          return;
        }

        if (interaction.customId.startsWith("stock_modal_")) {
          const type = interaction.customId.replace("stock_modal_", "") as
            | "weed"
            | "meth"
            | "distribution";

          const amount = parseInt(
            interaction.fields.getTextInputValue("amount")
          );

          if (isNaN(amount) || amount === 0) {
            await interaction.reply({
              content: "❌ Enter a valid number",
              flags: 64,
            });
            return;
          }

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
            );

          if (interaction.message) {
            await interaction.message.edit({ embeds: [embed] });
          }

          await interaction.reply({
            content: `✅ ${amount} g applied`,
            flags: 64,
          });
          return;
        }

        return;
      }

      /* ================= BUTTONS ================= */
      if (interaction.isButton()) {

        if (interaction.customId.startsWith("cart_")) {
          await handleShopButtons(interaction);
          return;
        }

        if (interaction.customId.startsWith("stock_")) {
          const type = interaction.customId.split("_")[1];
          await interaction.showModal(stockModal(type));
          return;
        }

        await handleEmbedButtons(interaction);
        return;
      }

      /* ================= SLASH COMMANDS ================= */
      if (!interaction.isChatInputCommand()) return;

      if (interaction.commandName === "intel") {
        await intelCommand.execute(interaction); // showModal ACKS
        return;
      }

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

      if (interaction.commandName === "setup_stock") {
        await setupStockCommand.execute(interaction);
        return;
      }

    } catch (err: any) {
      if (err.code === 40060 || err.code === 10062) {
        console.warn(`[Warning] Interaction handling race condition ignored (Code: ${err.code})`);
        return;
      }
      console.error("Interaction error:", err);
    }
  });
}
