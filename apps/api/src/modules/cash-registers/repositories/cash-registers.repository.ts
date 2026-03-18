import { Injectable } from "@nestjs/common";
import { CashRegisterStatus, Prisma } from "@prisma/client";

import { PrismaService } from "../../../prisma/prisma.service";

type DbClient = PrismaService | Prisma.TransactionClient;

@Injectable()
export class CashRegistersRepository {
  constructor(private readonly prisma: PrismaService) {}

  findActiveByLabel(label?: string) {
    return this.prisma.cashRegister.findFirst({
      where: {
        status: CashRegisterStatus.OPEN,
        ...(label ? { label } : {})
      },
      include: {
        cashMovements: true
      },
      orderBy: {
        openedAt: "desc"
      }
    });
  }

  findById(id: string) {
    return this.prisma.cashRegister.findUnique({
      where: { id },
      include: {
        cashMovements: {
          orderBy: {
            createdAt: "asc"
          }
        },
        payments: true,
        orders: {
          include: {
            payments: true
          }
        }
      }
    });
  }

  async transaction<T>(callback: (tx: Prisma.TransactionClient) => Promise<T>) {
    return this.prisma.$transaction((tx) => callback(tx));
  }

  createRegister(client: DbClient, data: Prisma.CashRegisterCreateInput) {
    return client.cashRegister.create({
      data,
      include: {
        cashMovements: true
      }
    });
  }

  updateRegister(client: DbClient, id: string, data: Prisma.CashRegisterUpdateInput) {
    return client.cashRegister.update({
      where: { id },
      data,
      include: {
        cashMovements: {
          orderBy: {
            createdAt: "asc"
          }
        },
        payments: true,
        orders: true
      }
    });
  }

  createMovement(client: DbClient, data: Prisma.CashMovementCreateInput) {
    return client.cashMovement.create({
      data
    });
  }
}
