import { PrismaClient } from ".prisma/client";
import { Client, Message } from "discord.js";
import Economy, { EconomyCommand } from "../../cogs/economy";
import Cache from "../utils/cache";
import Setup, { SetupCommand } from "../utils/setup";
import Base from "./base";

export default class CommandHandler extends Base {
  readonly client: Client;
  readonly economy: Economy;
  readonly setup: Setup;
  readonly cache: Cache;

  constructor(client: Client, prisma: PrismaClient) {
    super(client);
    this.setup = Setup.createSetup(client);
    this.cache = new Cache();
    this.economy = new Economy(client, prisma, this.cache);
  }

  handleMessage(message: Message) {
    if (this.assertCommand(message)) {
      const commands = this.Commands(message.content);

      switch (commands.primaryCommand) {
        case SetupCommand.MISSION_CONTROL:
          this.setup.createBotMissionControl(message.guild);
          break;

        case EconomyCommand.GET_USER_WALLET_BALANCE:
          this.economy.getUserBalance(commands, message);
          break;

        case EconomyCommand.GET_GUILD_ITEMS:
          this.economy.getGuildItems(message);
          break;

        case EconomyCommand.CREATE_GUILD_ITEM:
          this.economy.createGuildItem(commands, message, this.setup.missionControlId);
          break;

        case EconomyCommand.GET_USER_POSSESSIONS:
          this.economy.getUserPossessions(commands, message);

        default:
          console.log(
            "Command: ",
            commands.primaryCommand,
            "\n",
            "SubCommands: ",
            commands.subCommands
          );
      }
    }
  }

  static createCommandHandler(client: Client, prisma: PrismaClient) {
    return new CommandHandler(client, prisma);
  }
}
