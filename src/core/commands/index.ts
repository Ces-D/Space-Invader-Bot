import { Client, Message } from "discord.js";

class CommandBase {
    client: Client;
    protected PREFIX = "!";

    constructor(client: Client) {
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
        if (!message.content.startsWith(this.PREFIX)) return false;
        return true;
    }

    protected cleanMessage(message: Message) {
        const args = message.content.slice(this.PREFIX.length).trim().split(/ +/g);
        const cmd = args.shift().toLowerCase();

        if (cmd.length === 0) return; // command doesn't exist
        return cmd;
    }
}

export default class CommandHandler extends CommandBase {
    client: Client;
    constructor(client: Client) {
        super(client);
    }

    handleMessage(message: Message) {
        if (this.assertCommand(message)) {
            const cmd = this.cleanMessage(message);

            switch (cmd) {
                case "hello":
                    message.channel.send("Hi");
                    break;
                default:
                    console.log("pong");
            }
        }
    }
}
