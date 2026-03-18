import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";

import { CurrentUser, RequestUser } from "../../common/decorators/current-user.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { CreateOrderDto } from "./dto/create-order.dto";
import { MergeOrdersDto } from "./dto/merge-orders.dto";
import { SettleOrderDto } from "./dto/settle-order.dto";
import { SplitOrderDto } from "./dto/split-order.dto";
import { SubmitOrderDto } from "./dto/submit-order.dto";
import { UpdateOrderItemsDto } from "./dto/update-order-item.dto";
import { OrdersService } from "./orders.service";

@ApiTags("Orders")
@ApiBearerAuth()
@Controller("orders")
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get("active")
  @Roles("ADMIN", "CASHIER", "WAITER", "KITCHEN")
  @ApiOperation({ summary: "List all active operational orders" })
  listActive() {
    return this.ordersService.listActive();
  }

  @Get(":id")
  @Roles("ADMIN", "CASHIER", "WAITER", "KITCHEN")
  @ApiOperation({ summary: "Get a single order with ticket and payment context" })
  getById(@Param("id", new ParseUUIDPipe()) id: string) {
    return this.ordersService.getById(id);
  }

  @Post()
  @Roles("ADMIN", "CASHIER", "WAITER")
  @ApiOperation({ summary: "Create a new POS order" })
  create(@Body() dto: CreateOrderDto, @CurrentUser() currentUser: RequestUser) {
    return this.ordersService.create(dto, currentUser);
  }

  @Patch(":id/items")
  @Roles("ADMIN", "CASHIER", "WAITER")
  @ApiOperation({ summary: "Replace order items and recalculate totals" })
  updateItems(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateOrderItemsDto,
    @CurrentUser() currentUser: RequestUser
  ) {
    return this.ordersService.updateItems(id, dto, currentUser);
  }

  @Post(":id/submit")
  @Roles("ADMIN", "CASHIER", "WAITER")
  @ApiOperation({ summary: "Send an order to the kitchen display system" })
  submit(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Body() dto: SubmitOrderDto,
    @CurrentUser() currentUser: RequestUser
  ) {
    return this.ordersService.submit(id, dto, currentUser);
  }

  @Post(":id/settle")
  @Roles("ADMIN", "CASHIER")
  @ApiOperation({ summary: "Receive payment, close order and discount inventory" })
  settle(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Body() dto: SettleOrderDto,
    @CurrentUser() currentUser: RequestUser
  ) {
    return this.ordersService.settle(id, dto, currentUser);
  }

  @Post(":id/split")
  @Roles("ADMIN", "CASHIER", "WAITER")
  @ApiOperation({ summary: "Split selected items into a new order" })
  split(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Body() dto: SplitOrderDto,
    @CurrentUser() currentUser: RequestUser
  ) {
    return this.ordersService.split(id, dto, currentUser);
  }

  @Post("merge")
  @Roles("ADMIN", "CASHIER", "WAITER")
  @ApiOperation({ summary: "Merge one order into another" })
  merge(@Body() dto: MergeOrdersDto, @CurrentUser() currentUser: RequestUser) {
    return this.ordersService.merge(dto, currentUser);
  }
}
