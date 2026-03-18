import { Injectable } from "@nestjs/common";
import { RoleCode, Prisma, UserStatus } from "@prisma/client";

import { PrismaService } from "../../../prisma/prisma.service";

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.user.findMany({
      include: {
        roles: {
          include: {
            role: true
          }
        }
      },
      orderBy: {
        createdAt: "asc"
      }
    });
  }

  findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email }
    });
  }

  findRolesByCodes(codes: RoleCode[]) {
    return this.prisma.role.findMany({
      where: {
        code: {
          in: codes
        }
      }
    });
  }

  createUser(data: Prisma.UserCreateInput) {
    return this.prisma.user.create({
      data,
      include: {
        roles: {
          include: {
            role: true
          }
        }
      }
    });
  }

  updateUser(id: string, data: Prisma.UserUpdateInput) {
    return this.prisma.user.update({
      where: { id },
      data,
      include: {
        roles: {
          include: {
            role: true
          }
        }
      }
    });
  }

  updateStatus(id: string, isActive: boolean) {
    return this.prisma.user.update({
      where: { id },
      data: {
        isActive,
        status: isActive ? UserStatus.ACTIVE : UserStatus.INACTIVE
      }
    });
  }
}
