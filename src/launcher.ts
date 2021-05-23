import { PrismaClient } from "@prisma/client";
import { Client, Constants } from "discord.js";
import { config } from "dotenv";
import CommandHandler from "./core/commands";

config();
export const prisma = new PrismaClient();

const main = () => {
    const client = new Client();
    const commandHandler = CommandHandler.createCommandHandler(client, prisma);

    client.once(Constants.Events.CLIENT_READY, () => {
        console.log("Ready!");
        prisma.$connect().then(() => console.log("DB Connected"));
    });

    client.on(Constants.Events.MESSAGE_CREATE, (m) => {
        commandHandler.handleMessage(m);
    });

    client.once(Constants.Events.DISCONNECT, () => {
        prisma.$disconnect().then(() => console.log("DB Disconnected"));
    });


    client.login(process.env.BOT_TOKEN);
};

main();
