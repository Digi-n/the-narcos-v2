import { createCanvas, loadImage, registerFont } from "canvas";
import path from "path";

// Try to use a system font or fallback
const FONT_HEADER = "bold 36px sans-serif";
const FONT_LABEL = "bold 24px sans-serif";
const FONT_VALUE = "24px sans-serif";
const FONT_FOOTER = "bold 20px sans-serif";

export async function generateFreeFireCard(
    playerName: string,
    mode: string,
    status: string,
    avatarUrl: string,
    submitterName: string
): Promise<Buffer> {
    const width = 900;
    const height = 450;

    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext("2d");

    // --- Background ---
    // Free Fire Black/Orange Background
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, "#2b1c06"); // Dark brownish/black
    grad.addColorStop(1, "#000000");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Free Fire Yellow/Orange Accent Shapes (Background)
    ctx.fillStyle = "#ffcc00"; // FF Yellow
    ctx.globalAlpha = 0.1;

    // Diagonal Slats
    for (let i = -200; i < width; i += 100) {
        ctx.beginPath();
        ctx.moveTo(i, height);
        ctx.lineTo(i + 50, height);
        ctx.lineTo(i + 250, 0);
        ctx.lineTo(i + 200, 0);
        ctx.fill();
    }
    ctx.globalAlpha = 1;

    // --- Border ---
    // Thick Orange Border
    ctx.strokeStyle = "#ff9900";
    ctx.lineWidth = 5;
    ctx.strokeRect(0, 0, width, height);

    // --- Header ---

    // Header Text
    ctx.fillStyle = "#ffcc00"; // Yellow
    ctx.font = FONT_HEADER;
    ctx.textAlign = "left";
    // Simulated Logo text
    ctx.fillText("FREE FIRE", 40, 65);
    ctx.fillStyle = "#ffffff";
    ctx.fillText(" Player Registration", 250, 65);

    // Header Underline
    ctx.fillStyle = "#ff9900";
    ctx.fillRect(40, 80, width - 80, 4);

    // --- Avatar ---
    const avatarSize = 250;
    const avatarX = 50;
    const avatarY = 120;

    // Avatar Border (Yellow)
    ctx.strokeStyle = "#ffcc00";
    ctx.lineWidth = 4;
    ctx.strokeRect(avatarX - 2, avatarY - 2, avatarSize + 4, avatarSize + 4);

    // Load Avatar
    try {
        const avatar = await loadImage(avatarUrl.replace("webp", "png"));
        ctx.drawImage(avatar, avatarX, avatarY, avatarSize, avatarSize);
    } catch (e) {
        ctx.fillStyle = "#333";
        ctx.fillRect(avatarX, avatarY, avatarSize, avatarSize);
        ctx.fillStyle = "#ccc";
        ctx.textAlign = "center";
        ctx.fillText("No Avatar", avatarX + avatarSize / 2, avatarY + avatarSize / 2);
    }

    // --- Content Fields ---
    const textX = 340;
    let textY = 150;
    const lineHeight = 55;

    ctx.textAlign = "left";

    const drawField = (icon: string, label: string, value: string) => {
        // Label
        ctx.fillStyle = "#ffcc00"; // Yellow Label
        ctx.font = FONT_LABEL;
        ctx.fillText(`${icon}  ${label}`, textX, textY);

        // Value
        ctx.fillStyle = "#ffffff"; // White Value
        ctx.font = FONT_VALUE;
        ctx.fillText(`   >  ${value}`, textX, textY + 30);

        textY += lineHeight + 20;
    };

    drawField("👤", "Player Name / IGN:", playerName);
    drawField("🔥", "Mode:", mode);
    drawField("📌", "Status:", status);

    // Submitter
    ctx.fillStyle = "#aaaaaa";
    ctx.font = FONT_LABEL;
    ctx.fillText(`🕒  Submitted By: @${submitterName}`, textX, textY + 10);

    // --- Footer ---
    // Footer Text
    ctx.fillStyle = "#ff9900";
    ctx.font = FONT_FOOTER;
    ctx.textAlign = "center";
    ctx.fillText("THE NARCOS • FREE FIRE ZONE", width / 2, 430);

    return canvas.toBuffer("image/png");
}
