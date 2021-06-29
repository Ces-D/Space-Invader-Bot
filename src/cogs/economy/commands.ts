// ("$deposit amount=10 @ces");
export const MISSING_ARGUMENTS_ERROR =
  "You are missing arguments. Try this format '$command subCommand=<value> <mention>'";

export enum UserEconomyCmds {
  BALANCE = "balance", // check their balance
  POSSESSIONS = "possessions", // check their possessions
  MERCHANDISE = "merchandise", // check the guilds purchasable merchandise
  PURCHASE = "purchase", // purchase merchandise from bot or member //TODO
}

export enum AdminEconomyCmds {
  CREATE = "create", // create new guild item
  DEPOSIT = "deposit", // deposit funds for a member
  WITHDRAW = "withdraw", // withdraw funds from a member
  REMOVE = "remove", // remove possessions from a member //TODO
  LIST = "list", // list economy information about a member //TODO
}

export enum EconomySubCmds {
  //MEMBER
  ITEM = "item",
  STOCK = "stock",
  PRICE = "price",
  AMOUNT = "amount",
}
