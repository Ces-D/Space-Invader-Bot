import { PrismaClient, Wallet } from "@prisma/client";
import { Client } from "discord.js";
import { REQUEST_ERROR } from "./commands";

export default class WalletController {
  readonly client: Client;
  readonly prisma: PrismaClient;
  private STARTING_BALANCE = 10;

  constructor(client: Client, prisma: PrismaClient) {
    this.client = client;
    this.prisma = prisma;
  }

  /**
   *
   * @param userId User.id and not GuildMember.id
   * @param amount Schmeckle amount
   * @param withdraw Boolean indicating a withdrawal or deposit
   * @returns Wallet
   */
  updateBalance(userId: number, amount: string, withdraw: boolean) {
    let newRecord: Promise<Wallet>;
    if (withdraw) {
      newRecord = this.prisma.wallet.update({
        where: { userId: userId },
        data: {
          balance: { decrement: parseInt(amount) },
        },
      });
    } else {
      newRecord = this.prisma.wallet.update({
        where: { userId: userId },
        data: {
          balance: { increment: parseInt(amount) },
        },
      });
    }
    newRecord.catch((error) => {
      console.error("Update Balance Error\n\n", error);
      throw REQUEST_ERROR;
    });

    return newRecord;
  }

  /**
   *
   * @param userId User.id, not GuildMember.id
   * @param include Boolean requesting Possessions
   * @returns Wallet
   */
  findOrCreate(userId: string, include: boolean = false) {
    const id = parseInt(userId);
    const wallet = this.prisma.wallet
      .upsert({
        where: { userId: id },
        create: { userId: id, balance: this.STARTING_BALANCE },
        update: {},
        include: {
          Possession: include,
        },
      })
      .catch((error) => {
        console.error("Find or Create Error\n\n", error);
        throw REQUEST_ERROR;
      });
    return wallet;
  }

  
}
