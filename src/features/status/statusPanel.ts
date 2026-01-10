import { Client, EmbedBuilder, TextChannel } from "discord.js";
import { getStatusPanelInfo } from "./statusStore";
import os from "os";

// Formatting Uptime
function formatUptime(uptime: number) {
    const seconds = Math.floor((uptime / 1000) % 60);
    const minutes = Math.floor((uptime / (1000 * 60)) % 60);
    const hours = Math.floor((uptime / (1000 * 60 * 60)) % 24);
    const days = Math.floor(uptime / (1000 * 60 * 60 * 24));

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

export async function updateStatusPanel(client: Client, isOffline = false) {
    const { statusChannelId, statusMessageId } = getStatusPanelInfo();

    if (!statusChannelId || !statusMessageId) return;

    try {
        const channel = await client.channels.fetch(statusChannelId) as TextChannel;
        if (!channel) return;

        const message = await channel.messages.fetch(statusMessageId);
        if (!message) return;

        const uptime = client.uptime || 0;
        const memoryUsage = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);

        // Status Config
        const color = isOffline ? 0xff0000 : 0x00ff00; // Red : Green
        const statusText = isOffline ? "🔴 OFFLINE" : "🟢 ONLINE";
        const statusDesc = isOffline
            ? "**SYSTEM SHUTDOWN**\nThe bot is currently offline for maintenance or restart."
            : "**ALL SYSTEMS OPERATIONAL**\nThe bot is running smoothly.";

        const embed = new EmbedBuilder()
            .setTitle("🤖 BOT STATUS PANEL")
            .setDescription(statusDesc)
            .setColor(color)
            .addFields(
                { name: "Status", value: statusText, inline: true },
                { name: "Ping", value: `${client.ws.ping}ms`, inline: true },
                { name: "Uptime", value: formatUptime(uptime), inline: true },
                { name: "Memory", value: `${memoryUsage} MB`, inline: true },
                { name: "Node Version", value: process.version, inline: true },
                { name: "Last Check", value: `<t:${Math.floor(Date.now() / 1000)}:R>`, inline: true }
            )
            .setThumbnail(client.user?.displayAvatarURL() || "")
            .setFooter({ text: "The Narcos System Monitor v2.1" })
            .setTimestamp();

        await message.edit({ embeds: [embed] });

    } catch (err: any) {
        if (err.code === 10008) {
            console.warn("⚠️ Status panel message deleted. Resetting storage.");
            // Reset storage to prevent loop
            const { saveStatusPanelInfo } = require("./statusStore");
            saveStatusPanelInfo(statusChannelId, "");
        } else {
            console.error("Failed to update status panel:", err);
        }
    }
}

export function startStatusLoop(client: Client) {
    // Update immediately
    updateStatusPanel(client);

    // Then every 60 seconds
    setInterval(() => {
        updateStatusPanel(client);
    }, 60000);
}
