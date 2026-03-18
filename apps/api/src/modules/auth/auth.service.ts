import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { AuditAction } from "@prisma/client";

import { AuditService } from "../audit/audit.service";
import { PrismaService } from "../../prisma/prisma.service";
import { LoginDto } from "./dto/login.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly auditService: AuditService
  ) {}

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: {
        roles: {
          include: {
            role: true
          }
        }
      }
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const isValid = await bcrypt.compare(dto.password, user.passwordHash);

    if (!isValid) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const payload = {
      sub: user.id,
      email: user.email,
      displayName: user.displayName,
      roles: user.roles.map((item) => item.role.code)
    };

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });

    await this.auditService.log({
      action: AuditAction.LOGIN,
      entityType: "user",
      entityId: user.id,
      performedById: user.id
    });

    return {
      accessToken: await this.jwtService.signAsync(payload),
      user: payload
    };
  }
}
