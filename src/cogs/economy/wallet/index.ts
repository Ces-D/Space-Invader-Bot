import { GuildMember } from "discord.js";
import Possession from "../possession";

//TODO: figure out how to make rollbacks in case any act fails. IE Possession transfer

export default class Wallet {
    readonly member: GuildMember;
    protected balance;
    possessions: Possession[];

    constructor(member: GuildMember) {
        this.member = member;
        this.balance = 0;
    }

    static createWallet(member: GuildMember): Wallet {
        return new Wallet(member);
    }

    getBalance(): string {
        return `${this.balance} Schmeckle(s)`;
    }

    getBalanceInt(): number {
        return this.balance;
    }

    withdrawFunds(amount: number) {
        this.balance -= amount;
    }

    depositFunds(depositAmount: number) {
        this.balance += depositAmount;
    }

    transferFundsTo(transferringTo: Wallet, transferAmount: number) {
        if (transferAmount > this.getBalanceInt()) {
            throw new Error(
                `Transfer amount: ${transferAmount} more than balance of ${this.getBalance()}`
            );
        }
        try {
            this.withdrawFunds(transferAmount); //
            transferringTo.depositFunds(transferAmount);
        } catch (error) {
            throw new Error(
                `Error transferring to ${transferringTo.member.displayName}'s Wallet`
            );
        }
    }

    addPossession(possession: Possession) {
        this.possessions.push(possession);
        //TODO: filter check for possession.name already existing in the array
    }
}
