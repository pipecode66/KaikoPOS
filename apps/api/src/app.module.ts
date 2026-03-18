import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";

import { AuditModule } from "./modules/audit/audit.module";
import { AuthModule } from "./modules/auth/auth.module";
import { CashRegistersModule } from "./modules/cash-registers/cash-registers.module";
import { CatalogModule } from "./modules/catalog/catalog.module";
import { InventoryModule } from "./modules/inventory/inventory.module";
import { KitchenModule } from "./modules/kitchen/kitchen.module";
import { OrdersModule } from "./modules/orders/orders.module";
import { ReportsModule } from "./modules/reports/reports.module";
import { TablesModule } from "./modules/tables/tables.module";
import { UsersModule } from "./modules/users/users.module";
import { PrismaModule } from "./prisma/prisma.module";
import { validateEnv } from "./config/env.validation";
import { JwtAuthGuard } from "./common/guards/jwt-auth.guard";
import { RolesGuard } from "./common/guards/roles.guard";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv
    }),
    PrismaModule,
    AuditModule,
    AuthModule,
    UsersModule,
    CatalogModule,
    InventoryModule,
    TablesModule,
    OrdersModule,
    KitchenModule,
    CashRegistersModule,
    ReportsModule
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard
    }
  ]
})
export class AppModule {}
