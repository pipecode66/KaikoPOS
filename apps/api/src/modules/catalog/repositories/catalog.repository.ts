import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";

import { PrismaService } from "../../../prisma/prisma.service";

type DbClient = PrismaService | Prisma.TransactionClient;

@Injectable()
export class CatalogRepository {
  constructor(private readonly prisma: PrismaService) {}

  listCategories() {
    return this.prisma.category.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }]
    });
  }

  listProducts() {
    return this.prisma.product.findMany({
      include: {
        category: true,
        recipes: {
          include: {
            ingredient: true
          }
        }
      },
      orderBy: {
        name: "asc"
      }
    });
  }

  createCategory(data: Prisma.CategoryCreateInput) {
    return this.prisma.category.create({ data });
  }

  findIngredientsByIds(ids: string[]) {
    return this.prisma.ingredient.findMany({
      where: {
        id: {
          in: ids
        }
      }
    });
  }

  async transaction<T>(callback: (tx: Prisma.TransactionClient) => Promise<T>) {
    return this.prisma.$transaction((tx) => callback(tx));
  }

  createProduct(client: DbClient, data: Prisma.ProductCreateInput) {
    return client.product.create({
      data,
      include: {
        category: true,
        recipes: {
          include: {
            ingredient: true
          }
        }
      }
    });
  }

  updateProduct(client: DbClient, id: string, data: Prisma.ProductUpdateInput) {
    return client.product.update({
      where: { id },
      data,
      include: {
        category: true,
        recipes: {
          include: {
            ingredient: true
          }
        }
      }
    });
  }
}
