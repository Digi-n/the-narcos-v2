import { createCanvas, loadImage, registerFont } from "canvas";
import path from "path";

// Try to use a system font or fallback
const FONT_HEADER = "bold 36px sans-serif";
const FONT_LABEL = "bold 24px sans-serif";
const FONT_VALUE = "24px sans-serif";
const FONT_FOOTER = "bold 20px sans-serif";

export async function generateValorantCard(
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
    // Valorant Dark Blue/Grey Background
    const grad = ctx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, "#0f1923"); // Valorant Black/Blue
    grad.addColorStop(1, "#1c2b39");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Valorant Red Accent Shapes (Background)
    ctx.fillStyle = "#ff4655"; // Valorant Red
    ctx.globalAlpha = 0.1;
    ctx.beginPath();
    ctx.moveTo(width - 200, 0);
    ctx.lineTo(width, 0);
    ctx.lineTo(width, 200);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(0, height);
    ctx.lineTo(200, height);
    ctx.lineTo(0, height - 200);
    ctx.fill();
    ctx.globalAlpha = 1;

    // --- Border ---
    // Thin Red Border
    ctx.strokeStyle = "#ff4655";
    ctx.lineWidth = 4;
    ctx.strokeRect(10, 10, width - 20, height - 20);

    // --- Header ---
    // Header line
    ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(20, 90);
    ctx.lineTo(width - 20, 90);
    ctx.stroke();

    // Header Text
    ctx.fillStyle = "#ffffff";
    ctx.font = FONT_HEADER;
    ctx.textAlign = "left";
    // Simulated Logo text
    ctx.fillStyle = "#ff4655";
    ctx.fillText("VALORANT", 40, 65);
    ctx.fillStyle = "#ffffff";
    ctx.fillText(" Player Registration", 240, 65);

    // --- Avatar ---
    const avatarSize = 250;
    const avatarX = 50;
    const avatarY = 120;

    // Avatar Border (Red)
    ctx.strokeStyle = "#ff4655";
    ctx.lineWidth = 3;
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
        ctx.fillStyle = "#ff4655"; // Red Label
        ctx.font = FONT_LABEL;
        ctx.fillText(`${icon}  ${label}`, textX, textY);

        // Value
        ctx.fillStyle = "#ffffff"; // White Value
        ctx.font = FONT_VALUE;
        ctx.fillText(`   >  ${value}`, textX, textY + 30);

        textY += lineHeight + 20;
    };

    drawField("👤", "Player Name / IGN:", playerName);
    drawField("✜", "Mode:", mode);
    drawField("📌", "Status:", status);

    // Submitter
    ctx.fillStyle = "#aaaaaa";
    ctx.font = FONT_LABEL;
    ctx.fillText(`🕒  Submitted By: @${submitterName}`, textX, textY + 10);

    // --- Footer ---
    // Footer accents (Triangles)
    ctx.fillStyle = "#ff4655";
    const fw = 10;
    const fh = 10;
    // Bottom left dots
    ctx.fillRect(40, height - 30, fw, fh);
    ctx.fillRect(60, height - 30, fw, fh);

    // Bottom right dots
    ctx.fillRect(width - 50, height - 30, fw, fh);
    ctx.fillRect(width - 70, height - 30, fw, fh);

    // Footer Text
    ctx.fillStyle = "#ffffff";
    ctx.font = FONT_FOOTER;
    ctx.textAlign = "center";
    ctx.fillText("VALORANT ZONE", width / 2, 430);

    return canvas.toBuffer("image/png");
}
