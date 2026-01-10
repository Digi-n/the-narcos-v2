import { createCanvas, loadImage, registerFont } from "canvas";
import path from "path";

// Try to use a system font or fallback
const FONT_HEADER = "bold 36px sans-serif";
const FONT_LABEL = "bold 24px sans-serif";
const FONT_VALUE = "24px sans-serif";
const FONT_FOOTER = "bold 20px sans-serif";

export async function generatePubgCard(
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
    // Dark grunge-like background (Simulated with gradients/noise since we don't have an asset)
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, "#1a1a19"); // Almost black
    grad.addColorStop(1, "#0d0d0c"); // Darker
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Add some texture/noise (simple distinct dots)
    ctx.fillStyle = "rgba(255, 255, 255, 0.03)";
    for (let i = 0; i < 500; i++) {
        ctx.beginPath();
        ctx.arc(Math.random() * width, Math.random() * height, Math.random() * 2, 0, Math.PI * 2);
        ctx.fill();
    }

    // --- Border ---
    // Gold border
    ctx.strokeStyle = "#cba136"; // Gold color
    ctx.lineWidth = 4;
    ctx.strokeRect(10, 10, width - 20, height - 20);

    // Inner finer border
    ctx.strokeStyle = "#5e4b18"; // Darker gold
    ctx.lineWidth = 1;
    ctx.strokeRect(16, 16, width - 32, height - 32);

    // --- Header ---
    // Header Background Bar
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(20, 20, width - 40, 70);

    // Header Text "PUBG Player Registration"
    ctx.fillStyle = "#eea628"; // Orange/Gold
    ctx.font = FONT_HEADER;
    ctx.textAlign = "left";
    // Initial Icon (Simulated with text or drawing)
    ctx.fillText("🎮  PUBG Player Registration", 40, 68);

    // --- Avatar ---
    // Box for Avatar
    const avatarSize = 250;
    const avatarX = 50;
    const avatarY = 120;

    // Avatar Border
    ctx.strokeStyle = "#cba136";
    ctx.lineWidth = 3;
    ctx.strokeRect(avatarX - 2, avatarY - 2, avatarSize + 4, avatarSize + 4);

    // Load Avatar
    try {
        const avatar = await loadImage(avatarUrl.replace("webp", "png"));
        ctx.drawImage(avatar, avatarX, avatarY, avatarSize, avatarSize);
    } catch (e) {
        // Fallback if avatar fails
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

    // Helper to draw icon + label + value
    const drawField = (icon: string, label: string, value: string) => {
        // Label
        ctx.fillStyle = "#aaaaaa"; // Grey
        ctx.font = FONT_LABEL;
        ctx.fillText(`${icon}  ${label}`, textX, textY);

        // Value
        ctx.fillStyle = "#ffffff"; // White
        ctx.font = FONT_VALUE;
        ctx.fillText(`   >  ${value}`, textX, textY + 30);

        textY += lineHeight + 20;
    };

    drawField("👤", "Player Name / ID:", playerName);
    drawField("🔥", "Mode:", mode);
    drawField("📌", "Status:", status);

    // Submitter separate
    ctx.fillStyle = "#aaaaaa";
    ctx.font = FONT_LABEL;
    ctx.fillText(`🕒  Submitted By: @${submitterName}`, textX, textY + 10);

    // --- Footer ---
    // Footer separator
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(320, 390);
    ctx.lineTo(width - 40, 390);
    ctx.stroke();

    // Footer Text
    ctx.fillStyle = "#cba136"; // Gold
    ctx.font = FONT_FOOTER;
    ctx.textAlign = "center";
    ctx.fillText("THE NARCOS  •  PUBG ZONE", (width + 320) / 2, 425);

    return canvas.toBuffer("image/png");
}
