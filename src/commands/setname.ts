import {
  ChatInputCommandInteraction,
  SlashCommandBuilder,
  GuildMember,
  ChannelType,
  PermissionFlagsBits,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from "discord.js";
import { CONFIG } from "../config/config";
import { loadNameLocks, saveNameLocks } from "../utils/storage";
import { managementOnly } from "../utils/permissions";

/* =========================
   SUPPORT VC BUTTON
========================= */
function supportVCButton() {
  return new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder()
      .setLabel("🎧 Join Support Waiting VC")
      .setStyle(ButtonStyle.Link)
      .setURL(
        `https://discord.com/channels/${CONFIG.GUILD_ID}/${CONFIG.CHANNELS.SUPPORT_VC}`
      )
  );
}

/* =========================
   HELPERS
========================= */

// Convert input → FULL CAPS + clean spaces
function formatRPName(input: string): string {
  return input.trim().replace(/\s+/g, " ").toUpperCase();
}

// STRICT FORMAT: JOHN CARTER
function isStrictRPName(name: string): boolean {
  return /^[A-Z]+ [A-Z]+$/.test(name);
}

// Letters & spaces only
function isLettersOnly(input: string): boolean {
  return /^[A-Za-z\s]+$/.test(input);
}

/* =========================
   /setname
========================= */
export const setNameCommand = {
  data: new SlashCommandBuilder()
    .setName("setname")
    .setDescription("Set your RP name (one time only)")
    .addStringOption(option =>
      option
        .setName("name")
        .setDescription("Firstname Lastname")
        .setRequired(true)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply({ ephemeral: true });

    /* ---------- CHANNEL CHECK ---------- */
    if (
      !interaction.inGuild() ||
      !interaction.channel ||
      interaction.channel.type !== ChannelType.GuildText
    ) {
      await interaction.editReply("❌ Server text channel only.");
      return;
    }

    if (interaction.channelId !== CONFIG.CHANNELS.NAME_CHANGE) {
      await interaction.editReply({
        content: `❌ Use this command only in <#${CONFIG.CHANNELS.NAME_CHANGE}>`,
      });
      return;
    }

    const member = interaction.member as GuildMember;
    const userId = interaction.user.id;
    const rawInput = interaction.options.getString("name", true);

    /* ---------- VALIDATION ---------- */
    if (!isLettersOnly(rawInput)) {
      await interaction.editReply({
        content:
          "❌ **INVALID NAME**\n" +
          "• Letters only\n" +
          "• No numbers or symbols\n\n" +
          "📞 Join Support VC if stuck.",
        components: [supportVCButton()],
      });
      return;
    }

    const formattedName = formatRPName(rawInput);

    if (!isStrictRPName(formattedName)) {
      await interaction.editReply({
        content:
          "❌ **INVALID NAME FORMAT**\n" +
          "• FIRSTNAME LASTNAME\n" +
          "• CAPITAL LETTERS ONLY\n\n" +
          "📞 Join Support VC if stuck.",
        components: [supportVCButton()],
      });
      return;
    }

    const nameLocks = loadNameLocks();

    /* ---------- ONE-TIME ONLY ---------- */
    if (nameLocks[userId]) {
      await interaction.editReply({
        content:
          "❌ Your RP name is already set.\n" +
          "📞 Please report to Support Waiting VC.",
        components: [supportVCButton()],
      });
      return;
    }

    /* ---------- SET NICKNAME ---------- */
    await member.setNickname(formattedName);

    nameLocks[userId] = true;
    saveNameLocks(nameLocks);

    await interaction.editReply({
      content: `✅ Your RP name has been set to **${formattedName}**`,
    });
  },
};

/* =========================
   /resetname (Management)
========================= */
export const resetNameCommand = {
  data: new SlashCommandBuilder()
    .setName("resetname")
    .setDescription("Reset a member's RP name (Management only)")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageNicknames)
    .addUserOption(option =>
      option
        .setName("member")
        .setDescription("Member to reset")
        .setRequired(true)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply({ ephemeral: true });

    if (!interaction.inGuild()) return;

    if (!managementOnly(interaction)) {
      await interaction.editReply("❌ Only Management can use this.");
      return;
    }

    const target = interaction.options.getMember("member") as GuildMember;
    if (!target) {
      await interaction.editReply("❌ Member not found.");
      return;
    }

    const nameLocks = loadNameLocks();

    if (!nameLocks[target.id]) {
      await interaction.editReply(
        "❌ This member does not have a locked RP name."
      );
      return;
    }

    delete nameLocks[target.id];
    saveNameLocks(nameLocks);

    await target.setNickname(null);

    await interaction.editReply(
      `✅ ${target.user.username}'s RP name has been reset.`
    );
  },
};
