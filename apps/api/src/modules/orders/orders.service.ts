import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import {
  AuditAction,
  CashMovementType,
  CashRegisterStatus,
  OrderStatus,
  OrderType,
  PaymentMethod,
  Prisma,
  StockMovementType,
  TableStatus
} from "@prisma/client";

import { AuditService } from "../audit/audit.service";
import { RequestUser } from "../../common/decorators/current-user.decorator";
import { KitchenGateway } from "../kitchen/kitchen.gateway";
import { CreateOrderDto } from "./dto/create-order.dto";
import { MergeOrdersDto } from "./dto/merge-orders.dto";
import { SettleOrderDto } from "./dto/settle-order.dto";
import { SplitOrderDto } from "./dto/split-order.dto";
import { SubmitOrderDto } from "./dto/submit-order.dto";
import { UpdateOrderItemsDto } from "./dto/update-order-item.dto";
import { OrdersRepository } from "./repositories/orders.repository";

@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    private readonly kitchenGateway: KitchenGateway,
    private readonly auditService: AuditService
  ) {}

  listActive() {
    return this.ordersRepository.listActive();
  }

  async getById(id: string) {
    const order = await this.ordersRepository.findById(id);
    if (!order) {
      throw new NotFoundException("Order not found");
    }

    return order;
  }

  async create(dto: CreateOrderDto, currentUser: RequestUser) {
    if (dto.orderType === OrderType.TABLE && !dto.tableId) {
      throw new BadRequestException("Table orders require a tableId");
    }

    const products = await this.ordersRepository.findProducts(dto.items.map((item) => item.productId));
    const productMap = new Map(products.map((product) => [product.id, product]));

    if (productMap.size !== new Set(dto.items.map((item) => item.productId)).size) {
      throw new BadRequestException("One or more products are unavailable");
    }

    const totals = this.buildTotals(dto.items, productMap, dto.discountAmount ?? 0, dto.taxAmount ?? 0);
    const orderNumber = this.buildOrderNumber();

    const order = await this.ordersRepository.transaction(async (tx) => {
      const createdOrder = await this.ordersRepository.createOrder(tx, {
        orderNumber,
        type: dto.orderType,
        status: OrderStatus.OPEN,
        customerName: dto.customerName,
        notes: dto.notes,
        subtotal: totals.subtotal,
        discountAmount: dto.discountAmount ?? 0,
        taxAmount: dto.taxAmount ?? 0,
        totalAmount: totals.total,
        placedBy: {
          connect: {
            id: currentUser.sub
          }
        },
        register: dto.registerId
          ? {
              connect: {
                id: dto.registerId
              }
            }
          : undefined,
        table: dto.tableId
          ? {
              connect: {
                id: dto.tableId
              }
            }
          : undefined,
        items: {
          create: dto.items.map((item) => {
            const product = productMap.get(item.productId)!;
            return {
              product: {
                connect: {
                  id: item.productId
                }
              },
              quantity: item.quantity,
              unitPrice: Number(product.price),
              lineTotal: Number(product.price) * item.quantity,
              notes: item.notes
            };
          })
        }
      });

      if (dto.tableId) {
        await tx.diningTable.update({
          where: { id: dto.tableId },
          data: { status: TableStatus.OCCUPIED }
        });
      }

      return createdOrder;
    });

    await this.auditService.log({
      action: AuditAction.CREATE_ORDER,
      entityType: "order",
      entityId: order.id,
      performedById: currentUser.sub,
      metadata: { orderNumber }
    });

    return {
      order,
      receipt: this.buildReceipt(order.orderNumber, order.items, order.totalAmount, [])
    };
  }

  async updateItems(id: string, dto: UpdateOrderItemsDto, currentUser: RequestUser) {
    const order = await this.getById(id);
    if (this.isClosedStatus(order.status)) {
      throw new BadRequestException("Closed orders cannot be updated");
    }

    const incomingItems =
      dto.items ??
      order.items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        notes: item.notes ?? undefined
      }));

    const products = await this.ordersRepository.findProducts(incomingItems.map((item) => item.productId));
    const productMap = new Map(products.map((product) => [product.id, product]));
    const totals = this.buildTotals(
      incomingItems,
      productMap,
      dto.discountAmount ?? Number(order.discountAmount),
      dto.taxAmount ?? Number(order.taxAmount)
    );

    const updated = await this.ordersRepository.transaction(async (tx) => {
      if (dto.items) {
        await this.ordersRepository.deleteItems(tx, order.id);
        await this.ordersRepository.createItems(
          tx,
          incomingItems.map((item) => {
            const product = productMap.get(item.productId)!;
            return {
              orderId: order.id,
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: Number(product.price),
              lineTotal: Number(product.price) * item.quantity,
              notes: item.notes
            };
          })
        );
      }

      return this.ordersRepository.updateOrder(tx, order.id, {
        customerName: dto.customerName,
        notes: dto.notes,
        subtotal: totals.subtotal,
        discountAmount: dto.discountAmount ?? Number(order.discountAmount),
        taxAmount: dto.taxAmount ?? Number(order.taxAmount),
        totalAmount: totals.total
      });
    });

    await this.auditService.log({
      action: AuditAction.UPDATE,
      entityType: "order",
      entityId: id,
      performedById: currentUser.sub
    });

    return updated;
  }

  async submit(id: string, dto: SubmitOrderDto, currentUser: RequestUser) {
    const order = await this.getById(id);
    if (!order.items.length) {
      throw new BadRequestException("Orders must have at least one item");
    }

    const updated = await this.ordersRepository.transaction(async (tx) => {
      const submittedOrder = await this.ordersRepository.updateOrder(tx, id, {
        status: OrderStatus.SUBMITTED,
        submittedAt: new Date(),
        kitchenTicket: order.kitchenTicket
          ? {
              update: {
                status: "PENDING"
              }
            }
          : {
              create: {
                status: "PENDING"
              }
            }
      });

      if (order.tableId) {
        await tx.diningTable.update({
          where: { id: order.tableId },
          data: {
            status: TableStatus.OCCUPIED
          }
        });
      }

      return submittedOrder;
    });

    this.kitchenGateway.emitOrderSubmitted({
      orderId: updated.id,
      orderNumber: updated.orderNumber,
      urgent: dto.urgent ?? false
    });

    await this.auditService.log({
      action: AuditAction.SEND_TO_KITCHEN,
      entityType: "order",
      entityId: id,
      performedById: currentUser.sub,
      metadata: { urgent: dto.urgent ?? false }
    });

    return updated;
  }

  async settle(id: string, dto: SettleOrderDto, currentUser: RequestUser) {
    const order = await this.getById(id);
    if (this.isClosedStatus(order.status)) {
      throw new BadRequestException("Order is already closed");
    }

    const register = await this.ordersRepository.findRegister(dto.registerId);
    if (!register || register.status !== CashRegisterStatus.OPEN) {
      throw new BadRequestException("Cash register is not open");
    }

    const totalPaid = dto.payments.reduce((sum, payment) => sum + payment.amount, 0);
    const orderTotal = Number(order.totalAmount);

    if (Math.abs(totalPaid - orderTotal) > 0.01) {
      throw new BadRequestException("Payment total must match the order total");
    }

    const paymentTotals = {
      cash: dto.payments
        .filter((payment) => payment.method === PaymentMethod.CASH)
        .reduce((sum, payment) => sum + payment.amount, 0),
      card: dto.payments
        .filter((payment) => payment.method === PaymentMethod.CARD)
        .reduce((sum, payment) => sum + payment.amount, 0),
      transfer: dto.payments
        .filter((payment) => payment.method === PaymentMethod.TRANSFER)
        .reduce((sum, payment) => sum + payment.amount, 0)
    };

    const paidOrder = await this.ordersRepository.transaction(async (tx) => {
      await Promise.all(
        dto.payments.map((payment) =>
          tx.payment.create({
            data: {
              orderId: order.id,
              cashRegisterId: dto.registerId,
              receivedById: currentUser.sub,
              method: payment.method,
              amount: payment.amount,
              reference: payment.reference
            }
          })
        )
      );

      if (paymentTotals.cash > 0) {
        await tx.cashMovement.create({
          data: {
            cashRegisterId: dto.registerId,
            createdById: currentUser.sub,
            type: CashMovementType.SALE,
            amount: paymentTotals.cash,
            paymentMethod: PaymentMethod.CASH,
            reason: `Sale ${order.orderNumber}`,
            referenceId: order.id
          }
        });
      }

      await tx.cashRegister.update({
        where: { id: dto.registerId },
        data: {
          expectedAmount: Number(register.expectedAmount) + paymentTotals.cash,
          salesCashAmount: Number(register.salesCashAmount) + paymentTotals.cash,
          salesCardAmount: Number(register.salesCardAmount) + paymentTotals.card,
          salesTransferAmount: Number(register.salesTransferAmount) + paymentTotals.transfer
        }
      });

      for (const item of order.items) {
        for (const recipe of item.product.recipes) {
          const quantityToDiscount = Number(recipe.quantity) * item.quantity;
          const nextBalance = Number(recipe.ingredient.currentStock) - quantityToDiscount;

          await tx.ingredient.update({
            where: { id: recipe.ingredientId },
            data: {
              currentStock: nextBalance
            }
          });

          await tx.ingredientStockMovement.create({
            data: {
              ingredientId: recipe.ingredientId,
              createdById: currentUser.sub,
              type: StockMovementType.CONSUMPTION,
              quantity: quantityToDiscount * -1,
              balanceAfter: nextBalance,
              referenceId: order.id,
              referenceType: "ORDER_PAYMENT",
              note: `Consumed by ${order.orderNumber}`
            }
          });
        }
      }

      if (order.tableId) {
        await tx.diningTable.update({
          where: { id: order.tableId },
          data: { status: TableStatus.AVAILABLE }
        });
      }

      return this.ordersRepository.updateOrder(tx, order.id, {
        status: OrderStatus.PAID,
        register: {
          connect: {
            id: dto.registerId
          }
        },
        paidAt: new Date(),
        closedAt: new Date()
      });
    });

    await this.auditService.log({
      action: AuditAction.COMPLETE_PAYMENT,
      entityType: "order",
      entityId: id,
      performedById: currentUser.sub,
      metadata: { payments: dto.payments }
    });

    return {
      order: paidOrder,
      receipt: this.buildReceipt(order.orderNumber, order.items, order.totalAmount, dto.payments)
    };
  }

  async split(id: string, dto: SplitOrderDto, currentUser: RequestUser) {
    const order = await this.getById(id);
    if (this.isClosedStatus(order.status)) {
      throw new BadRequestException("Closed orders cannot be split");
    }

    const sourceItemMap = new Map(order.items.map((item) => [item.id, item]));
    const splitItems = dto.items.map((selectedItem) => {
      const sourceItem = sourceItemMap.get(selectedItem.orderItemId);
      if (!sourceItem) {
        throw new BadRequestException(`Order item ${selectedItem.orderItemId} not found`);
      }
      if (selectedItem.quantity > sourceItem.quantity) {
        throw new BadRequestException("Split quantity exceeds available quantity");
      }
      return { sourceItem, quantity: selectedItem.quantity };
    });

    const remainingItems: Array<{
      productId: string;
      quantity: number;
      unitPrice: number;
      lineTotal: number;
      notes?: string | null;
    }> = [];

    for (const item of order.items) {
      const selection = dto.items.find((selected) => selected.orderItemId === item.id);
      if (!selection) {
        remainingItems.push({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: Number(item.unitPrice),
          lineTotal: Number(item.lineTotal),
          notes: item.notes
        });
        continue;
      }
      if (selection.quantity === item.quantity) {
        continue;
      }
      remainingItems.push({
        productId: item.productId,
        quantity: item.quantity - selection.quantity,
        unitPrice: Number(item.unitPrice),
        lineTotal: Number(item.unitPrice) * (item.quantity - selection.quantity),
        notes: item.notes
      });
    }

    const splitSubtotal = splitItems.reduce(
      (sum, item) => sum + Number(item.sourceItem.unitPrice) * item.quantity,
      0
    );
    const remainingSubtotal = remainingItems.reduce((sum, item) => sum + Number(item.lineTotal), 0);

    const childOrder = await this.ordersRepository.transaction(async (tx) => {
      await this.ordersRepository.deleteItems(tx, order.id);
      if (remainingItems.length) {
        await this.ordersRepository.createItems(
          tx,
          remainingItems.map((item) => ({
            orderId: order.id,
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: Number(item.unitPrice),
            lineTotal: Number(item.lineTotal),
            notes: item.notes ?? undefined
          }))
        );
      }

      await this.ordersRepository.updateOrder(tx, order.id, {
        subtotal: remainingSubtotal,
        totalAmount: remainingSubtotal + Number(order.taxAmount) - Number(order.discountAmount)
      });

      const newOrder = await this.ordersRepository.createOrder(tx, {
        orderNumber: this.buildOrderNumber("SPLIT"),
        type: order.type,
        status: OrderStatus.OPEN,
        parentOrder: {
          connect: {
            id: order.id
          }
        },
        customerName: order.customerName ?? undefined,
        notes: "Split order",
        subtotal: splitSubtotal,
        discountAmount: 0,
        taxAmount: 0,
        totalAmount: splitSubtotal,
        placedBy: {
          connect: {
            id: currentUser.sub
          }
        },
        register: order.registerId
          ? {
              connect: {
                id: order.registerId
              }
            }
          : undefined,
        table: dto.destinationTableId
          ? {
              connect: {
                id: dto.destinationTableId
              }
            }
          : order.tableId
            ? {
                connect: {
                  id: order.tableId
                }
              }
            : undefined,
        items: {
          create: splitItems.map(({ sourceItem, quantity }) => ({
            product: {
              connect: {
                id: sourceItem.productId
              }
            },
            quantity,
            unitPrice: Number(sourceItem.unitPrice),
            lineTotal: Number(sourceItem.unitPrice) * quantity,
            notes: sourceItem.notes ?? undefined
          }))
        }
      });

      if (dto.destinationTableId) {
        await tx.diningTable.update({
          where: { id: dto.destinationTableId },
          data: { status: TableStatus.OCCUPIED }
        });
      }

      return newOrder;
    });

    await this.auditService.log({
      action: AuditAction.UPDATE,
      entityType: "order_split",
      entityId: id,
      performedById: currentUser.sub,
      metadata: { newOrderId: childOrder.id }
    });

    return childOrder;
  }

  async merge(dto: MergeOrdersDto, currentUser: RequestUser) {
    if (dto.sourceOrderId === dto.targetOrderId) {
      throw new BadRequestException("Source and target orders must be different");
    }

    const [sourceOrder, targetOrder] = await Promise.all([
      this.getById(dto.sourceOrderId),
      this.getById(dto.targetOrderId)
    ]);

    if ([sourceOrder.status, targetOrder.status].some((status) => this.isClosedStatus(status))) {
      throw new BadRequestException("Closed orders cannot be merged");
    }

    const mergedItems: Array<{
      productId: string;
      quantity: number;
      unitPrice: number;
      lineTotal: number;
      notes?: string | null;
    }> = [];

    for (const item of [...sourceOrder.items, ...targetOrder.items]) {
      const existing = mergedItems.find(
        (candidate) =>
          candidate.productId === item.productId &&
          candidate.notes === item.notes &&
          candidate.unitPrice === Number(item.unitPrice)
      );

      if (existing) {
        existing.quantity += item.quantity;
        existing.lineTotal = existing.unitPrice * existing.quantity;
      } else {
        mergedItems.push({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: Number(item.unitPrice),
          lineTotal: Number(item.unitPrice) * item.quantity,
          notes: item.notes
        });
      }
    }

    const mergedSubtotal = mergedItems.reduce((sum, item) => sum + Number(item.lineTotal), 0);

    const updatedOrder = await this.ordersRepository.transaction(async (tx) => {
      await this.ordersRepository.deleteItems(tx, targetOrder.id);
      await this.ordersRepository.createItems(
        tx,
        mergedItems.map((item) => ({
          orderId: targetOrder.id,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: Number(item.unitPrice),
          lineTotal: Number(item.lineTotal),
          notes: item.notes ?? undefined
        }))
      );

      const target = await this.ordersRepository.updateOrder(tx, targetOrder.id, {
        subtotal: mergedSubtotal,
        totalAmount: mergedSubtotal + Number(targetOrder.taxAmount) - Number(targetOrder.discountAmount)
      });

      await this.ordersRepository.updateOrder(tx, sourceOrder.id, {
        status: OrderStatus.CANCELLED,
        closedAt: new Date(),
        notes: `Merged into ${targetOrder.orderNumber}`
      });

      if (sourceOrder.tableId && sourceOrder.tableId !== targetOrder.tableId) {
        await tx.diningTable.update({
          where: { id: sourceOrder.tableId },
          data: { status: TableStatus.AVAILABLE }
        });
      }

      return target;
    });

    await this.auditService.log({
      action: AuditAction.UPDATE,
      entityType: "order_merge",
      entityId: targetOrder.id,
      performedById: currentUser.sub,
      metadata: { sourceOrderId: sourceOrder.id }
    });

    return updatedOrder;
  }

  private buildTotals(
    items: Array<{ productId: string; quantity: number }>,
    productMap: Map<string, { price: Prisma.Decimal }>,
    discountAmount: number,
    taxAmount: number
  ) {
    const subtotal = items.reduce((sum, item) => {
      const product = productMap.get(item.productId);
      if (!product) {
        throw new BadRequestException(`Product ${item.productId} is not available`);
      }

      return sum + Number(product.price) * item.quantity;
    }, 0);

    return {
      subtotal,
      total: subtotal + taxAmount - discountAmount
    };
  }

  private buildOrderNumber(prefix = "POS") {
    const timestamp = new Date().toISOString().replace(/[-:TZ.]/g, "").slice(2, 14);
    const suffix = Math.floor(Math.random() * 900 + 100);
    return `${prefix}-${timestamp}-${suffix}`;
  }

  private buildReceipt(
    orderNumber: string,
    items: Array<{
      product?: { name: string };
      quantity: number;
      unitPrice: Prisma.Decimal | number;
      lineTotal: Prisma.Decimal | number;
    }>,
    totalAmount: Prisma.Decimal,
    payments: Array<{ method: PaymentMethod; amount: number; reference?: string }>
  ) {
    return {
      orderNumber,
      issuedAt: new Date().toISOString(),
      items: items.map((item) => ({
        name: item.product?.name ?? "Item",
        quantity: item.quantity,
        unitPrice: Number(item.unitPrice),
        lineTotal: Number(item.lineTotal)
      })),
      payments,
      totalAmount: Number(totalAmount)
    };
  }

  private isClosedStatus(status: OrderStatus) {
    return status === OrderStatus.PAID || status === OrderStatus.CANCELLED;
  }
}
