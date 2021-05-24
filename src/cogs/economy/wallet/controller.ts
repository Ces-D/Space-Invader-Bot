import { PrismaClient } from ".prisma/client";
import Wallet from "./index";

export default class WalletController{
  readonly prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }
}
