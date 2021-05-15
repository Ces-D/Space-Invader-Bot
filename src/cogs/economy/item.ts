import { Role } from "discord.js";

//TODO: make a controller class handling access to the object

/**
 * Handle Creation of an Item for the entire server
 */
export default class Item {
    readonly name: string;
    cost: number;
    stock: number;
    purchasableBy: Role;

    constructor(name: string, cost: number, stock: number, purchasableBy?: Role) {
        this.name = name;
        this.cost = cost;
        this.stock = stock;
        this.purchasableBy = purchasableBy;
    }

    decreaseStock(amount: number) {
        this.stock -= amount;
    }

    increaseStock(amount: number) {
        this.stock += amount;
    }

    getCost():string{
        return `${this.cost} Schmeckle(s)`
    }

    adjustCost(amount: number) {
        this.cost = amount;
    }

    adjustPurchasableBy(allowTo: Role) {}
}

