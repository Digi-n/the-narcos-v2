import "dotenv/config";
import express, { Request, Response } from "express";
import { Client, GatewayIntentBits } from "discord.js";
import { CONFIG } from "./config/config";
import { registerReadyEvent } from "./events/ready";
import { registerInteractionEvent } from "./events/interactionCreate";
import { registerMemberJoinEvent } from "./events/memberJoin";
import { registerMessageEvent } from "./events/messageCreate";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages, // 🔴 REQUIRED
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
  ],
});


// register events
registerReadyEvent(client);
registerMemberJoinEvent(client);
registerInteractionEvent(client);
registerMessageEvent(client);

console.log("TOKEN LOADED:", process.env.DISCORD_TOKEN ? "YES" : "NO");

// login
client.login(CONFIG.TOKEN);

// =======================
// Render HTTP Keep-Alive
// =======================
const app = express();

// Health check route
app.get("/", (_req, res) => {
  res.status(200).send("THE NARCOS V2 BOT IS RUNNING");
});

// Render requires binding to 0.0.0.0 and PORT
const PORT = Number(process.env.PORT) || 10000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`HTTP server listening on port ${PORT}`);
});
