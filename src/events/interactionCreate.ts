import { Client, Interaction, EmbedBuilder } from "discord.js";

// Core
import { pingCommand } from "../features/core/ping";
import { setNameCommand, resetNameCommand } from "../features/core/setname";
import { embedCreateCommand } from "../features/core/embedcreate";
import { rolesCommand } from "../features/core/roles";
import { applyCommand } from "../features/core/apply";

import { handleEmbedModal } from "./embedModal";
import { handleEmbedButtons } from "./embedButtons";

// Economy
import * as historyCommand from "../features/economy/history";
import * as shopCommand from "../features/economy/shop";
import { setupStockCommand } from "../features/economy/setupStock";
import { updateStock } from "../features/economy/stockStore";
import { handleCartModal } from "./shopModal";
import { handleShopButtons } from "./shopButtons";
import { stockModal } from "../components/stockModal";
import { balanceCommand, dailyCommand } from "../features/economy/economy";

// Intel
import { intelCommand } from "../features/intel/intel";
import { handleIntelModal } from "../interactions/intelModal";

// Games
import { pubgCommand } from "../features/games/pubg";
import { handlePubgModal } from "../interactions/pubgModal";
import { valorantCommand } from "../features/games/valorant";
import { handleValorantModal } from "../interactions/valorantModal";
import { freefireCommand } from "../features/games/freefire";
import { handleFreefireModal } from "../interactions/freefireModal";

// Cards
import { gachaCommand, inventoryCommand, viewCardCommand } from "../features/cards/gacha";

// Status
import { setupStatusCommand } from "../features/status/setupStatus";

export function registerInteractionEvent(client: Client) {
  client.on("interactionCreate", async (interaction: Interaction) => {
    try {
      /* ================= AUTOCOMPLETE ================= */
      if (interaction.isAutocomplete()) {
        if (interaction.commandName === "viewcard") {
          await viewCardCommand.autocomplete(interaction);
          return;
        }
      }

      /* ================= MODALS ================= */
      if (interaction.isModalSubmit()) {

        if (interaction.customId === "freefire_modal") {
          await handleFreefireModal(interaction);
          return;
        }

        if (interaction.customId === "valorant_modal") {
          await handleValorantModal(interaction);
          return;
        }

        if (interaction.customId === "pubg_modal") {
          await handlePubgModal(interaction);
          return;
        }

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

      if (interaction.commandName === "pubg") {
        await pubgCommand.execute(interaction);
        return;
      }

      if (interaction.commandName === "valorant") {
        await valorantCommand.execute(interaction);
        return;
      }

      if (interaction.commandName === "freefire") {
        await freefireCommand.execute(interaction);
        return;
      }

      // 💰 ECONOMY
      if (interaction.commandName === "balance") {
        await balanceCommand.execute(interaction);
        return;
      }

      if (interaction.commandName === "daily") {
        await dailyCommand.execute(interaction);
        return;
      }

      // 🃏 GACHA
      if (interaction.commandName === "gacha") {
        await gachaCommand.execute(interaction);
        return;
      }

      if (interaction.commandName === "inventory") {
        await inventoryCommand.execute(interaction);
        return;
      }

      if (interaction.commandName === "viewcard") {
        await viewCardCommand.execute(interaction);
        return;
      }

      // 🤖 STATUS
      if (interaction.commandName === "setupstatus") {
        await setupStatusCommand.execute(interaction);
        return;
      }

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
