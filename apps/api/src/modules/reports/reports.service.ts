import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";

import { DateRangeQueryDto } from "./dto/date-range-query.dto";
import { ReportsRepository } from "./reports.repository";

@Injectable()
export class ReportsService {
  constructor(private readonly reportsRepository: ReportsRepository) {}

  async getDailySummary(query: DateRangeQueryDto) {
    const dateRange = this.buildDateRange(query);
    const orders = await this.reportsRepository.findPaidOrders(dateRange);

    const grossSales = orders.reduce((sum, order) => sum + Number(order.subtotal), 0);
    const discounts = orders.reduce((sum, order) => sum + Number(order.discountAmount), 0);
    const taxes = orders.reduce((sum, order) => sum + Number(order.taxAmount), 0);
    const netSales = orders.reduce((sum, order) => sum + Number(order.totalAmount), 0);
    const estimatedCost = orders.reduce((sum, order) => {
      return (
        sum +
        order.items.reduce((itemSum, item) => {
          const recipeCost = item.product.recipes.reduce(
            (recipeSum, recipe) => recipeSum + Number(recipe.quantity) * Number(recipe.ingredient.costPerUnit),
            0
          );
          return itemSum + recipeCost * item.quantity;
        }, 0)
      );
    }, 0);

    return {
      orderCount: orders.length,
      grossSales,
      discounts,
      taxes,
      netSales,
      estimatedCost,
      estimatedProfit: netSales - estimatedCost
    };
  }

  getPaymentMethods(query: DateRangeQueryDto) {
    return this.reportsRepository.groupPayments(this.buildDateRange(query));
  }

  async getBestSellers(query: DateRangeQueryDto) {
    const orders = await this.reportsRepository.findPaidOrders(this.buildDateRange(query));
    const grouped = new Map<
      string,
      {
        productId: string;
        name: string;
        quantity: number;
        sales: number;
      }
    >();

    for (const order of orders) {
      for (const item of order.items) {
        const current = grouped.get(item.productId) ?? {
          productId: item.productId,
          name: item.product.name,
          quantity: 0,
          sales: 0
        };
        current.quantity += item.quantity;
        current.sales += Number(item.lineTotal);
        grouped.set(item.productId, current);
      }
    }

    return [...grouped.values()].sort((a, b) => b.quantity - a.quantity).slice(0, 10);
  }

  getCashMovements(query: DateRangeQueryDto) {
    return this.reportsRepository.listCashMovements(this.buildDateRange(query));
  }

  private buildDateRange(query: DateRangeQueryDto): Prisma.DateTimeFilter | undefined {
    if (!query.startDate && !query.endDate) {
      return undefined;
    }

    return {
      gte: query.startDate ? new Date(`${query.startDate}T00:00:00.000Z`) : undefined,
      lte: query.endDate ? new Date(`${query.endDate}T23:59:59.999Z`) : undefined
    };
  }
}
