import { GuildChannel, GuildMember } from "discord.js";

export default class Permissions {
    static isAdmin(member: GuildMember): Boolean {
        return member.hasPermission("ADMINISTRATOR");
    }
    static isAdminChannel(channel: GuildChannel, adminChannelId: string): Boolean {
        return channel.id === adminChannelId ? true : false;
    }
}
