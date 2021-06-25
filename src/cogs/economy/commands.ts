export const EconomyCommands = {
  /**
   * Commands that can be called by any user status of a guild. Messages go into any channel
   */
  User: {
    BALANCE: { primary: "balance" }, // check their balance
    POSSESSIONS: { primary: "possessions" }, // check their possessions
    MERCHANDISE: { primary: "merchandise" }, // check the guilds purchasable merchandise
    PURCHASE: { primary: "purchase", secondary: ["-m", "-q"] }, // purchase merchandise from bot or member // member (default bot), quantity (default 1),
  },
  /**
   * Commands that can be called by admin status users of a guild. Messages go into designated admin specific channel
   * in order to act as commands.
   */
  Admin: {
    CREATE: { primary: "create", secondary: ["-n", "-s", "-p"] }, // create new guild item // name, stock, price
    DEPOSIT: { primary: "deposit", secondary: ["-n", "-a"] }, // deposit funds for a member // name, amount
    WITHDRAW: { primary: "withdraw", secondary: ["-n", "-a"] }, // withdraw funds from a member // name, amount
    REMOVE: { primary: "remove", secondary: ["-n", "-i", "-a"] }, // remove possessions from a member // name, item name, amount
    LIST: { primary: "list", secondary: ["-n"] }, // list economy information about a member // name
  },
};
