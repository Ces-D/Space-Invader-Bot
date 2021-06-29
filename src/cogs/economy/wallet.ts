import { PrismaClient, Wallet } from "@prisma/client";
import { Client } from "discord.js";

export default class WalletController {
  readonly client: Client;
  readonly prisma: PrismaClient;
  private STARTING_BALANCE = 10;

  constructor(client: Client, prisma: PrismaClient) {
    this.client = client;
    this.prisma = prisma;
  }

  create(memberId: number, tag: string) {
    const wallet = this.prisma.wallet
      .create({
        data: {
          memberId: memberId,
          userTag: tag,
          balance: this.STARTING_BALANCE,
        },
      })
      .catch((error) => {
        console.error("Create Wallet Error: ", error);
        throw "Sorry your balance could not be created. Try again";
      });

    return wallet;
  }

  getComplete(memberId: number) {
    const wallet = this.prisma.wallet
      .findUnique({
        where: { memberId: memberId },
        rejectOnNotFound: true,
        include: { Possession: true },
      })
      .catch((error) => {
        console.error("Complete Wallet Error\n\n", error);
        throw new Error("Sorry we could not get the complete wallet. Try again");
      });
    return wallet;
  }

  get(memberId: number) {
    const wallet = this.prisma.wallet
      .findUnique({ where: { memberId: memberId }, rejectOnNotFound: true })
      .catch((error) => {
        console.error("Get Wallet Error\n\n", error);
        throw "Sorry we could not get the wallet. Try again";
      });
    return wallet;
  }

  updateBalance(memberId: number, amount: number, withdraw: boolean) {
    let newRecord: Promise<Wallet>;
    if (withdraw) {
      newRecord = this.prisma.wallet.update({
        where: { memberId: memberId },
        data: {
          balance: {
            decrement: amount,
          },
        },
      });
    } else {
      newRecord = this.prisma.wallet.update({
        where: { memberId: memberId },
        data: {
          balance: {
            increment: amount,
          },
        },
      });
    }
    newRecord.catch((error) => {
      console.error("Update Balance Error\n\n", error);
      throw "The update could not be completed try again";
    });

    return newRecord;
  }
}

//TODO: if no wallet found, creat the wallet
