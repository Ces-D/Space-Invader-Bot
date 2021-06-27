import { PrismaClient } from "@prisma/client";
import { Client, Message } from "discord.js";
import { parseForArguments, hasAdminPermissions } from "../../core/utils/parser";
import Item from "./item";
import Possession from "./possession";
import Wallet from "./wallet";
import { EconomySubCmds } from "./commands";

export default class Economy {
  readonly Wallet: Wallet;
  readonly Item: Item;
  readonly Possession: Possession;

  constructor(client: Client, prisma: PrismaClient) {
    this.Wallet = new Wallet(client, prisma);
    this.Item = new Item(client, prisma);
    this.Possession = new Possession(client, prisma);
  }

  async balanceCommand(message: Message) {
    try {
      const w = await this.Wallet.get(parseInt(message.author.id));
      message.reply(`You have ${w.balance} Schmeckle(s)`);
    } catch (error) {
      message.reply(error);
    }
  }

  async depositCommand(message: Message) {
    try {
      if (hasAdminPermissions(message.member)) {
        const args = parseForArguments(message, true, [EconomySubCmds.AMOUNT]);
        //TODO: confirm the structure that args is going to be returned as. convert that into a type
      }
      return; // ignore msg
    } catch (error) {
      message.reply(error);
    }
  }
}
