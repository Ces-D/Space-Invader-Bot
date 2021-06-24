import { PrismaClient } from ".prisma/client";

export default class Item {
  readonly prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  create(name: string, price: number, stock: number) {
    const existingItem = this.exists(name)
    this.prisma.item.create;
  }

  private exists(name: string) {
    const existingItem = this.prisma.item.findFirst({
      where: {
        name: name,
      },
    });
    if (existingItem) {
      return existingItem;
    }
    return false;
  }
}
