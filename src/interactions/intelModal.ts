import {
  EmbedBuilder,
  AttachmentBuilder,
} from "discord.js";
import { generateIntelImage } from "../utils/intelImage";

const INTEL_CHANNEL_ID = "1451809846109405204";

async function handleIntelModal(interaction: any) {
  // ✅ Only handle modal submits
  if (!interaction.isModalSubmit()) return;
  if (interaction.customId !== "intel_modal") return;

  // ✅ ACK immediately (prevents Unknown interaction error)
  await interaction.deferReply({ flags: 64 });

  const title = interaction.fields.getTextInputValue("intel_title");
  const content = interaction.fields.getTextInputValue("intel_content");

  // 🖼️ Generate image with text INSIDE paper + seal ON paper
  const imageBuffer = await generateIntelImage(title, content);

  const attachment = new AttachmentBuilder(imageBuffer, {
    name: "intel.png",
  });

  const intelEmbed = new EmbedBuilder()
    .setColor(0x1f1f1f)
    .setImage("attachment://intel.png")
    .setFooter({
      text: "🔒 Source: Classified | Identity Protected",
    })
    .setTimestamp();

  const intelChannel = interaction.guild?.channels.cache.get(
    INTEL_CHANNEL_ID
  );

  if (!intelChannel || !intelChannel.isTextBased()) {
    await interaction.editReply({
      content: "❌ Intel channel not found.",
    });
    return;
  }

  // 📤 Send generated intel image
  await intelChannel.send({
    files: [attachment],
    embeds: [intelEmbed],
  });

  // ✅ Private confirmation to the user
  await interaction.editReply({
    content: "✅ Intel delivered securely.",
  });
}

// 🔑 IMPORTANT: explicit export (fixes TS2305 error)
export { handleIntelModal };
