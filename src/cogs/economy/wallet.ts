import { PrismaClient } from "@prisma/client";
import { Client } from "discord.js";

export default class Wallet {
  readonly client: Client;
  readonly prisma: PrismaClient;
  private STARTING_BALANCE = 10;

  constructor(client: Client, prisma: PrismaClient) {
    this.client = client;
    this.prisma = prisma;
  }

  get(discordId: number) {
    const wallet = this.prisma.wallet
      .findUnique({
        where: {
          discordId: discordId,
        },
        rejectOnNotFound: true,
      })
      .then((wallet) => {
        return wallet;
      })
      .catch((error) => {
        console.error("WALLET GET: ", error);
        throw new Error("Your balance could not be found. Try again");
      });
    return wallet;
  }

  create(discordId: number, tag: string) {
    const wallet = this.prisma.wallet
      .create({
        data: {
          discordId: discordId,
          userTag: tag,
          balance: this.STARTING_BALANCE,
        },
      })
      .then((wallet) => {
        return wallet;
      })
      .catch((error) => {
        console.error("WALLET CREATE: ", error);
        throw new Error("Your balance could not be set. Try again");
      });

    return wallet;
  }

  async update(discordId: number, amount: number, withdraw: boolean) {
    const oldRecord = await this.get(discordId);
    let updatedRecord;

    if (oldRecord.balance < amount && withdraw) {
      throw new Error(
        "Sorry you do not have the funds to withdraw that amount. Check balance"
      );
    } else if (withdraw) {
      updatedRecord = await this.prisma.wallet.update({
        where: { discordId: discordId },
        data: { balance: oldRecord.balance - amount },
      });
    } else {
      updatedRecord = await this.prisma.wallet.update({
        where: { discordId: discordId },
        data: { balance: oldRecord.balance + amount },
      });
    }
    return updatedRecord;
  }
}
