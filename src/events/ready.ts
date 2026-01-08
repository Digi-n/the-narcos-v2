import { Client } from "discord.js";
import { loadBank, loadStock } from "../utils/storage";

export function registerReadyEvent(client: Client) {
  client.once("clientReady", () => {
    loadBank();
    loadStock();

    console.log("✅ Bot ready — data loaded");
  });
}
