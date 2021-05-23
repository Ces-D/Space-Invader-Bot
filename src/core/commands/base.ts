import { Client, Message } from "discord.js";
import Cli from "../utils/cli";

export default class CommandBase extends Cli {
    client: Client;

    constructor(client: Client) {
        super();
        this.client = client;
    }

    /**
     *
     * @returns boolean satisfying if message is allowed through
     */
    protected assertCommand(message: Message): Boolean {
        // Do nothing if
        if (message.author.bot) return false; // msg is coming from a bot
        if (!message.guild) return false; // msg is going into dms
        // msg doesn't start with prefix
        if (!message.content.startsWith(this.PRIMARY_PREFIX)) return false;
        return true;
    }
}
