import { Injectable } from "@nestjs/common";
import { OrderStatus, Prisma } from "@prisma/client";

import { PrismaService } from "../../../prisma/prisma.service";

type DbClient = PrismaService | Prisma.TransactionClient;

@Injectable()
export class TablesRepository {
  constructor(private readonly prisma: PrismaService) {}

  listTables() {
    return this.prisma.diningTable.findMany({
      include: {
        orders: {
          where: {
            status: {
              in: [
                OrderStatus.OPEN,
                OrderStatus.SUBMITTED,
                OrderStatus.IN_PREPARATION,
                OrderStatus.READY,
                OrderStatus.DELIVERED
              ]
            }
          },
          orderBy: {
            createdAt: "desc"
          },
          take: 1,
          include: {
            items: true
          }
        }
      },
      orderBy: [{ area: "asc" }, { name: "asc" }]
    });
  }

  findTable(id: string) {
    return this.prisma.diningTable.findUnique({
      where: { id }
    });
  }

  findOrder(id: string) {
    return this.prisma.order.findUnique({
      where: { id }
    });
  }

  updateTable(client: DbClient, id: string, data: Prisma.DiningTableUpdateInput) {
    return client.diningTable.update({
      where: { id },
      data
    });
  }

  async transaction<T>(callback: (tx: Prisma.TransactionClient) => Promise<T>) {
    return this.prisma.$transaction((tx) => callback(tx));
  }

  updateOrder(client: DbClient, id: string, data: Prisma.OrderUpdateInput) {
    return client.order.update({
      where: { id },
      data
    });
  }
}
