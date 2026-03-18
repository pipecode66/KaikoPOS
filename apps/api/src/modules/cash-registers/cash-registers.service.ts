import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { AuditAction, CashMovementType, CashRegisterStatus } from "@prisma/client";

import { AuditService } from "../audit/audit.service";
import { RequestUser } from "../../common/decorators/current-user.decorator";
import { CashRegistersRepository } from "./repositories/cash-registers.repository";
import { CloseCashRegisterDto } from "./dto/close-cash-register.dto";
import { CreateCashMovementDto } from "./dto/create-cash-movement.dto";
import { OpenCashRegisterDto } from "./dto/open-cash-register.dto";

@Injectable()
export class CashRegistersService {
  constructor(
    private readonly cashRegistersRepository: CashRegistersRepository,
    private readonly auditService: AuditService
  ) {}

  getActive(label?: string) {
    return this.cashRegistersRepository.findActiveByLabel(label);
  }

  async open(dto: OpenCashRegisterDto, currentUser: RequestUser) {
    const activeRegister = await this.cashRegistersRepository.findActiveByLabel(dto.label);
    if (activeRegister) {
      throw new BadRequestException("There is already an open register with this label");
    }

    const register = await this.cashRegistersRepository.transaction(async (tx) => {
      const createdRegister = await this.cashRegistersRepository.createRegister(tx, {
        label: dto.label,
        openingAmount: dto.openingAmount,
        expectedAmount: dto.openingAmount,
        notes: dto.notes,
        openedBy: {
          connect: {
            id: currentUser.sub
          }
        }
      });

      await this.cashRegistersRepository.createMovement(tx, {
        cashRegister: {
          connect: {
            id: createdRegister.id
          }
        },
        createdBy: {
          connect: {
            id: currentUser.sub
          }
        },
        type: CashMovementType.OPENING,
        amount: dto.openingAmount,
        reason: "Register opening"
      });

      return createdRegister;
    });

    await this.auditService.log({
      action: AuditAction.OPEN_REGISTER,
      entityType: "cash_register",
      entityId: register.id,
      performedById: currentUser.sub,
      metadata: { label: dto.label }
    });

    return register;
  }

  async createMovement(id: string, dto: CreateCashMovementDto, currentUser: RequestUser) {
    const register = await this.cashRegistersRepository.findById(id);
    if (!register || register.status !== CashRegisterStatus.OPEN) {
      throw new NotFoundException("Open cash register not found");
    }

    const direction =
      dto.type === CashMovementType.DROP ||
      dto.type === CashMovementType.PAYOUT ||
      dto.type === CashMovementType.REFUND
        ? -1
        : 1;

    const updated = await this.cashRegistersRepository.transaction(async (tx) => {
      await this.cashRegistersRepository.createMovement(tx, {
        cashRegister: {
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
        amount: dto.amount,
        reason: dto.reason
      });

      return this.cashRegistersRepository.updateRegister(tx, id, {
        expectedAmount: Number(register.expectedAmount) + dto.amount * direction
      });
    });

    await this.auditService.log({
      action: AuditAction.UPDATE,
      entityType: "cash_register_movement",
      entityId: id,
      performedById: currentUser.sub,
      metadata: { type: dto.type, amount: dto.amount }
    });

    return updated;
  }

  async close(id: string, dto: CloseCashRegisterDto, currentUser: RequestUser) {
    const register = await this.cashRegistersRepository.findById(id);
    if (!register || register.status !== CashRegisterStatus.OPEN) {
      throw new NotFoundException("Open cash register not found");
    }

    const difference = dto.countedAmount - Number(register.expectedAmount);

    const updated = await this.cashRegistersRepository.transaction(async (tx) => {
      await this.cashRegistersRepository.createMovement(tx, {
        cashRegister: {
          connect: {
            id
          }
        },
        createdBy: {
          connect: {
            id: currentUser.sub
          }
        },
        type: CashMovementType.CLOSING,
        amount: dto.countedAmount,
        reason: "Register closing"
      });

      return this.cashRegistersRepository.updateRegister(tx, id, {
        status: CashRegisterStatus.CLOSED,
        countedAmount: dto.countedAmount,
        closedAt: new Date(),
        closedBy: {
          connect: {
            id: currentUser.sub
          }
        },
        notes: dto.notes ?? register.notes
      });
    });

    await this.auditService.log({
      action: AuditAction.CLOSE_REGISTER,
      entityType: "cash_register",
      entityId: id,
      performedById: currentUser.sub,
      metadata: { difference }
    });

    return {
      register: updated,
      reconciliation: {
        expectedAmount: Number(register.expectedAmount),
        countedAmount: dto.countedAmount,
        difference
      }
    };
  }

  async getSummary(id: string) {
    const register = await this.cashRegistersRepository.findById(id);
    if (!register) {
      throw new NotFoundException("Cash register not found");
    }

    const movementTotals = register.cashMovements.reduce(
      (accumulator, movement) => {
        accumulator.total += Number(movement.amount);
        accumulator.byType[movement.type] = (accumulator.byType[movement.type] ?? 0) + Number(movement.amount);
        return accumulator;
      },
      {
        total: 0,
        byType: {} as Record<string, number>
      }
    );

    const paymentTotals = register.payments.reduce(
      (accumulator, payment) => {
        accumulator[payment.method] = (accumulator[payment.method] ?? 0) + Number(payment.amount);
        return accumulator;
      },
      {} as Record<string, number>
    );

    return {
      register,
      movementTotals,
      paymentTotals,
      expectedAmount: Number(register.expectedAmount),
      countedAmount: register.countedAmount ? Number(register.countedAmount) : null
    };
  }
}
