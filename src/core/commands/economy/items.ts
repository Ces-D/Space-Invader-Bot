import { Role } from "discord.js";

//TODO: make a controller class handling access to the object

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

    decreaseStock(amount: number) {}

    increaseStock(amount: number) {}

    adjustCost(amount: number) {}

    adjustPurchasableBy(allowTo: Role) {}
}
