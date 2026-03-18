import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { AuditAction } from "@prisma/client";

import { AuditService } from "../audit/audit.service";
import { RequestUser } from "../../common/decorators/current-user.decorator";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { CreateProductDto, ProductRecipeItemDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { CatalogRepository } from "./repositories/catalog.repository";

@Injectable()
export class CatalogService {
  constructor(
    private readonly catalogRepository: CatalogRepository,
    private readonly auditService: AuditService
  ) {}

  listCategories() {
    return this.catalogRepository.listCategories();
  }

  listProducts() {
    return this.catalogRepository.listProducts();
  }

  async createCategory(dto: CreateCategoryDto, currentUser: RequestUser) {
    const category = await this.catalogRepository.createCategory({
      name: dto.name,
      sortOrder: dto.sortOrder ?? 0
    });

    await this.auditService.log({
      action: AuditAction.CREATE,
      entityType: "category",
      entityId: category.id,
      performedById: currentUser.sub,
      metadata: { name: dto.name }
    });

    return category;
  }

  async createProduct(dto: CreateProductDto, currentUser: RequestUser) {
    const estimatedCost = await this.calculateEstimatedCost(dto.recipes ?? []);

    const product = await this.catalogRepository.transaction((tx) =>
      this.catalogRepository.createProduct(tx, {
        sku: dto.sku,
        name: dto.name,
        description: dto.description,
        price: dto.price,
        estimatedCost,
        isAvailable: dto.isAvailable ?? true,
        notesEnabled: dto.notesEnabled ?? true,
        category: {
          connect: {
            id: dto.categoryId
          }
        },
        recipes: dto.recipes?.length
          ? {
              create: dto.recipes.map((recipe) => ({
                ingredient: {
                  connect: {
                    id: recipe.ingredientId
                  }
                },
                quantity: recipe.quantity
              }))
            }
          : undefined
      })
    );

    await this.auditService.log({
      action: AuditAction.CREATE,
      entityType: "product",
      entityId: product.id,
      performedById: currentUser.sub
    });

    return product;
  }

  async updateProduct(id: string, dto: UpdateProductDto, currentUser: RequestUser) {
    const estimatedCost =
      dto.recipes !== undefined ? await this.calculateEstimatedCost(dto.recipes) : undefined;

    try {
      const updated = await this.catalogRepository.transaction((tx) =>
        this.catalogRepository.updateProduct(tx, id, {
          sku: dto.sku,
          name: dto.name,
          description: dto.description,
          price: dto.price,
          estimatedCost,
          isAvailable: dto.isAvailable,
          notesEnabled: dto.notesEnabled,
          category: dto.categoryId
            ? {
                connect: {
                  id: dto.categoryId
                }
              }
            : undefined,
          recipes:
            dto.recipes !== undefined
              ? {
                  deleteMany: {},
                  create: dto.recipes.map((recipe) => ({
                    ingredient: {
                      connect: {
                        id: recipe.ingredientId
                      }
                    },
                    quantity: recipe.quantity
                  }))
                }
              : undefined
        })
      );

      await this.auditService.log({
        action: AuditAction.UPDATE,
        entityType: "product",
        entityId: id,
        performedById: currentUser.sub
      });

      return updated;
    } catch {
      throw new NotFoundException("Product not found");
    }
  }

  async toggleAvailability(id: string, isAvailable: boolean, currentUser: RequestUser) {
    try {
      const updated = await this.catalogRepository.transaction((tx) =>
        this.catalogRepository.updateProduct(tx, id, { isAvailable })
      );

      await this.auditService.log({
        action: AuditAction.UPDATE,
        entityType: "product",
        entityId: id,
        performedById: currentUser.sub,
        metadata: { isAvailable }
      });

      return updated;
    } catch {
      throw new NotFoundException("Product not found");
    }
  }

  private async calculateEstimatedCost(recipes: ProductRecipeItemDto[]) {
    if (!recipes.length) {
      return 0;
    }

    const ingredients = await this.catalogRepository.findIngredientsByIds(
      recipes.map((recipe) => recipe.ingredientId)
    );
    const ingredientMap = new Map(ingredients.map((ingredient) => [ingredient.id, ingredient]));

    return recipes.reduce((total, recipe) => {
      const ingredient = ingredientMap.get(recipe.ingredientId);
      if (!ingredient) {
        throw new BadRequestException(`Ingredient ${recipe.ingredientId} does not exist`);
      }

      return total + Number(ingredient.costPerUnit) * recipe.quantity;
    }, 0);
  }
}
