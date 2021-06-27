import { PrismaClient } from "@prisma/client";
import { Client, Message } from "discord.js";
import Economy from "../../cogs/Economy";
import { UserEconomyCmds, AdminEconomyCmds } from "../../cogs/Economy/commands";

export default class CommandControl {
  protected PRIMARY_PREFIX = "$";
  readonly Economy: Economy;

  constructor(client: Client, prisma: PrismaClient) {
    this.Economy = new Economy(client, prisma);
  }

  private isAdmissableMessage(message: Message): boolean {
    if (message.author.bot) return false; // msg is coming from a bot
    if (!message.guild) return false; // msg is going into dms
    if (!message.member) return false; // msg is coming from outside guild user
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
        case UserEconomyCmds.BALANCE:
          this.Economy.balanceCommand(message);
          break;
        case UserEconomyCmds.MERCHANDISE:
          break;
        case UserEconomyCmds.POSSESSIONS:
          break;
        case UserEconomyCmds.PURCHASE:
          break;
        case AdminEconomyCmds.CREATE:
          break;
        case AdminEconomyCmds.DEPOSIT:
          this.Economy.depositCommand(message);
          break;
        case AdminEconomyCmds.LIST:
          break;
        case AdminEconomyCmds.REMOVE:
          break;
        case AdminEconomyCmds.WITHDRAW:
          break;
        default:
          console.log(command);
      }
    }
  }
}
