import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
  GuildMember,
  ChannelType,
  TextChannel,
  PermissionFlagsBits,
} from "discord.js";
import { CONFIG } from "../../config/config";

export const embedCreateCommand = {
  data: new SlashCommandBuilder()
    .setName("embedcreate")
    .setDescription("Create and send an embed")
    .addStringOption(option =>
      option
        .setName("heading")
        .setDescription("Embed heading / title")
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName("paragraph")
        .setDescription("Embed message / description")
        .setRequired(true)
    )
    .addChannelOption(option =>
      option
        .setName("channel")
        .setDescription("Target channel (TEXT only)")
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName("color")
        .setDescription("Embed color (orange, red, blue or hex)")
        .setRequired(false)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    // ⏱ Prevent timeout
    await interaction.deferReply({ flags: 64 });

    try {
      // 🔒 Guild only
      if (!interaction.inGuild()) {
        return interaction.editReply("❌ This command can only be used in a server.");
      }

      const member = interaction.member as GuildMember;

      // 🔐 Role check
      if (!member.roles.cache.has(CONFIG.RESTRICTED_ROLE_ID)) {
        return interaction.editReply("❌ You do not have permission to use this command.");
      }

      // 📥 Get options
      const heading = interaction.options.getString("heading", true);
      const paragraph = interaction.options.getString("paragraph", true);
      const rawChannel = interaction.options.getChannel("channel", true);
      const colorInput = interaction.options.getString("color") ?? "orange";

      // 🧱 Channel type guard (THIS FIXES YOUR ERROR)
      if (rawChannel.type !== ChannelType.GuildText) {
        return interaction.editReply("❌ Please select a TEXT channel only.");
      }

      // ✅ Now TypeScript KNOWS this is a TextChannel
      const channel = rawChannel as TextChannel;

      // 🎨 Color map
      const colors: Record<string, number> = {
        red: 0xff0000,
        blue: 0x3498db,
        green: 0x2ecc71,
        orange: 0xff6a00,
        yellow: 0xf1c40f,
        purple: 0x9b59b6,
      };

      const embedColor =
        colors[colorInput.toLowerCase()] ??
        parseInt(colorInput.replace("#", ""), 16) ??
        colors.orange;

      // 🧩 Build embed
      const embed = new EmbedBuilder()
        .setTitle(heading)
        .setDescription(paragraph)
        .setColor(embedColor)
        .setFooter({ text: "RP Management System" })
        .setTimestamp();

      // 📤 Send embed
      const sentMessage = await channel.send({ embeds: [embed] });

      // 📌 Auto-pin (discord.js v14 correct way)
      const botMember = interaction.guild!.members.me;
      if (
        botMember &&
        botMember.permissionsIn(channel).has(PermissionFlagsBits.PinMessages)
      ) {
        await sentMessage.pin();
      }

      // ✅ Done
      await interaction.editReply(`✅ Embed sent to ${channel}`);
    } catch (error) {
      console.error("❌ embedcreate error:", error);
      await interaction.editReply("❌ An error occurred. Check bot console.");
    }
  },
};
