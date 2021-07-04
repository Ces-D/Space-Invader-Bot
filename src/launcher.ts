import { PrismaClient } from "@prisma/client";
import { Client, Constants } from "discord.js";
import { config } from "dotenv";
import CommandControl from "./core/commands";

config();

const main = () => {
  const prisma = new PrismaClient();
  const client = new Client();
  const control = new CommandControl(client, prisma);

  client.once(Constants.Events.CLIENT_READY, () => {
    prisma
      .$connect()
      .then(() => console.log("Prisma Connected"))
      .finally(() => console.log("Application Ready"));
  });

  client.on(Constants.Events.DISCONNECT, () => {
    prisma
      .$disconnect()
      .then(() => console.log("Prisma Disconnected"))
      .finally(() => console.log("Application Disconnected"));
  });

  client.on(Constants.Events.MESSAGE_CREATE, (message) => {
    control.handleMessage(message);
  });

  client.login(process.env.Bot_Token);
};

main();
