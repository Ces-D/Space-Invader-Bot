import {
  DMChannel,
  GuildMember,
  NewsChannel,
  TextChannel,
} from "discord.js";

export default class Permissions {
  static isAdmin(member: GuildMember): Boolean {
    return member.hasPermission("ADMINISTRATOR");
  }
  static isAdminChannel(
    channel: TextChannel | DMChannel | NewsChannel,
    missionControlId: string
  ): Boolean {
    return channel.id === missionControlId ? true : false;
  }
}
