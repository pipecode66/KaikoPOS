import { Injectable, NotFoundException } from "@nestjs/common";
import { AuditAction, KitchenTicketStatus, OrderStatus } from "@prisma/client";

import { AuditService } from "../audit/audit.service";
import { RequestUser } from "../../common/decorators/current-user.decorator";
import { UpdateKitchenTicketStatusDto } from "./dto/update-kitchen-ticket-status.dto";
import { KitchenGateway } from "./kitchen.gateway";
import { KitchenRepository } from "./repositories/kitchen.repository";

@Injectable()
export class KitchenService {
  constructor(
    private readonly kitchenRepository: KitchenRepository,
    private readonly kitchenGateway: KitchenGateway,
    private readonly auditService: AuditService
  ) {}

  listTickets(status?: KitchenTicketStatus) {
    return this.kitchenRepository.listTickets(status);
  }

  async updateStatus(orderId: string, dto: UpdateKitchenTicketStatusDto, currentUser: RequestUser) {
    const ticket = await this.kitchenRepository.findTicketByOrderId(orderId);
    if (!ticket) {
      throw new NotFoundException("Kitchen ticket not found");
    }

    const timestamps = {
      startedAt: dto.status === KitchenTicketStatus.PREPARING ? new Date() : undefined,
      readyAt: dto.status === KitchenTicketStatus.READY ? new Date() : undefined,
      deliveredAt: dto.status === KitchenTicketStatus.DELIVERED ? new Date() : undefined
    };

    const updatedTicket = await this.kitchenRepository.updateTicket(orderId, {
      status: dto.status,
      ...timestamps
    });

    const mappedStatus =
      dto.status === KitchenTicketStatus.PREPARING
        ? OrderStatus.IN_PREPARATION
        : dto.status === KitchenTicketStatus.READY
          ? OrderStatus.READY
          : OrderStatus.DELIVERED;

    await this.kitchenRepository.updateOrderStatus(orderId, mappedStatus);

    this.kitchenGateway.emitTicketUpdated({
      orderId,
      status: dto.status
    });

    await this.auditService.log({
      action: AuditAction.UPDATE_KITCHEN_STATUS,
      entityType: "kitchen_ticket",
      entityId: ticket.id,
      performedById: currentUser.sub,
      metadata: { status: dto.status }
    });

    return updatedTicket;
  }
}
