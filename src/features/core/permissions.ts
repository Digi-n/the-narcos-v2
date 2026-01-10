import { ChatInputCommandInteraction, GuildMember } from "discord.js";
import { CONFIG } from "../../config/config";

export function isManagement(member: GuildMember): boolean {
  return member.roles.cache.some(
    role => role.name === CONFIG.ROLES.MANAGEMENT
  );
}

export function managementOnly(
  interaction: ChatInputCommandInteraction
): boolean {
  return isManagement(interaction.member as GuildMember);
}

export function managementOrBanker(
  interaction: ChatInputCommandInteraction
): boolean {
  const member = interaction.member as GuildMember;

  return member.roles.cache.some(role =>
    role.name === CONFIG.ROLES.MANAGEMENT ||
    role.name === CONFIG.ROLES.BANKER
  );
}

export function canUpdateStock(
  interaction: ChatInputCommandInteraction
): boolean {
  const member = interaction.member as GuildMember;

  return member.roles.cache.some(role =>
    [
      CONFIG.ROLES.MANAGEMENT,
      CONFIG.ROLES.GROWER,
      CONFIG.ROLES.COOK,
      CONFIG.ROLES.DISTRIBUTOR
    ].includes(role.name)
  );
}
