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
import { EconomySubCmds, MISSING_ARGUMENTS_ERROR } from "./commands";
import { embedTable } from "../../core/utils/embeds";

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
    const subCmds: [] = [];
    const args = parseForArguments(message, true, subCmds);
    if (argumentsFulfilled(args, subCmds, true)) {
      const discordId = (args["member"] && parseInt(args["member"].id)) || 0; //FIXME

      this.Wallet.create(discordId, message.author.username)
        .then((wallet) => {
          message.reply(
            `Congrats. You can now purchase items using $merchandise command. You balance is ${wallet.balance} Schmeckle(s)`
          );
        })
        .catch((error) => {
          message.reply(error);
        });
    }
  } // FIXME: somehow I am missing arguments

  balanceCommand(message: Message) {
    this.Wallet.get(parseInt(message.author.id))
      .then((w) => {
        message.reply(`You have ${w.balance} Schmeckle(s)`);
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
        const discordId = (args["member"] && parseInt(args["member"].id)) || 0; // FIXME: This should not throw error. RN it might

        this.Wallet.updateBalance(discordId, args[EconomySubCmds.AMOUNT], false)
          .then((updatedAccount) => {
            message.reply(
              `The transfer was complete. ${updatedAccount.userTag}'s balance is now ${updatedAccount.balance} Schmeckle(s)`
            );
          })
          .catch((error) => {
            message.reply(error);
          });
      } else {
        message.reply(MISSING_ARGUMENTS_ERROR);
      }
    }
    return; // ignore msg
  }

  //TODO: test this
  withdrawCommand(message: Message) {
    if (hasAdminPermissions(message.member)) {
      const subCmds = [EconomySubCmds.AMOUNT];
      const args = parseForArguments(message, true, subCmds);
      if (argumentsFulfilled(args, subCmds, true)) {
        const discordId = (args["member"] && parseInt(args["member"].id)) || 0; // FIXME: This should not throw error. RN it might

        this.Wallet.updateBalance(discordId, args[EconomySubCmds.AMOUNT], true)
          .then((updatedAccount) => {
            message.reply(
              `The transfer was complete. ${updatedAccount.userTag}'s balance is now ${updatedAccount.balance} Schmeckle(s)`
            );
          })
          .catch((error) => {
            message.reply(error);
          });
      } else {
        message.reply(MISSING_ARGUMENTS_ERROR);
      }
    }
    return; // ignore msg
  }

  //TODO: test this
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
              `Item: ${newItem.name} is available at ${newItem.price} Schmeckle(s). Only ${newItem.stock} are available`
            );
          })
          .catch((error) => {
            message.reply(error);
          });
      } else {
        message.reply(MISSING_ARGUMENTS_ERROR);
      }
    }
    return; // ignore msg
  }

  //TODO: test this
  getPossessionsCommand(message: Message) {
    this.Possession.getPossessions(parseInt(message.author.id))
      .then((possessions) => {
        let data: string[][] = [];
        possessions.forEach((possession) => {
          const instance = [possession.itemName, possession.stock.toString()];
          data.push(instance);
        });
        const embeddedItem = embedTable(
          data,
          "Dark Grey",
          ["Name", "Stock"],
          "Your Possessions"
        );
        message.reply(embeddedItem);
      })
      .catch((error) => {
        message.reply(error);
      });
  }

  //TODO: test this
  getMerchandiseCommand(message: Message) {
    this.Item.getAll()
      .then((allItems) => {
        let data: string[][] = [];
        allItems.forEach((item) => {
          const instance = [item.name, item.stock.toString(), item.price.toString()];
          data.push(instance);
        });
        const embeddedItem = embedTable(
          data,
          "DARK_GOLD",
          ["Name", "Stock", "Price"],
          "Merchandise Available"
        );

        message.reply(embeddedItem);
      })
      .catch((error) => {
        message.reply(error);
      });
  } //FIXME the embeds are fucked up

  removePossessionCommand(message: Message) {
    if (hasAdminPermissions(message.member)) {
      const subCmds = [EconomySubCmds.ITEM, EconomySubCmds.AMOUNT];
      const args = parseForArguments(message, true, subCmds);
      if (argumentsFulfilled(args, subCmds, true)) {
        const discordId = (args["member"] && parseInt(args["member"].id)) || 0; //FIXME

        this.Possession.updateStock(
          args[EconomySubCmds.ITEM],
          discordId,
          args[EconomySubCmds.AMOUNT],
          true
        )
          .then((possession) => {
            message.reply(
              `Reduced the stock of ${possession.itemName} to ${possession.stock}`
            );
          })
          .catch((error) => {
            message.reply(error);
          });
      }
    }
    return; //ignore msg
  }

  // TODO: test this
  listWalletCommand(message: Message) {
    if (hasAdminPermissions(message.member)) {
      const subCmds: [] = [];
      const args = parseForArguments(message, true, subCmds);
      if (argumentsFulfilled(args, subCmds, true)) {
        const discordId = (args["member"] && parseInt(args["member"].id)) || 0; // FIXME: This should not throw error. RN it might

        let possessionData: string[][] = [];
        this.Wallet.getComplete(discordId).then((wallet) => {
          wallet.Possession.forEach((possession) => {
            const instance = [possession.itemName, possession.stock.toString()];
            possessionData.push(instance);
          });

          const embeddedItem = embedTable(
            possessionData,
            "RANDOM",
            ["Name", "Stock"],
            `${wallet.userTag} Possession(s)`
          );

          message.reply(
            `${wallet.userTag} has a balance of ${wallet.balance} Schmeckle(s)\n${embeddedItem}`
          );
        });
      } else {
        message.reply(MISSING_ARGUMENTS_ERROR);
      }
    }
    return; // ignore msg
  }
}
