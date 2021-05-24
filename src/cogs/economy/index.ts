import { Client, Message } from "discord.js";

import { CliCommands } from "../../core/utils/cli";
import { PrismaClient } from ".prisma/client";
import Permissions from "../../core/utils/permission";

// TODO: come up with a way to not be so repetitive

export const enum EconomyCommand {
  GET_GUILD_ITEMS = "items",
  CREATE_GUILD_ITEM = "create-item",
  GET_USER_POSSESSIONS = "possessions",
  GET_USER_WALLET_BALANCE = "balance",
}

export default class Economy {
  readonly client: Client;
  readonly prisma: PrismaClient;

  constructor(client: Client, prisma: PrismaClient) {
    this.client = client;
    this.prisma = prisma;
  }

  async getItems() {
    return await this.prisma.item.findMany();
  }

  async createItem(
    { primaryCommand, subCommands }: CliCommands,
    message: Message,
    missionControlId: string
  ) {
    if (
      Permissions.isAdmin(message.member) &&
      Permissions.isAdminChannel(message.channel, missionControlId)
    ) {
    }
  }

  getUserBalance({ primaryCommand, subCommands }: CliCommands, message: Message) {
    console.log(message.author.tag);
  }

  getUserPossessions({ primaryCommand, subCommands }: CliCommands, message: Message) {
    console.log(message.author.tag);
  }

  static createEconomy(client: Client, prisma: PrismaClient): Economy {
    return new Economy(client, prisma);
  }
}
