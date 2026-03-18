import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";

import { CurrentUser, RequestUser } from "../../common/decorators/current-user.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { MoveOrderDto } from "./dto/move-order.dto";
import { UpdateTableStatusDto } from "./dto/update-table-status.dto";
import { TablesService } from "./tables.service";

@ApiTags("Tables")
@ApiBearerAuth()
@Controller("tables")
export class TablesController {
  constructor(private readonly tablesService: TablesService) {}

  @Get()
  @Roles("ADMIN", "CASHIER", "WAITER")
  @ApiOperation({ summary: "List dining tables with current operational status" })
  listTables() {
    return this.tablesService.listTables();
  }

  @Patch(":id/status")
  @Roles("ADMIN", "WAITER")
  @ApiOperation({ summary: "Update a table status" })
  updateStatus(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateTableStatusDto,
    @CurrentUser() currentUser: RequestUser
  ) {
    return this.tablesService.updateStatus(id, dto, currentUser);
  }

  @Post("move-order")
  @Roles("ADMIN", "WAITER")
  @ApiOperation({ summary: "Move an active order from one table to another" })
  moveOrder(@Body() dto: MoveOrderDto, @CurrentUser() currentUser: RequestUser) {
    return this.tablesService.moveOrder(dto, currentUser);
  }
}
