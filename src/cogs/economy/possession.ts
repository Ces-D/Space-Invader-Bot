import Item from "./item";
import Wallet from "./wallet";

export default class Possession {
    name: string;
    stock: number;

    constructor(item: Item) {
        this.name = item.name;
        this.stock = 1;
    }

    reduceStock(amount: number) {
        this.stock -= amount;
    }

    increaseStock(amount: number) {
        this.stock += amount;
    }

    static sellToMember(
        price: number,
        possession: Possession,
        owner: Wallet,
        buyer: Wallet
    ) {
        if (buyer.getBalanceInt() > price) {
            buyer.transferFundsTo(owner, price);
            possession.reduceStock(1);
            buyer.addPossession(possession);
        }
    }

    static purchaseFromBot(price: number, item: Item, wallet: Wallet): Possession {
        if (wallet.getBalanceInt() > price) {
            wallet.withdrawFunds(price);
            item.decreaseStock(1);
            return new Possession(item);
        }
        throw new Error(
            `You do not have enough funds to purchase ${item.name}: ${item.getCost()}`
        );
    }
}
