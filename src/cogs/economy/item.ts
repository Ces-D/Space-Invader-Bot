import { PrismaClient } from ".prisma/client";
import { Role } from "discord.js";

export default class Item {
  readonly prisma: PrismaClient;
  
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }
}
