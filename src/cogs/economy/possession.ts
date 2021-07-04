import { PrismaClient, Possession } from "@prisma/client";
import { Client } from "discord.js";

export default class PossessionController {
  readonly client: Client;
  readonly prisma: PrismaClient;

  constructor(client: Client, prisma: PrismaClient) {
    this.client = client;
    this.prisma = prisma;
  }

  getPossessions(memberId: number) {
    const possessions = this.prisma.possession
      .findMany({
        where: {
          ownerId: memberId,
        },
      })
      .catch((error) => {
        console.error("Get Possessions Error\n\n", error);
        throw "There was a problem getting your possessions";
      });

    return possessions;
  }

  getPossession(memberId: number, itemName: string) {
    const possession = this.prisma.possession
      .findFirst({
        where: { ownerId: memberId, itemName: itemName },
      })
      .catch((error) => {
        console.error("Get Possession Error\n\n", error);
        throw "There was a problem getting the possession";
      });

    return possession;
  }

  updateStock(itemName: string, userId: number, amount: string, remove: boolean) {
    let updatedPossession: Promise<Possession>;
    if (remove) {
      updatedPossession = this.prisma.possession.update({
        where: { ownerId_itemName: { itemName: itemName, ownerId: userId } },
        data: { stock: { decrement: parseInt(amount) } },
      });
    } else {
      updatedPossession = this.prisma.possession.update({
        where: { ownerId_itemName: { itemName: itemName, ownerId: userId } },
        data: { stock: { increment: parseInt(amount) } },
      });
    }
    updatedPossession.catch((error) => {
      console.error("Update Stock Error\n\n", error);
      throw "Could not update the item. Try again";
    });

    return updatedPossession;
  }
}
