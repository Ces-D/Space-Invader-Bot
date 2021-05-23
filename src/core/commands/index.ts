import { Client, Message } from "discord.js";
import Economy, { EconomyCommand } from "../../cogs/economy";
import Setup, { SetupCommand } from "../utils/setup";
import Base from "./base";

export default class CommandHandler extends Base {
    readonly client: Client;
    readonly economy: Economy;

    constructor(client: Client) {
        super(client);
        this.economy = Economy.createEconomy(client);
    }

    handleMessage(message: Message) {
        if (this.assertCommand(message)) {
            const { primaryCommand, subCommands } = this.Commands(message.content);

            switch (primaryCommand) {
                case SetupCommand.MISSION_CONTROL:
                    Setup.createBotMissionControl(message.guild);
                    break;
                case EconomyCommand.BALANCE:
                    this.economy.handleBalanceCommand(message.author);
                    break;
                case EconomyCommand.TRANSFER:
                    break;
                case EconomyCommand.PURCHASE:
                    break;
                case EconomyCommand.AVAILABLE:
                    break;

                default:
                    console.log(
                        "Command: ",
                        primaryCommand,
                        "\n",
                        "SubCommands: ",
                        subCommands
                    );
            }
        }
    }

    static createCommandHandler(client: Client) {
        return new CommandHandler(client);
    }
}
