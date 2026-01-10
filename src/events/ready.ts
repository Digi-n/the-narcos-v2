import { Client, Events } from "discord.js";
import { loadBank, loadStock } from "../features/core/storage";
import { startStatusLoop } from "../features/status/statusPanel";

export function registerReadyEvent(client: Client) {
  client.once(Events.ClientReady, () => {
    loadBank();
    loadStock();
    startStatusLoop(client);

    console.log(`✅ Bot ready — data loaded`);
  });
}
