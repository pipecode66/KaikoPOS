import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";

import { PrismaService } from "../../../prisma/prisma.service";

type DbClient = PrismaService | Prisma.TransactionClient;

@Injectable()
export class InventoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  listIngredients() {
    return this.prisma.ingredient.findMany({
      orderBy: {
        name: "asc"
      }
    });
  }

  async listLowStock() {
    const ingredients = await this.prisma.ingredient.findMany({
      where: {
        isActive: true
      },
      orderBy: {
        currentStock: "asc"
      }
    });

    return ingredients.filter((ingredient) => Number(ingredient.currentStock) <= Number(ingredient.minimumStock));
  }

  listMovements(limit = 50) {
    return this.prisma.ingredientStockMovement.findMany({
      take: limit,
      include: {
        ingredient: true,
        createdBy: true
      },
      orderBy: {
        createdAt: "desc"
      }
    });
  }

  createIngredient(data: Prisma.IngredientCreateInput) {
    return this.prisma.ingredient.create({ data });
  }

  findIngredient(id: string) {
    return this.prisma.ingredient.findUnique({
      where: { id }
    });
  }

  async transaction<T>(callback: (tx: Prisma.TransactionClient) => Promise<T>) {
    return this.prisma.$transaction((tx) => callback(tx));
  }

  updateIngredient(client: DbClient, id: string, data: Prisma.IngredientUpdateInput) {
    return client.ingredient.update({
      where: { id },
      data
    });
  }

  createMovement(client: DbClient, data: Prisma.IngredientStockMovementCreateInput) {
    return client.ingredientStockMovement.create({ data });
  }
}
