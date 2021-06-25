import { PrismaClient } from "@prisma/client";
import { Client, Message } from "discord.js";
import Economy from "../../cogs/Economy";
import { EconomyCommands } from "../../cogs/Economy/commands";

export default class CommandControl {
  protected PRIMARY_PREFIX = "$";
  readonly Economy: Economy;

  constructor(client: Client, prisma: PrismaClient) {
    this.Economy = new Economy(client, prisma);
  }

  private isAdmissableMessage(message: Message): boolean {
    if (message.author.bot) return false; // msg is coming from a bot
    if (!message.guild) return false; // msg is going into dms
    if (message.content.charAt(0) !== this.PRIMARY_PREFIX) return false; // message is command
    return true;
  }

  private parseForCommand(message: Message) {
    const m = message.content.trim().toLowerCase();
    if (m.startsWith(this.PRIMARY_PREFIX)) {
      return m.split(" ")[0].slice(this.PRIMARY_PREFIX.length);
    } else {
      return;
    }
  }

  handleMessage(message: Message) {
    if (this.isAdmissableMessage(message)) {
      const command = this.parseForCommand(message);
      switch (command) {
        case EconomyCommands.User.BALANCE.primary:
          this.Economy.handleMessage(command, message);
          break;
        case EconomyCommands.User.MERCHANDISE.primary:
          this.Economy.handleMessage(command, message);
          break;
        case EconomyCommands.User.POSSESSIONS.primary:
          this.Economy.handleMessage(command, message);
          break;
        case EconomyCommands.User.PURCHASE.primary:
          this.Economy.handleMessage(command, message);
          break;
        case EconomyCommands.Admin.CREATE.primary:
          this.Economy.handleMessage(command, message);
          break;
        case EconomyCommands.Admin.DEPOSIT.primary:
          this.Economy.handleMessage(command, message);
          break;
        case EconomyCommands.Admin.LIST.primary:
          this.Economy.handleMessage(command, message);
          break;
        case EconomyCommands.Admin.REMOVE.primary:
          this.Economy.handleMessage(command, message);
          break;
        case EconomyCommands.Admin.WITHDRAW.primary:
          this.Economy.handleMessage(command, message);
          break;
        default:
          console.log(command);
      }
    }
  }
}
