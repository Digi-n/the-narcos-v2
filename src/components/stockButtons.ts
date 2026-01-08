import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} from "discord.js";

export function stockButtons(type: "weed" | "meth" | "distribution") {
  const labelMap = {
    weed: "🌿 Update Weed Stock",
    meth: "🧪 Update Meth Stock",
    distribution: "🚚 Log Distribution"
  };

  const styleMap = {
    weed: ButtonStyle.Success,
    meth: ButtonStyle.Primary,
    distribution: ButtonStyle.Danger
  };

  return new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId(`stock_${type}`)
      .setLabel(labelMap[type])
      .setStyle(styleMap[type])
  );
}
