import { REST, Routes } from "discord.js";
import { CONFIG } from "./config/config";

// Core
import { pingCommand } from "./features/core/ping";
import { setNameCommand, resetNameCommand } from "./features/core/setname";
import { embedCreateCommand } from "./features/core/embedcreate";
import { rolesCommand } from "./features/core/roles";
import { applyCommand } from "./features/core/apply";

// Economy
import * as shopCommand from "./features/economy/shop";
import * as historyCommand from "./features/economy/history";
import { setupStockCommand } from "./features/economy/setupStock";
import { balanceCommand } from "./features/economy/economy";

// Intel
import { intelCommand } from "./features/intel/intel";

// Games
import { pubgCommand } from "./features/games/pubg";
import { valorantCommand } from "./features/games/valorant";
import { freefireCommand } from "./features/games/freefire";

// Status
import { setupStatusCommand } from "./features/status/setupStatus";

const CLIENT_ID = "1458294328504881276";
console.log("INTEL RAW:", intelCommand);
console.log("INTEL JSON:", intelCommand.data.toJSON());

const commands = [
  pingCommand.data.toJSON(),
  setNameCommand.data.toJSON(),
  resetNameCommand.data.toJSON(),
  embedCreateCommand.data.toJSON(),
  rolesCommand.data.toJSON(),
  applyCommand.data.toJSON(),
  shopCommand.data.toJSON(),
  historyCommand.data.toJSON(),
  setupStockCommand.data.toJSON(),
  intelCommand.data.toJSON(),
  pubgCommand.data.toJSON(),
  valorantCommand.data.toJSON(),
  freefireCommand.data.toJSON(),
  // Economy
  balanceCommand.data.toJSON(),
  // Status
  setupStatusCommand.data.toJSON(),
];

const rest = new REST({ version: "10" }).setToken(CONFIG.TOKEN);

(async () => {
  try {
    console.log("⏳ Registering slash commands...");
    console.log("Registering commands:", commands.map(c => c.name));

    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, CONFIG.GUILD_ID),
      { body: commands }
    );

    console.log("✅ Slash commands registered");
  } catch (error) {
    console.error(error);
  }
})();
