import { Injectable } from "@nestjs/common";
import { KitchenTicketStatus } from "@prisma/client";

import { PrismaService } from "../../../prisma/prisma.service";

@Injectable()
export class KitchenRepository {
  constructor(private readonly prisma: PrismaService) {}

  listTickets(status?: KitchenTicketStatus) {
    return this.prisma.kitchenTicket.findMany({
      where: status ? { status } : undefined,
      include: {
        order: {
          include: {
            items: {
              include: {
                product: true
              }
            },
            table: true
          }
        }
      },
      orderBy: {
        sentAt: "asc"
      }
    });
  }

  findTicketByOrderId(orderId: string) {
    return this.prisma.kitchenTicket.findUnique({
      where: { orderId },
      include: {
        order: {
          include: {
            items: {
              include: {
                product: true
              }
            },
            table: true
          }
        }
      }
    });
  }

  updateTicket(orderId: string, data: {
    status: KitchenTicketStatus;
    startedAt?: Date | null;
    readyAt?: Date | null;
    deliveredAt?: Date | null;
  }) {
    return this.prisma.kitchenTicket.update({
      where: { orderId },
      data,
      include: {
        order: {
          include: {
            items: {
              include: {
                product: true
              }
            },
            table: true
          }
        }
      }
    });
  }

  updateOrderStatus(orderId: string, status: "IN_PREPARATION" | "READY" | "DELIVERED") {
    return this.prisma.order.update({
      where: { id: orderId },
      data: { status }
    });
  }
}
