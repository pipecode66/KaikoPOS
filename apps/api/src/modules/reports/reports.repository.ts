import { Injectable } from "@nestjs/common";
import { OrderStatus, Prisma } from "@prisma/client";

import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class ReportsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findPaidOrders(dateRange?: Prisma.DateTimeNullableFilter) {
    return this.prisma.order.findMany({
      where: {
        status: OrderStatus.PAID,
        paidAt: dateRange
      },
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
        payments: true
      }
    });
  }

  groupPayments(dateRange?: Prisma.DateTimeFilter) {
    return this.prisma.payment.groupBy({
      by: ["method"],
      where: {
        createdAt: dateRange
      },
      _sum: {
        amount: true
      }
    });
  }

  listCashMovements(dateRange?: Prisma.DateTimeFilter) {
    return this.prisma.cashMovement.findMany({
      where: {
        createdAt: dateRange
      },
      include: {
        createdBy: true,
        cashRegister: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });
  }
}
