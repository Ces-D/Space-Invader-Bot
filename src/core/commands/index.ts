import { Client, Message } from "discord.js";

export default class CommandHandler {
    static handleMessage(message: Message) {
        switch (message) {
            default:
                console.log("pong")
        }
    }
}
