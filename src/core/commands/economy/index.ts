import { Client } from "discord.js";

export enum EconomyCommand {
    BALANCE = " balance",
    TRANSFER = "transfer",
    PURCHASE = "purchase",
    AVAILABLE = "available",
    SLOTS = "slots",
}

export default class Economy{
    readonly client:Client
    constructor(client:Client){
        
    }
}