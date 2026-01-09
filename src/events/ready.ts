import { Client, Events } from "discord.js";
import { loadBank, loadStock } from "../utils/storage";

export function registerReadyEvent(client: Client) {
  client.once(Events.ClientReady, () => {
    loadBank();
    loadStock();

    console.log(`✅ Bot ready — data loaded`);
  });
}
