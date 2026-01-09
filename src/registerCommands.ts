import { REST, Routes } from "discord.js";
import { CONFIG } from "./config/config";

import { pingCommand } from "./commands/ping";
import { setNameCommand, resetNameCommand } from "./commands/setname";
import { embedCreateCommand } from "./commands/embedcreate";
import { rolesCommand } from "./commands/roles";
import { applyCommand } from "./commands/apply";
import * as shopCommand from "./commands/shop";
import * as historyCommand from "./commands/history";
import { setupStockCommand } from "./commands/setupStock";
import { intelCommand } from "./commands/intel";

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
