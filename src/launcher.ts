import { Client, Constants } from "discord.js";
import { config } from "dotenv";
import CommandHandler from "./core/commands";

config();

const client = new Client();

client.once(Constants.Events.CLIENT_READY, () => {
    console.log("Ready!");
});

client.on(Constants.Events.MESSAGE_CREATE, (m) => {
    CommandHandler.handleMessage(m);
});

client.login(process.env.BOT_TOKEN);
