import { Client, EmbedBuilder, TextChannel, AttachmentBuilder } from "discord.js";
import { getStatusPanelInfo } from "./statusStore";
import { createCanvas } from "canvas";

// History Storage (In-Memory)
const MAX_HISTORY = 30;
const history = {
    ping: [] as number[],
    memory: [] as number[],
};

// Formatting Uptime
function formatUptime(uptime: number) {
    const seconds = Math.floor((uptime / 1000) % 60);
    const minutes = Math.floor((uptime / (1000 * 60)) % 60);
    const hours = Math.floor((uptime / (1000 * 60 * 60)) % 24);
    const days = Math.floor(uptime / (1000 * 60 * 60 * 24));

    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

// Draw Graph Function
function drawStatusGraph(pingData: number[], memoryData: number[]) {
    const width = 600;
    const height = 200;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    // Background
    ctx.fillStyle = "#2f3136"; // Discord dark theme bg match
    ctx.fillRect(0, 0, width, height);

    // Grid lines
    ctx.strokeStyle = "#40444b";
    ctx.lineWidth = 1;
    for (let i = 0; i < width; i += 50) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);
        ctx.stroke();
    }
    for (let i = 0; i < height; i += 50) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(width, i);
        ctx.stroke();
    }

    // Draw Line Helper
    const drawLine = (data: number[], color: string, label: string) => {
        if (data.length < 2) return;

        const maxVal = Math.max(...data, 100) * 1.2;
        const minVal = 0;
        const stepX = width / (MAX_HISTORY - 1);

        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.beginPath();

        data.forEach((val, index) => {
            const x = index * stepX;
            const y = height - ((val - minVal) / (maxVal - minVal)) * height;
            if (index === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.stroke();

        // Label
        ctx.fillStyle = color;
        ctx.font = "bold 14px sans-serif";
        ctx.fillText(`${label}: ${data[data.length - 1]}`, 10, label === "Ping (ms)" ? 20 : 40);
    };

    // Draw Ping (Green)
    drawLine(pingData, "#43b581", "Ping (ms)");

    // Draw Memory (Blue)
    drawLine(memoryData, "#00b0f4", "Memory (MB)");

    return canvas.toBuffer();
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
        const memoryUsage = parseFloat((process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2));
        const ping = client.ws.ping;

        // Update History
        history.ping.push(ping);
        history.memory.push(memoryUsage);
        if (history.ping.length > MAX_HISTORY) history.ping.shift();
        if (history.memory.length > MAX_HISTORY) history.memory.shift();

        // Status Config
        const color = isOffline ? 0xff0000 : 0x00ff00; // Red : Green
        const statusText = isOffline ? "🔴 OFFLINE" : "🟢 ONLINE";
        const statusDesc = isOffline
            ? "**SYSTEM SHUTDOWN**\nThe bot is currently offline for maintenance or restart."
            : "**ALL SYSTEMS OPERATIONAL**\nThe bot is running smoothly.";

        // Generate Graph
        const buffer = drawStatusGraph(history.ping, history.memory);
        const attachment = new AttachmentBuilder(buffer, { name: "status-graph.png" });

        const embed = new EmbedBuilder()
            .setTitle("🤖 BOT STATUS PANEL")
            .setDescription(statusDesc)
            .setColor(color)
            .addFields(
                { name: "Status", value: statusText, inline: true },
                { name: "Ping", value: `${ping}ms`, inline: true },
                { name: "Uptime", value: formatUptime(uptime), inline: true },
                { name: "Memory", value: `${memoryUsage} MB`, inline: true },
                { name: "Node Version", value: process.version, inline: true },
                { name: "Last Check", value: `<t:${Math.floor(Date.now() / 1000)}:R>`, inline: true }
            )
            .setImage("attachment://status-graph.png")
            .setThumbnail(client.user?.displayAvatarURL() || "")
            .setFooter({ text: "The Narcos System Monitor v2.1" })
            .setTimestamp();

        await message.edit({ embeds: [embed], files: [attachment] });

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
