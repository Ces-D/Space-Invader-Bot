import { PrismaClient } from "@prisma/client";
import { Client, Message } from "discord.js";
import { parseForArguments } from "../../core/utils/parser";
import { EconomyCommands } from "./commands";
import Item from "./item";
import Possession from "./possession";
import Wallet from "./wallet";

export default class Economy {
  readonly Wallet: Wallet;
  readonly Item: Item;
  readonly Possession: Possession;

  constructor(client: Client, prisma: PrismaClient) {
    this.Wallet = new Wallet(client, prisma);
    this.Item = new Item(client, prisma);
    this.Possession = new Possession(client, prisma);
  }

  private async balanceCommand(message: Message) {
    try {
      if (message.member) {
        const w = await this.Wallet.get(parseInt(message.author.id));
        message.reply(`You have ${w.balance} Schmeckle(s)`);
      } else {
        throw new Error("You are not a member");
      }
    } catch (error) {
      message.reply(error);
    }
  }

  handleMessage(command: string, message: Message) {
    switch (command) {
      case EconomyCommands.User.BALANCE.primary:
        this.balanceCommand(message);
        break;
      case EconomyCommands.User.MERCHANDISE.primary:
        break;
      case EconomyCommands.User.POSSESSIONS.primary:
        break;
      case EconomyCommands.User.PURCHASE.primary:
        break;
      case EconomyCommands.Admin.CREATE.primary:
        break;
      case EconomyCommands.Admin.DEPOSIT.primary:
        break;
      case EconomyCommands.Admin.LIST.primary:
        break;
      case EconomyCommands.Admin.REMOVE.primary:
        break;
      case EconomyCommands.Admin.WITHDRAW.primary:
        break;
      default:
        console.log("Economy Default: ", command);
    }
  }
}
