import { Client, Constants } from "discord.js";
import { config } from "dotenv";
import CommandHandler from "./core/commands";

config();

const client = new Client();
const commandHandler = CommandHandler.createCommandHandler(client)


client.once(Constants.Events.CLIENT_READY, () => {
    console.log("Ready!")
});


client.on(Constants.Events.MESSAGE_CREATE, (m) => {
    commandHandler.handleMessage(m);
});

client.login(process.env.BOT_TOKEN);

// TODO: Change the data models to handle the use the storage method