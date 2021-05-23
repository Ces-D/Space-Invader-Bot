import { Client, GuildChannel, GuildMember } from "discord.js";

export default class Permissions {
    static isAdmin(member: GuildMember): Boolean {
        return member.hasPermission("ADMINISTRATOR")
    }
    static isAdminChannel(channel: GuildChannel, missionControlId: string): Boolean {
        return channel.id === missionControlId ? true : false;
    }

}
