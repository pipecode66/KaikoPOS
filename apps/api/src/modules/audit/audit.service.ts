import { AuditAction, Prisma } from "@prisma/client";
import { Injectable } from "@nestjs/common";

import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  async log(params: {
    action: AuditAction;
    entityType: string;
    entityId?: string;
    performedById?: string;
    metadata?: Record<string, unknown>;
  }) {
    return this.prisma.auditLog.create({
      data: {
        action: params.action,
        entityType: params.entityType,
        entityId: params.entityId,
        performedById: params.performedById,
        metadata: params.metadata as Prisma.InputJsonValue | undefined
      }
    });
  }
}
