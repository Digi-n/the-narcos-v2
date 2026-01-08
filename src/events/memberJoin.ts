import {
  Client,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from "discord.js";
import { CONFIG } from "../config/config";

export function registerMemberJoinEvent(client: Client) {
  client.on("guildMemberAdd", async (member) => {
    const channel = member.guild.channels.cache.get(
  CONFIG.CHANNELS
.WELCOME
);


    if (!channel || !channel.isTextBased()) return;

    // 🔹 WELCOME EMBED
    const embed = new EmbedBuilder()
      .setTitle("Welcome to NARCOS SYNDICATE")
      .setDescription(
        "**GTA Roleplay Server With**\n" +
        "**Advanced Gang System,**\n" +
        "**Business Role Play And Citizen Activities**"
      )
      .setColor(0x0a0a0a)
      .setThumbnail(member.displayAvatarURL())
      .addFields(
        { name: "Member", value: member.toString(), inline: true },
        { name: "Name", value: member.user.username, inline: true },
        { name: "ID", value: member.id, inline: true },
        {
          name: "Account Created",
          value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:F>`,
          inline: true,
        },
        {
          name: "Join Date",
          value: `<t:${Math.floor(Date.now() / 1000)}:F>`,
          inline: true,
        },
        {
          name: "Go through our Discord Rules",
          value: "🔒 Mandatory",
          inline: false,
        }
      )
      // 🔥 BIG BANNER IMAGE (from another server is OK)
      .setImage(
        "https://cdn.discordapp.com/attachments/1453640241947607152/1455032052331188370/ChatGPT_Image_Dec_29_2025_08_19_55_AM.png"
      )
      .setFooter({
        text: `Member #${member.guild.memberCount}`,
      });

    // 🔹 BUTTON (RULES)
    const rulesButton = new ButtonBuilder()
      .setLabel("📜 View Server Rules")
      .setStyle(ButtonStyle.Link)
      .setURL(
        `https://discord.com/channels/${member.guild.id}/1451762262778974354`
      );

    const roleButton = new ButtonBuilder()
     .setLabel("🎭 Select Your Roles")
     .setStyle(ButtonStyle.Link)
     .setURL(
        `https://discord.com/channels/${member.guild.id}/1455787003823263764`
      );

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
  rulesButton,
  roleButton
    );


    await channel.send({
      embeds: [embed],
      components: [row],
    });
  });
}
