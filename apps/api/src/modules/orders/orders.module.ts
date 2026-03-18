import { Module } from "@nestjs/common";

import { KitchenModule } from "../kitchen/kitchen.module";
import { OrdersController } from "./orders.controller";
import { OrdersService } from "./orders.service";
import { OrdersRepository } from "./repositories/orders.repository";

@Module({
  imports: [KitchenModule],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersRepository],
  exports: [OrdersService, OrdersRepository]
})
export class OrdersModule {}
