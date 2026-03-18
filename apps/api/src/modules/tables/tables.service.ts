import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { AuditAction, OrderStatus, TableStatus } from "@prisma/client";

import { AuditService } from "../audit/audit.service";
import { PrismaService } from "../../prisma/prisma.service";
import { RequestUser } from "../../common/decorators/current-user.decorator";
import { MoveOrderDto } from "./dto/move-order.dto";
import { UpdateTableStatusDto } from "./dto/update-table-status.dto";
import { TablesRepository } from "./repositories/tables.repository";

@Injectable()
export class TablesService {
  constructor(
    private readonly tablesRepository: TablesRepository,
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService
  ) {}

  listTables() {
    return this.tablesRepository.listTables();
  }

  async updateStatus(id: string, dto: UpdateTableStatusDto, currentUser: RequestUser) {
    try {
      const table = await this.tablesRepository.updateTable(this.prisma, id, {
        status: dto.status
      });

      await this.auditService.log({
        action: AuditAction.UPDATE,
        entityType: "table",
        entityId: id,
        performedById: currentUser.sub,
        metadata: { status: dto.status }
      });

      return table;
    } catch {
      throw new NotFoundException("Table not found");
    }
  }

  async moveOrder(dto: MoveOrderDto, currentUser: RequestUser) {
    const [order, destinationTable] = await Promise.all([
      this.tablesRepository.findOrder(dto.orderId),
      this.tablesRepository.findTable(dto.toTableId)
    ]);

    if (!order) {
      throw new NotFoundException("Order not found");
    }

    if (!destinationTable) {
      throw new NotFoundException("Destination table not found");
    }

    if (!order.tableId) {
      throw new BadRequestException("Only table orders can be moved");
    }

    if (order.status === OrderStatus.PAID || order.status === OrderStatus.CANCELLED) {
      throw new BadRequestException("Closed orders cannot be moved");
    }

    const sourceTableId = order.tableId;

    const result = await this.tablesRepository.transaction(async (tx) => {
      const movedOrder = await this.tablesRepository.updateOrder(tx, order.id, {
        table: {
          connect: {
            id: dto.toTableId
          }
        }
      });

      await this.tablesRepository.updateTable(tx, dto.toTableId, {
        status: TableStatus.OCCUPIED
      });

      await this.tablesRepository.updateTable(tx, sourceTableId, {
        status: TableStatus.AVAILABLE
      });

      return movedOrder;
    });

    await this.auditService.log({
      action: AuditAction.UPDATE,
      entityType: "table_move",
      entityId: dto.orderId,
      performedById: currentUser.sub,
      metadata: {
        fromTableId: sourceTableId,
        toTableId: dto.toTableId
      }
    });

    return result;
  }
}
