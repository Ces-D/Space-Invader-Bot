import { Client, Message, User } from "discord.js";
import Wallet from "./wallet";
import Item from "./item";

export const enum EconomyCommand {
    BALANCE = " balance",
    TRANSFER = "transfer",
    PURCHASE = "purchase",
    AVAILABLE = "available",
}

export default class Economy {
    readonly client: Client;
    protected wallets: Wallet[] | [];
    protected items: Item[] | [];

    constructor(client: Client) {
        this.client = client;
        this.wallets = [];
        this.items = [];
    }

    handleBalanceCommand(author: User) {
        return;
    }

    static createEconomy(client: Client) {
        return new Economy(client);
    }
}