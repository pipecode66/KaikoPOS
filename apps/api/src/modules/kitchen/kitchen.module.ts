import { Module } from "@nestjs/common";

import { KitchenController } from "./kitchen.controller";
import { KitchenGateway } from "./kitchen.gateway";
import { KitchenService } from "./kitchen.service";
import { KitchenRepository } from "./repositories/kitchen.repository";

@Module({
  controllers: [KitchenController],
  providers: [KitchenService, KitchenRepository, KitchenGateway],
  exports: [KitchenService, KitchenGateway]
})
export class KitchenModule {}
