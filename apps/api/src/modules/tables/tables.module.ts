import { Module } from "@nestjs/common";

import { PrismaModule } from "../../prisma/prisma.module";
import { TablesController } from "./tables.controller";
import { TablesService } from "./tables.service";
import { TablesRepository } from "./repositories/tables.repository";

@Module({
  imports: [PrismaModule],
  controllers: [TablesController],
  providers: [TablesService, TablesRepository],
  exports: [TablesService, TablesRepository]
})
export class TablesModule {}
