import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { KitchenTicketStatus } from "@prisma/client";

import { CurrentUser, RequestUser } from "../../common/decorators/current-user.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { UpdateKitchenTicketStatusDto } from "./dto/update-kitchen-ticket-status.dto";
import { KitchenService } from "./kitchen.service";

@ApiTags("Kitchen")
@ApiBearerAuth()
@Controller("kitchen")
export class KitchenController {
  constructor(private readonly kitchenService: KitchenService) {}

  @Get("tickets")
  @Roles("ADMIN", "KITCHEN", "WAITER")
  @ApiOperation({ summary: "List active kitchen tickets, optionally by status" })
  listTickets(@Query("status") status?: KitchenTicketStatus) {
    return this.kitchenService.listTickets(status);
  }

  @Patch("orders/:orderId/status")
  @Roles("ADMIN", "KITCHEN")
  @ApiOperation({ summary: "Update kitchen workflow status for an order" })
  updateStatus(
    @Param("orderId", new ParseUUIDPipe()) orderId: string,
    @Body() dto: UpdateKitchenTicketStatusDto,
    @CurrentUser() currentUser: RequestUser
  ) {
    return this.kitchenService.updateStatus(orderId, dto, currentUser);
  }
}
