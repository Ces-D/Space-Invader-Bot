import { GuildMember } from "discord.js";
import Item from "./items";

class WalletItems {
    // If I make a class for the entire items in the wallet then I can make methods similar to the Items class in ./items.ts
}


export default class Wallet {
    readonly author: GuildMember;
    protected balance;
    items: {
        name: string;
        stock: number;
    }[];

    constructor(author: GuildMember) {
        this.author = author;
        this.balance = 0;
    }

    getBalance() {
        return this.balance;
    }
    
    getItems(){
        return this.items
    }

    protected withdrawFunds(amount: number) {
        this.balance -= amount;
    }

    depositFunds(depositAmount: number) {
        this.balance += depositAmount;
    }

    transferFunds(transferringTo: Wallet, transferAmount: number) {
        if (transferAmount > this.getBalance()) {
            throw new Error(
                `Transfer amount: ${transferAmount} more than balance of ${this.getBalance()}`
            );
        }
        try {
            this.withdrawFunds(transferAmount); //
            transferringTo.depositFunds(transferAmount);
        } catch (error) {
            throw new Error(
                `Error transferring to ${transferringTo.author.displayName}'s Wallet`
            );
        }
    }

    isItemOwned(name: string): Boolean {
        if (this.items && this.items.find((obj) => obj.name === name)) {
            return true;
        }
        return false;
    }

    async purchaseItem(item: Item) {
        if (
            item.cost > this.getBalance() &&
            item.purchasableBy.toString() in this.author.roles
        ) {
            throw new Error(
                `Item Cost: ${item.cost} more than balance of ${this.getBalance()}`
            );
        }
        if (this.isItemOwned(item.name)) {
            const index = this.items.findIndex((obj) => {
                obj.name === item.name;
            });
            const previousObj = { ...this.items[index] };
            // Here we are adding to the stock of the obj
            this.items = [
                ...this.items,
                { name: item.name, stock: previousObj.stock + 1 },
            ]; //FIXME: Check to see if this function works
        } else {
            // Here we create a new obj if doesn't exist
            this.items = [...this.items, { name: item.name, stock: 1 }];
        }
    }

    async sellItem(item: Item) {
        if (this.isItemOwned(item.name)){
            const index = this.items.findIndex((obj) => {
                obj.name === item.name;
            });
            const previousObj = { ...this.items[index] };
            // Here we are subtracting from the stock key of obj
            this.items = [
                ...this.items,
                { name: item.name, stock: previousObj.stock - 1 },
            ];
            const currentObj = this.items[index]
            // Here we remove the obj if the stock is 0
            if (currentObj.stock === 0 ){
                this.items.splice(index)
            }
        }
        throw new Error(`Item: ${item.name} is not yours to sell. Buy one first`)
    }
}
