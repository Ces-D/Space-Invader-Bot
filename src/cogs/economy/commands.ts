// ("$deposit amount=10 @ces");

export const MISSING_ARGUMENTS_ERROR = (format: string) => {
  return ["You are missing arguments", `Try this: !${format}`];
};
export const REQUEST_ERROR = "Error fulfilling the request. Try again";

export const GET_BALANCE_SUCCESS = (balance: number) => {
  return `Your balance is ${balance} ${CURRENCY}`;
};

export const UPDATE_BALANCE_SUCCESS = (balance: number, withdraw: boolean) => {
  return [
    `The ${withdraw ? "withdrawal" : "deposit"} was successful!`,
    `The new balance is ${balance} ${CURRENCY}`,
  ];
};

export const CREATE_WALLET_SUCCESS = (balance: number) => {
  return [
    `Congrats! You can now purchase items. Use the command !${UserEconomyCmds.MERCHANDISE} to see what is available.`,
    `Your balance is ${balance} ${CURRENCY}`,
  ];
};

export const CREATE_ITEM_SUCCESS = (name: string, price: number, stock: number) => {
  return [
    `${name} was created successfully`,
    `There are ${stock} available at ${price} ${CURRENCY} each`,
  ];
};

export const REMOVE_POSSESSION_SUCCESS = (name: string, stock: number) => {
  return [`${name} were successfully removed.`, `They now own ${stock}`];
};

const CURRENCY = "Schmeckle(s)";

export enum UserEconomyCmds {
  BALANCE = "balance", // check their balance
  POSSESSIONS = "possessions", // check their possessions
  MERCHANDISE = "merchandise", // check the guilds purchasable merchandise
  PURCHASE = "purchase", // purchase merchandise from bot or member //TODO
  CREATE_WALLET = "create", // create your wallet with starting
  LIST = "economy-ls", // list all the economy commands //TODO
}

export enum AdminEconomyCmds {
  CREATE = "create-item", // create new guild item
  DEPOSIT = "deposit", // deposit funds for a member
  WITHDRAW = "withdraw", // withdraw funds from a member
  REMOVE = "remove", // remove possessions from a member
  SUMMARY = "summary", // summarize economy information about a member
}

export enum EconomySubCmds {
  //MEMBER
  ITEM = "item",
  STOCK = "stock",
  PRICE = "price",
  AMOUNT = "amount",
}
