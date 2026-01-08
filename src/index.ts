import "dotenv/config";
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
