import { GuildMember } from "discord.js";

export const EconomyCommands = {
  /**
   * Commands that can be called by any user status of a guild. Messages go into any channel
   */
  User: {
    BALANCE: { primary: "balance" }, // check their balance
    POSSESSIONS: { primary: "possessions" }, // check their possessions
    MERCHANDISE: { primary: "merchandise" }, // check the guilds purchasable merchandise
    PURCHASE: { primary: "purchase", secondary: ["-item", "-amount"] }, // purchase merchandise from bot or member // member (default bot), quantity (default 1),
  },
  /**
   * Commands that can be called by admin status users of a guild. Messages go into designated admin specific channel
   * in order to act as commands.
   */
  Admin: {
    CREATE: { primary: "create", secondary: ["-name", "-stock", "-price"] }, // create new guild item // name, stock, price
    DEPOSIT: { primary: "deposit", secondary: ["-name", "-amount"] }, // deposit funds for a member // name, amount
    WITHDRAW: { primary: "withdraw", secondary: ["-name", "-amount"] }, // withdraw funds from a member // name, amount
    REMOVE: { primary: "remove", secondary: ["-name", "-item", "-amount"] }, // remove possessions from a member // name, item name, amount
    LIST: { primary: "list", secondary: ["-name"] }, // list economy information about a member // name
  },
};

("$deposit amount=10 @ces");

export enum UserEconomyCmds {
  BALANCE = "balance", // check their balance
  POSSESSIONS = "possessions", // check their possessions
  MERCHANDISE = "merchandise", // check the guilds purchasable merchandise
  PURCHASE = "purchase", // purchase merchandise from bot or member
}

export enum AdminEconomyCmds {
  CREATE = "create", // create new guild item
  DEPOSIT = "deposit", // deposit funds for a member
  WITHDRAW = "withdraw", // withdraw funds from a member
  REMOVE = "remove", // remove possessions from a member
  LIST = "list", // list economy information about a member
}

export enum EconomySubCmds {
  //MEMBER
  ITEM = "item",
  STOCK = "stock",
  PRICE = "price",
  AMOUNT = "amount",
}