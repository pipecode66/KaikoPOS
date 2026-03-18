import { Injectable, NotFoundException } from "@nestjs/common";
import { AuditAction, StockMovementType } from "@prisma/client";

import { AuditService } from "../audit/audit.service";
import { RequestUser } from "../../common/decorators/current-user.decorator";
import { CreateIngredientDto } from "./dto/create-ingredient.dto";
import { StockAdjustmentDto } from "./dto/stock-adjustment.dto";
import { InventoryRepository } from "./repositories/inventory.repository";

@Injectable()
export class InventoryService {
  constructor(
    private readonly inventoryRepository: InventoryRepository,
    private readonly auditService: AuditService
  ) {}

  listIngredients() {
    return this.inventoryRepository.listIngredients();
  }

  listLowStock() {
    return this.inventoryRepository.listLowStock();
  }

  listMovements(limit?: number) {
    return this.inventoryRepository.listMovements(limit);
  }

  async createIngredient(dto: CreateIngredientDto, currentUser: RequestUser) {
    const ingredient = await this.inventoryRepository.createIngredient({
      sku: dto.sku,
      name: dto.name,
      unit: dto.unit,
      currentStock: dto.currentStock,
      minimumStock: dto.minimumStock,
      costPerUnit: dto.costPerUnit,
      isActive: dto.isActive ?? true
    });

    await this.inventoryRepository.transaction(async (tx) => {
      await this.inventoryRepository.createMovement(tx, {
        ingredient: {
          connect: {
            id: ingredient.id
          }
        },
        createdBy: {
          connect: {
            id: currentUser.sub
          }
        },
        type: StockMovementType.PURCHASE,
        quantity: dto.currentStock,
        balanceAfter: dto.currentStock,
        note: "Initial stock load",
        referenceType: "INGREDIENT_CREATE"
      });
    });

    await this.auditService.log({
      action: AuditAction.CREATE,
      entityType: "ingredient",
      entityId: ingredient.id,
      performedById: currentUser.sub
    });

    return ingredient;
  }

  async adjustStock(id: string, dto: StockAdjustmentDto, currentUser: RequestUser) {
    const ingredient = await this.inventoryRepository.findIngredient(id);
    if (!ingredient) {
      throw new NotFoundException("Ingredient not found");
    }

    const balanceAfter = Number(ingredient.currentStock) + dto.quantity;

    const updated = await this.inventoryRepository.transaction(async (tx) => {
      const updatedIngredient = await this.inventoryRepository.updateIngredient(tx, id, {
        currentStock: balanceAfter
      });

      await this.inventoryRepository.createMovement(tx, {
        ingredient: {
          connect: {
            id
          }
        },
        createdBy: {
          connect: {
            id: currentUser.sub
          }
        },
        type: dto.type,
        quantity: dto.quantity,
        balanceAfter,
        note: dto.note,
        referenceId: dto.referenceId,
        referenceType: "MANUAL_ADJUSTMENT"
      });

      return updatedIngredient;
    });

    await this.auditService.log({
      action: AuditAction.ADJUST_STOCK,
      entityType: "ingredient",
      entityId: id,
      performedById: currentUser.sub,
      metadata: { type: dto.type, quantity: dto.quantity }
    });

    return updated;
  }
}
