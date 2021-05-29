import { PrismaClient } from ".prisma/client";
import { GuildMember } from "discord.js";
import Item from "./item";

export default class Possession {
  readonly prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  addPossession(member: GuildMember, itemName: string) {}

  adjustStock(member: GuildMember, amount: number) {}

  sell(owner: GuildMember, buyer: GuildMember, itemName: string, price: number) {}

  purchaseFromBot(member: GuildMember, itemName: string) {}
}
