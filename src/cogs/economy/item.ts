import { PrismaClient } from "@prisma/client";
import { Client } from "discord.js";

export default class Item {
  readonly client: Client;
  readonly prisma: PrismaClient;

  constructor(client: Client, prisma: PrismaClient) {
    this.client = client;
    this.prisma = prisma;
  }

  create(name: string, price: string, stock: string) {
    const newItem = this.prisma.item
      .create({
        data: {
          name: name,
          price: parseInt(price),
          stock: parseInt(stock),
        },
      })
      .catch((error) => {
        console.error("Create Item Error\n\n", error);
        throw `Could not create ${name}. Try again`;
      });
    return newItem;
  }

  getAll() {
    const allItems = this.prisma.item.findMany({ take: 20 }).catch((error) => {
      console.error("Get All Items Error\n\n", error);
      throw "Could not get all the items";
    });
    return allItems;
  }

  get(name: string) {
    const item = this.prisma.item
      .findUnique({
        where: {
          name: name,
        },
        rejectOnNotFound: true,
      })
      .catch((error) => {
        console.error("Get Item Error\n\n", error);
        throw "Could not get the Item";
      });
    return item;
  }

  updateStock(name: string, amount: string, increase: boolean) {
    let updatedItem;
    if (increase) {
      updatedItem = this.prisma.item.update({
        where: { name: name },
        data: {
          stock: { increment: parseInt(amount) },
        },
      });
    } else {
      updatedItem = this.prisma.item.update({
        where: { name: name },
        data: { stock: { decrement: parseInt(amount) } },
      });
    }
    updatedItem.catch((error) => {
      console.error("Update Item Error\n\n", error);
    });
    return updatedItem;
  }
}
