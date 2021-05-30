import { Client, Message } from "discord.js";
import { PrismaClient } from ".prisma/client";
import Permissions from "../../core/utils/permission";
import Cache from "../../core/utils/cache";
import Wallet from "./wallet";
import Item from "./item";
import { CliCommands } from "../../core/utils/cli";

export enum EconomyCommand {
  GET_GUILD_ITEMS = "items",
  CREATE_GUILD_ITEM = "create-item",
  GET_USER_POSSESSIONS = "possessions",
  GET_USER_WALLET_BALANCE = "balance",
  DEPOSIT_USER_WALLET_FUNDS = "deposit",
  TRANSFER_FUNDS_USER_TO_USER_WALLET = "transfer",
}

export default class Economy {
  readonly client: Client;
  readonly cache: Cache;
  readonly wallet: Wallet;
  readonly item: Item;

  constructor(client: Client, prisma: PrismaClient, cache: Cache) {
    this.client = client;
    this.cache = cache;
    this.wallet = new Wallet(prisma);
    this.item = new Item(prisma);
  }

  async getUserBalance(commands: CliCommands, message: Message) {
    const balance =
      this.cache.get({
        command: commands.primaryCommand,
        discordId: message.member.id,
      }) || await this.wallet.getBalance(message.member);

    message.reply(`Your balance is ${balance} Schmeckle(s)`);
  }

  depositUserFunds(commands: CliCommands, message: Message) {
    const amount = parseInt(commands.subCommands[0]);

    let cachedBalance =
      this.cache.get({
        command: commands.primaryCommand,
        discordId: message.member.id,
      }) || null;

    const balance = this.wallet.depositFunds(message.member, amount, cachedBalance);
    this.cache.set(
      {
        command: EconomyCommand.GET_USER_WALLET_BALANCE,
        discordId: message.member.id,
      },
      balance
    );
    message.reply(
      `Congrats ${message.author.tag}! ${amount} Schmeckle(s) have been deposited for you`
    );
  }

  /**
   *
   * @example Command Message Format
   * !command -amount -mention
   * !transfer -10 -@ces
   */
  transferFundsUserToUser(commands: CliCommands, message: Message) {
    const toWallet = message.mentions.members.first();
    const fromWallet = message.member;
    const amount = parseInt(commands.subCommands[0]);

    const cachedFromBalance =
      this.cache.get({ command: commands.primaryCommand, discordId: fromWallet.id }) ||
      null;
    const cachedToBalance =
      this.cache.get({ command: commands.primaryCommand, discordId: toWallet.id }) ||
      null;

    const transferState = this.wallet.transferFunds(
      fromWallet,
      toWallet,
      amount,
      cachedFromBalance,
      cachedToBalance
    );

    transferState
      ? message.reply(`The transfer of ${amount} Schmeckle(s) was successful`)
      : message.reply(`To bad! The transfer of ${amount} Schmeckle(s) did not go though`);
  }

  getGuildItems(message: Message) {}

  createGuildItem(
    { primaryCommand, subCommands }: CliCommands,
    message: Message,
    missionControlId: string
  ) {}

  getUserPossessions({ primaryCommand, subCommands }: CliCommands, message: Message) {}
}
