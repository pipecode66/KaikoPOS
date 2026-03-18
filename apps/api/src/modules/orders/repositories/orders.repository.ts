import { Injectable } from "@nestjs/common";
import { OrderStatus, Prisma } from "@prisma/client";

import { PrismaService } from "../../../prisma/prisma.service";

type DbClient = PrismaService | Prisma.TransactionClient;

@Injectable()
export class OrdersRepository {
  constructor(private readonly prisma: PrismaService) {}

  listActive() {
    return this.prisma.order.findMany({
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
      include: {
        items: {
          include: {
            product: true
          }
        },
        table: true,
        kitchenTicket: true,
        payments: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });
  }

  findById(id: string) {
    return this.prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: {
              include: {
                recipes: {
                  include: {
                    ingredient: true
                  }
                }
              }
            }
          }
        },
        table: true,
        kitchenTicket: true,
        payments: true,
        register: true
      }
    });
  }

  findProducts(ids: string[]) {
    return this.prisma.product.findMany({
      where: {
        id: {
          in: ids
        },
        isAvailable: true
      },
      include: {
        recipes: {
          include: {
            ingredient: true
          }
        }
      }
    });
  }

  findRegister(id: string) {
    return this.prisma.cashRegister.findUnique({
      where: { id }
    });
  }

  async transaction<T>(callback: (tx: Prisma.TransactionClient) => Promise<T>) {
    return this.prisma.$transaction((tx) => callback(tx));
  }

  createOrder(client: DbClient, data: Prisma.OrderCreateInput) {
    return client.order.create({
      data,
      include: {
        items: {
          include: {
            product: true
          }
        },
        kitchenTicket: true,
        table: true
      }
    });
  }

  updateOrder(client: DbClient, id: string, data: Prisma.OrderUpdateInput) {
    return client.order.update({
      where: { id },
      data,
      include: {
        items: {
          include: {
            product: true
          }
        },
        kitchenTicket: true,
        table: true,
        payments: true
      }
    });
  }

  deleteItems(client: DbClient, orderId: string) {
    return client.orderItem.deleteMany({
      where: {
        orderId
      }
    });
  }

  createItems(client: DbClient, data: Prisma.OrderItemCreateManyInput[]) {
    return client.orderItem.createMany({
      data
    });
  }
}
