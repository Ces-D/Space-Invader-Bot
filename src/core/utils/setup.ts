/**
 * Make sure the appropriate channels are created. Admin Channel, Economy channel?, etc
 */

import { Guild, TextChannel } from "discord.js";

export enum SetupCommand {
    MISSION_CONTROL = "mission-control",
}

export default class Setup {
    static createBotMissionControl(guild: Guild) {
        guild.channels.create("Mission Control", {
            position: 1,
            type: "text",
            permissionOverwrites: [{ id: guild.ownerID }],
            nsfw: false,
            reason: "Every bot needs a mission control",
        });
    }
}
