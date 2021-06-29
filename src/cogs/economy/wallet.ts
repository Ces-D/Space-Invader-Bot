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

  create(discordId: number, tag: string) {
    const wallet = this.prisma.wallet
      .create({
        data: {
          discordId: discordId,
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

  get(discordId: number) {
    const wallet = this.prisma.wallet
      .findUnique({ where: { discordId: discordId }, rejectOnNotFound: true })
      .catch((error) => {
        console.error("Get Wallet Error\n\n", error);
        throw "Sorry we could not get the wallet. Try again";
      });
    return wallet;
  }

  fundsAvailable(record: Wallet, amount: number): boolean {
    if (record.balance < amount) {
      throw "Sorry you do not have the funds to withdraw that amount. Check your balance";
    }
    return true;
  }

  updateBalance(account: Wallet, amount: number, withdraw: boolean) {
    let newBalance: number;
    if (withdraw) {
      newBalance = account.balance - amount;
    } else {
      newBalance = account.balance + amount;
    }
    const newRecord = this.prisma.wallet
      .update({
        where: { discordId: account.discordId },
        data: {
          balance: newBalance,
        },
      })
      .catch((error) => {
        console.error("Update Balance Error\n\n", error);
        throw "The update could not be completed try again";
      });

    return newRecord;
  }
}

//FIXME: the functionare assuming client facing
/**
 * Admin dont need their balance checked when updating accounts. I.E when
 * depositing into accounts or removing from accounts. Isolate the checking to a possible
 * helper function or re do this.
 *
 * Consider using .then with the functions to gain greater variability in how we pipe together
 * prisma calls
 */


//TODO: use the increment and decrement of update to update