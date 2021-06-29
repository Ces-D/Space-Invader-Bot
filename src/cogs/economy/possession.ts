import { PrismaClient, Possession } from "@prisma/client";
import { Client } from "discord.js";

export default class PossessionController {
  readonly client: Client;
  readonly prisma: PrismaClient;

  constructor(client: Client, prisma: PrismaClient) {
    this.client = client;
    this.prisma = prisma;
  }

  getPossessions(discordId: number) {
    const possessions = this.prisma.possession
      .findMany({
        where: {
          userDiscordId: discordId,
        },
        include: {
          item: true,
        },
      })
      .catch((error) => {
        console.error("Get Possessions Error\n\n", error);
        throw "There was a problem getting your possessions";
      });

    return possessions;
  }

  getPossession(discordId: number, itemId: number) {
    const possession = this.prisma.possession
      .findFirst({
        where: { userDiscordId: discordId, itemId: itemId },
      })
      .catch((error) => {
        console.error("Get Possession Error\n\n", error);
        throw "There was a problem getting the possession";
      });

    return possession;
  }

  updateStock(item: Possession, amount: number, remove: boolean) {
    let updatedPossession: Promise<Possession>;
    if (remove) {
      updatedPossession = this.prisma.possession.update({
        where: { id: item.id },
        data: { stock: { decrement: amount } },
      });
    } else {
      updatedPossession = this.prisma.possession.update({
        where: { id: item.id },
        data: { stock: { increment: amount } },
      });
    }
    updatedPossession.catch((error) => {
      console.error("Update Stock Error\n\n", error);
      throw "Could not update the item. Try again";
    });

    return updatedPossession;
  }
}
