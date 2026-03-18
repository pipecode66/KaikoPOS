import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { AuditAction, UserStatus } from "@prisma/client";
import * as bcrypt from "bcrypt";

import { AuditService } from "../audit/audit.service";
import { RequestUser } from "../../common/decorators/current-user.decorator";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UsersRepository } from "./repositories/users.repository";

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly auditService: AuditService
  ) {}

  findAll() {
    return this.usersRepository.findAll();
  }

  async create(dto: CreateUserDto, currentUser: RequestUser) {
    const existing = await this.usersRepository.findByEmail(dto.email);
    if (existing) {
      throw new BadRequestException("Email is already in use");
    }

    const roles = await this.usersRepository.findRolesByCodes(dto.roles);
    if (roles.length !== dto.roles.length) {
      throw new BadRequestException("One or more roles do not exist");
    }

    const passwordHash = await bcrypt.hash(dto.password, 10);

    const user = await this.usersRepository.createUser({
      email: dto.email,
      passwordHash,
      firstName: dto.firstName,
      lastName: dto.lastName,
      displayName: dto.displayName,
      isActive: dto.isActive ?? true,
      status: dto.isActive ?? true ? UserStatus.ACTIVE : UserStatus.INACTIVE,
      roles: {
        create: roles.map((role) => ({
          role: {
            connect: {
              id: role.id
            }
          }
        }))
      }
    });

    await this.auditService.log({
      action: AuditAction.CREATE,
      entityType: "user",
      entityId: user.id,
      performedById: currentUser.sub,
      metadata: { roles: dto.roles }
    });

    return user;
  }

  async update(id: string, dto: UpdateUserDto, currentUser: RequestUser) {
    const data: Record<string, unknown> = {};

    if (dto.firstName) data.firstName = dto.firstName;
    if (dto.lastName) data.lastName = dto.lastName;
    if (dto.displayName) data.displayName = dto.displayName;
    if (typeof dto.isActive === "boolean") {
      data.isActive = dto.isActive;
      data.status = dto.isActive ? UserStatus.ACTIVE : UserStatus.INACTIVE;
    }

    if (dto.password) {
      data.passwordHash = await bcrypt.hash(dto.password, 10);
    }

    if (dto.roles?.length) {
      const roles = await this.usersRepository.findRolesByCodes(dto.roles);
      if (roles.length !== dto.roles.length) {
        throw new BadRequestException("One or more roles do not exist");
      }

      data.roles = {
        deleteMany: {},
        create: roles.map((role) => ({
          role: {
            connect: {
              id: role.id
            }
          }
        }))
      };
    }

    try {
      const updated = await this.usersRepository.updateUser(id, data);
      await this.auditService.log({
        action: AuditAction.UPDATE,
        entityType: "user",
        entityId: id,
        performedById: currentUser.sub,
        metadata: { changes: Object.keys(data) }
      });
      return updated;
    } catch {
      throw new NotFoundException("User not found");
    }
  }

  async setActive(id: string, isActive: boolean, currentUser: RequestUser) {
    try {
      const user = await this.usersRepository.updateStatus(id, isActive);
      await this.auditService.log({
        action: AuditAction.UPDATE,
        entityType: "user",
        entityId: id,
        performedById: currentUser.sub,
        metadata: { isActive }
      });
      return user;
    } catch {
      throw new NotFoundException("User not found");
    }
  }
}
