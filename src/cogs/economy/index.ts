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

        this.Wallet.updateBalance(userId, parseInt(args[EconomySubCmds.AMOUNT]), false)
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

  //FIXME: convert args[stock,price] to ints
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

  getPossessionsCommand(message: Message) {
    this.Possession.getPossessions(parseInt(message.author.id))
      .then((possessions) => {
        let data: string[] = [];

        data.push("~~ Possessions List ~~");
        possessions.forEach((possession) => {
          const instance = `Item: ${possession.itemName} | Stock: ${possession.stock}`;
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

        data.push("~~~ Guild Merchandise List ~~~");
        allItems.forEach((item) => {
          const instance = `Item: ${item.name} | Stock: ${item.stock} | Price: ${item.price}`;
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

  listWalletCommand(message: Message) {
    if (hasAdminPermissions(message.member)) {
      const subCmds: [] = [];
      const args = parseForArguments(message, true, subCmds);
      if (argumentsFulfilled(args, subCmds, true)) {
        const userId = (args["member"] && args["member"].user.id) || "0";

        let data: string[] = [];
        this.Wallet.findOrCreate(userId, true).then((wallet) => {
          data.push("~~~ Wallet Summary ~~~");
          data.push(`Balance: ${wallet.balance}`);
          wallet.Possession.forEach((possession) => {
            const instance = `Item: ${possession.itemName} | Stock: ${possession.stock} `;
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
}
