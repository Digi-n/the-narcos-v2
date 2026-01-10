import "dotenv/config";
import express, { Request, Response } from "express";
import { Client, GatewayIntentBits } from "discord.js";
import { CONFIG } from "./config/config";
import { registerReadyEvent } from "./events/ready";
import { registerInteractionEvent } from "./events/interactionCreate";
import { registerMemberJoinEvent } from "./events/memberJoin";
import { registerMessageEvent } from "./events/messageCreate";

// =======================
// Discord Client
// =======================
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
  ],
});

// Register events
registerReadyEvent(client);
registerMemberJoinEvent(client);
registerInteractionEvent(client);
registerMessageEvent(client);

console.log("TOKEN LOADED:", process.env.DISCORD_TOKEN ? "YES" : "NO");

// Login
// Login
client.login(CONFIG.TOKEN);

// Graceful Shutdown
import { updateStatusPanel } from "./features/status/statusPanel";

const shutdown = async () => {
  console.log("Shutting down...");
  await updateStatusPanel(client, true); // Set Offline
  client.destroy();
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

// =======================
// Render HTTP Keep-Alive
// =======================
const app = express();

// Health check route
app.get("/", (_req: Request, res: Response) => {
  res.status(200).send("THE NARCOS V2 BOT IS RUNNING");
});

// Render requires binding to 0.0.0.0 and PORT
const PORT = Number(process.env.PORT) || 10000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`HTTP server listening on port ${PORT}`);
});

// =======================
// SELF PING (every 14 min)
// =======================
const SELF_URL = process.env.RENDER_EXTERNAL_URL;

if (SELF_URL) {
  setInterval(async () => {
    try {
      const res = await fetch(SELF_URL);
      console.log(`[KEEP-ALIVE] Self ping success: ${res.status}`);
    } catch (error) {
      console.error("[KEEP-ALIVE] Self ping failed:", error);
    }
  }, 14 * 60 * 1000); // 14 minutes
} else {
  console.warn("[KEEP-ALIVE] RENDER_EXTERNAL_URL not found");
}