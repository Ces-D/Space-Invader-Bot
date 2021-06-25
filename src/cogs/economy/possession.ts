import { PrismaClient } from "@prisma/client";
import { Client } from "discord.js";

export default class Possession {
  readonly client: Client;
  readonly prisma: PrismaClient;

  constructor(client: Client, prisma: PrismaClient) {
    this.client = client;
    this.prisma = prisma;
  }
}
