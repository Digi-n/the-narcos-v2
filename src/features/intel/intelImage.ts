import { createCanvas, loadImage, registerFont } from "canvas";
import path from "path";

/* ================= REGISTER HANDWRITING FONT ================= */
registerFont(
  path.join(
    process.cwd(),
    "src",
    "assets",
    "fonts",
    "Allura-Regular.ttf"
  ),
  { family: "AlluraHand" }
);


/**
 * Generates an intel image with:
 * - Burned paper background
 * - Handwritten, readable cursive text
 * - Seal stamped INSIDE paper (bottom-right)
 */
export async function generateIntelImage(
  title: string,
  content: string
): Promise<Buffer> {

  // 🖼️ Canvas size
  const width = 800;
  const height = 1000;

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  // 📂 Asset paths
  const paper = await loadImage(
    path.join(process.cwd(), "src", "assets", "paper.png")
  );
  const seal = await loadImage(
    path.join(process.cwd(), "src", "assets", "seal.png")
  );

  // 📜 Draw paper
  ctx.drawImage(paper, 0, 0, width, height);

  /* ================= TITLE ================= */
  ctx.fillStyle = "#3b2415";
  ctx.font = "42px AlluraHand";
  ctx.textAlign = "center";
  ctx.fillText(title.toUpperCase(), width / 2, 155);

  /* ================= BODY TEXT ================= */
  ctx.font = "32px AlluraHand";
  ctx.textAlign = "left";
  ctx.fillStyle = "#2b1d0e";

  const marginX = 100;
  let cursorY = 215;
  const lineHeight = 40;
  const maxWidth = width - marginX * 2;

  function wrapText(text: string) {
    const paragraphs = text.split("\n");

    for (const paragraph of paragraphs) {
      const words = paragraph.split(" ");
      let line = "";

      for (const word of words) {
        const testLine = line + word + " ";
        const testWidth = ctx.measureText(testLine).width;

        if (testWidth > maxWidth && line !== "") {
          ctx.fillText(line, marginX, cursorY);
          line = word + " ";
          cursorY += lineHeight;
        } else {
          line = testLine;
        }
      }

      ctx.fillText(line, marginX, cursorY);
      cursorY += lineHeight * 1.25;
    }
  }

  wrapText(content);

  /* ================= SEAL (OLDER POSITION) ================= */
  const sealSize = 170;
  ctx.globalAlpha = 0.85;

  ctx.drawImage(
    seal,
    width - sealSize - 80,
    height - sealSize - 100,
    sealSize,
    sealSize
  );

  ctx.globalAlpha = 1;

  /* ================= EXPORT ================= */
  return canvas.toBuffer("image/png");
}
