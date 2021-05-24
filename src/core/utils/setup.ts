/**
 * Make sure the appropriate channels are created. Admin Channel, Economy channel?, etc
 */

import { Client, Guild } from "discord.js";

export enum SetupCommand {
    MISSION_CONTROL = "mission-control",
}

export default class Setup {
    readonly client: Client;
    missionControlId: string;

    constructor(client: Client) {
        this.client = client;
    }

    async createBotMissionControl(guild: Guild) {
        const missionControl = await guild.channels.create("Mission Control", {
            position: 1,
            type: "text",
            permissionOverwrites: [{ id: guild.ownerID }],
            nsfw: false,
            reason: "Every bot needs a mission control",
        });
        this.missionControlId = missionControl.id;
    }

    static createSetup(client: Client): Setup {
        return new Setup(client);
    }
}
