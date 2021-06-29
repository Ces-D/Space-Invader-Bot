import { PrismaClient } from "@prisma/client";
import { Client } from "discord.js";

export default class Item {
  readonly client: Client;
  readonly prisma: PrismaClient;

  constructor(client: Client, prisma: PrismaClient) {
    this.client = client;
    this.prisma = prisma;
  }

  create(name: string, price: number, stock: number) {
    const newItem = this.prisma.item
      .create({
        data: {
          name: name,
          price: price,
          stock: stock,
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
      .findFirst({
        where: {
          name: name,
        },
      })
      .catch((error) => {
        console.error("Get Item Error\n\n", error);
        throw "Could not get the Item";
      });
    return item;
  }
}
