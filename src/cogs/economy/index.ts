import { PrismaClient } from "@prisma/client";
import { Client, Message } from "discord.js";
import {
  parseForArguments,
  hasAdminPermissions,
  argumentsFulfilled,
} from "../../core/utils/parser";
import Item from "./item";
import Possession from "./possession";
import Wallet from "./wallet";
import {
  CREATE_WALLET_SUCCESS,
  EconomySubCmds,
  AdminEconomyCmds,
  GET_BALANCE_SUCCESS,
  UPDATE_BALANCE_SUCCESS,
  MISSING_ARGUMENTS_ERROR,
  CREATE_ITEM_SUCCESS,
  REMOVE_POSSESSION_SUCCESS,
  UserEconomyCmds,
  INSUFFICIENT_FUNDS,
  INSUFFICIENT_ITEMS,
} from "./commands";

export default class Economy {
  readonly Wallet: Wallet;
  readonly Item: Item;
  readonly Possession: Possession;

  constructor(client: Client, prisma: PrismaClient) {
    this.Wallet = new Wallet(client, prisma);
    this.Item = new Item(client, prisma);
    this.Possession = new Possession(client, prisma);
  }

  //FIXME: send a different message if the wallet is already created
  createCommand(message: Message) {
    this.Wallet.findOrCreate(message.author.id)
      .then((wallet) => {
        message.reply(CREATE_WALLET_SUCCESS(wallet.balance));
      })
      .catch((error) => {
        message.reply(error);
      });
  }

  balanceCommand(message: Message) {
    this.Wallet.findOrCreate(message.author.id)
      .then((wallet) => {
        message.reply(GET_BALANCE_SUCCESS(wallet.balance));
      })
      .catch((error) => {
        message.reply(error);
      });
  }

  depositCommand(message: Message) {
    if (hasAdminPermissions(message.member)) {
      const subCmds = [EconomySubCmds.AMOUNT];
      const args = parseForArguments(message, true, subCmds);
      if (argumentsFulfilled(args, subCmds, true)) {
        const userId = (args["member"] && parseInt(args["member"].user.id)) || 0; //FIXME all requests of userId

        this.Wallet.updateBalance(userId, args[EconomySubCmds.AMOUNT], false)
          .then((updatedAccount) => {
            message.reply(UPDATE_BALANCE_SUCCESS(updatedAccount.balance, false));
          })
          .catch((error) => {
            message.reply(error);
          });
      } else {
        message.reply(
          MISSING_ARGUMENTS_ERROR(
            `${AdminEconomyCmds.DEPOSIT} ${EconomySubCmds.AMOUNT}=<number> <mention>`
          )
        );
      }
    }
    return; // ignore msg
  }

  withdrawCommand(message: Message) {
    if (hasAdminPermissions(message.member)) {
      const subCmds = [EconomySubCmds.AMOUNT];
      const args = parseForArguments(message, true, subCmds);
      if (argumentsFulfilled(args, subCmds, true)) {
        const userId = (args["member"] && parseInt(args["member"].user.id)) || 0;

        this.Wallet.updateBalance(userId, args[EconomySubCmds.AMOUNT], true)
          .then((updatedAccount) => {
            message.reply(UPDATE_BALANCE_SUCCESS(updatedAccount.balance, true));
          })
          .catch((error) => {
            message.reply(error);
          });
      } else {
        message.reply(
          MISSING_ARGUMENTS_ERROR(
            `${AdminEconomyCmds.WITHDRAW} ${EconomySubCmds.AMOUNT}=<number> <mention>`
          )
        );
      }
    }
    return; // ignore msg
  }

  createItemCommand(message: Message) {
    if (hasAdminPermissions(message.member)) {
      const subCmds = [EconomySubCmds.ITEM, EconomySubCmds.PRICE, EconomySubCmds.STOCK];
      const args = parseForArguments(message, false, subCmds);
      if (argumentsFulfilled(args, subCmds, false)) {
        this.Item.create(
          args[EconomySubCmds.ITEM],
          args[EconomySubCmds.PRICE],
          args[EconomySubCmds.STOCK]
        )
          .then((newItem) => {
            message.reply(
              CREATE_ITEM_SUCCESS(newItem.name, newItem.price, newItem.stock)
            );
          })
          .catch((error) => {
            message.reply(error);
          });
      } else {
        message.reply(
          MISSING_ARGUMENTS_ERROR(
            `${AdminEconomyCmds.CREATE} ${EconomySubCmds.ITEM}=<string> ${EconomySubCmds.PRICE}=<number> ${EconomySubCmds.STOCK}=<number>`
          )
        );
      }
    }
    return; // ignore msg
  }
  //TODO: continue here
  getPossessionsCommand(message: Message) {
    this.Possession.getPossessions(parseInt(message.author.id))
      .then((possessions) => {
        let data: string[] = [];

        data.push("**Possessions List**");
        possessions.forEach((possession) => {
          const instance = `Item: ${possession.itemName}   |   Stock: ${possession.stock}`;
          data.push(instance);
        });
        message.reply(data);
      })
      .catch((error) => {
        message.reply(error);
      });
  }

  getMerchandiseCommand(message: Message) {
    this.Item.getAll()
      .then((allItems) => {
        let data: string[] = [];

        data.push("**Guild Merchandise List**");
        allItems.forEach((item) => {
          const instance = `Item: ${item.name}   |   Stock: ${item.stock}   |   Price: ${item.price}`;
          data.push(instance);
        });

        message.reply(data);
      })
      .catch((error) => {
        message.reply(error);
      });
  }

  removePossessionCommand(message: Message) {
    if (hasAdminPermissions(message.member)) {
      const subCmds = [EconomySubCmds.ITEM, EconomySubCmds.AMOUNT];
      const args = parseForArguments(message, true, subCmds);
      if (argumentsFulfilled(args, subCmds, true)) {
        const userId = (args["member"] && parseInt(args["member"].user.id)) || 0;

        this.Possession.updateStock(
          args[EconomySubCmds.ITEM],
          userId,
          args[EconomySubCmds.AMOUNT],
          true
        )
          .then((possession) => {
            message.reply(
              REMOVE_POSSESSION_SUCCESS(possession.itemName, possession.stock)
            );
          })
          .catch((error) => {
            message.reply(error);
          });
      } else {
        message.reply(
          MISSING_ARGUMENTS_ERROR(
            `${AdminEconomyCmds.REMOVE} ${EconomySubCmds.ITEM}=<string> ${EconomySubCmds.AMOUNT}=<number> <mention>`
          )
        );
      }
    }
    return; //ignore msg
  }

  summaryWalletCommand(message: Message) {
    if (hasAdminPermissions(message.member)) {
      const subCmds: [] = [];
      const args = parseForArguments(message, true, subCmds);
      if (argumentsFulfilled(args, subCmds, true)) {
        const userId = (args["member"] && args["member"].user.id) || "0";

        let data: string[] = [];
        this.Wallet.findOrCreate(userId, true).then((wallet) => {
          data.push("**Wallet Summary**");
          data.push(`Balance: ${wallet.balance}`);
          wallet.Possession.forEach((possession) => {
            const instance = `Item: ${possession.itemName}   |   Stock: ${possession.stock} `;
            data.push(instance);
          });
          message.reply(data);
        });
      } else {
        message.reply(MISSING_ARGUMENTS_ERROR(`${AdminEconomyCmds.SUMMARY} <mention>`));
      }
    }
    return; // ignore msg
  }

  async purchaseItems(message: Message) {
    const subCmds = [EconomySubCmds.ITEM, EconomySubCmds.AMOUNT];
    const args = parseForArguments(message, false, subCmds);
    if (argumentsFulfilled(args, subCmds, false)) {
      const itemName = args[EconomySubCmds.ITEM];
      const amountAsked = args[EconomySubCmds.AMOUNT];
      const buyerBalance = (await this.Wallet.findOrCreate(message.author.id, false))
        .balance;
      const item = await this.Item.get(itemName);
      // not enough items
      if (parseInt(amountAsked) < item.stock) {
        message.reply(INSUFFICIENT_ITEMS(parseInt(amountAsked), itemName));
      }
      // not enough funds
      if (buyerBalance < amountAsked * item.price) {
        message.reply(INSUFFICIENT_FUNDS);
      }
      // You are ready to buy
      try {
        await this.Item.updateStock(itemName, amountAsked, false);
        await this.Wallet.updateBalance(
          parseInt(message.author.id),
          (amountAsked * item.price).toString(),
          true
        );
        this.Possession.updateStock(
          itemName,
          parseInt(message.author.id),
          amountAsked,
          false
        );
        message.reply(`Success. You bought ${amountAsked} ${itemName}`);
      } catch (error) {
        console.error("Error with Transaction: ", error);
        message.reply(
          "Error happened. Check you balance and possessions. Something might have happened. contact admin"
        );
      }
    } else {
      message.reply(
        MISSING_ARGUMENTS_ERROR(
          `${UserEconomyCmds.PURCHASE} ${EconomySubCmds.ITEM}=<string> ${EconomySubCmds.AMOUNT}=<number>`
        )
      );
    }
  } // TODO: test and add to commands

  listCommands(message: Message) {
    let commands: string[] = [];
    if (hasAdminPermissions(message.member)) {
      commands.push(
        `Command: ${AdminEconomyCmds.CREATE}   |   Arguments: ${EconomySubCmds.ITEM}, ${EconomySubCmds.PRICE}, ${EconomySubCmds.PRICE}`
      );
      commands.push(
        `Command: ${AdminEconomyCmds.DEPOSIT}   |   Arguments: mention, ${EconomySubCmds.AMOUNT}`
      );
      commands.push(
        `Command: ${AdminEconomyCmds.WITHDRAW}   |   Arguments: mention, ${EconomySubCmds.AMOUNT}`
      );
      commands.push(
        `Command: ${AdminEconomyCmds.REMOVE}   |   Arguments: mention, ${EconomySubCmds.ITEM}, ${EconomySubCmds.AMOUNT}`
      );
      commands.push(`Command: ${AdminEconomyCmds.SUMMARY}   |   Arguments: mention`);
    }
    commands.push(`Command: ${UserEconomyCmds.BALANCE}   |   Arguments: none`);
    commands.push(`Command: ${UserEconomyCmds.POSSESSIONS}   |   Arguments: none`);
    commands.push(`Command: ${UserEconomyCmds.MERCHANDISE}   |   Arguments: none`);
    //TODO: finish purchase
    commands.push(
      `Command: ${UserEconomyCmds.PURCHASE}   |   Arguments: ${EconomySubCmds.ITEM}, ${EconomySubCmds.PRICE}, ${EconomySubCmds.PRICE}`
    );
    commands.push(`Command: ${UserEconomyCmds.CREATE_WALLET}   |   Arguments: none`);
    message.reply(commands);
  }
}
