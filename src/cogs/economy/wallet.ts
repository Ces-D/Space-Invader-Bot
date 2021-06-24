import { PrismaClient } from ".prisma/client";
import { GuildMember } from "discord.js";
import Possession from "./possession";

export default class Wallet extends Possession {
  readonly prisma: PrismaClient;
  private STARTING_BALANCE = 10;

  constructor(prisma: PrismaClient) {
    super(prisma);
    this.prisma = prisma;
  }

  private async createWallet(member: GuildMember): Promise<void> {
    await this.prisma.wallet.create({
      data: {
        discordId: parseInt(member.id),
        userTag: member.displayName,
        balance: this.STARTING_BALANCE,
      },
    });
  }

  private async withdrawFunds(
    member: GuildMember,
    amount: number,
    cachedBalance?: number
  ) {
    let balance;
    if (cachedBalance) {
      balance = cachedBalance;
    } else {
      balance = await this.getBalance(member);
    }

    this.prisma.wallet.update({
      where: { discordId: parseInt(member.id) },
      data: { balance: balance - amount },
    });
    return;
  }

  async getBalance(member: GuildMember): Promise<number> {
    const wallet = await this.prisma.wallet.findFirst({
      where: {
        discordId: parseInt(member.id),
      },
    });

    let balance;
    if (wallet) {
      balance = wallet.balance;
    } else {
      this.createWallet(member);
      balance = this.STARTING_BALANCE;
    }

    return balance;
  }

  async depositFunds(
    member: GuildMember,
    amount: number,
    cachedBalance?: number
  ): Promise<number> {
    let balance;
    if (cachedBalance) {
      balance = cachedBalance;
    } else {
      balance = await this.getBalance(member);
    }

    const newBalance = await this.prisma.wallet.update({
      where: { discordId: parseInt(member.id) },
      data: { balance: balance + amount },
    });

    return newBalance.balance;
  }

  transferFunds(
    fromWallet: GuildMember,
    toWallet: GuildMember,
    amount: number,
    cachedFromBalance?: number,
    cachedToBalance?: number
  ): boolean {
    let fromBalance, toBalance;

    if (cachedFromBalance) {
      fromBalance = cachedFromBalance;
    } else {
      fromBalance = this.getBalance(fromWallet);
    }

    if (cachedToBalance) {
      toBalance = cachedToBalance;
    } else {
      toBalance = this.getBalance(toWallet);
    }

    if (fromBalance < amount) {
      return false;
    }

    this.depositFunds(toWallet, amount, cachedToBalance);
    this.withdrawFunds(fromWallet, amount, cachedFromBalance);

    return true;
  }
}


//TODO: test the created functions
// TODO: if any failure rollback in transferFunds