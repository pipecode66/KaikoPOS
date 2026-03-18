import { Body, Controller, DefaultValuePipe, Get, Param, ParseIntPipe, ParseUUIDPipe, Post, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";

import { CurrentUser, RequestUser } from "../../common/decorators/current-user.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { CreateIngredientDto } from "./dto/create-ingredient.dto";
import { StockAdjustmentDto } from "./dto/stock-adjustment.dto";
import { InventoryService } from "./inventory.service";

@ApiTags("Inventory")
@ApiBearerAuth()
@Controller("inventory")
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get("ingredients")
  @Roles("ADMIN", "CASHIER")
  @ApiOperation({ summary: "List ingredients and current stock levels" })
  listIngredients() {
    return this.inventoryService.listIngredients();
  }

  @Post("ingredients")
  @Roles("ADMIN")
  @ApiOperation({ summary: "Create an ingredient and seed its initial stock" })
  createIngredient(@Body() dto: CreateIngredientDto, @CurrentUser() currentUser: RequestUser) {
    return this.inventoryService.createIngredient(dto, currentUser);
  }

  @Post("ingredients/:id/adjustments")
  @Roles("ADMIN", "CASHIER")
  @ApiOperation({ summary: "Register a manual stock adjustment" })
  adjustStock(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Body() dto: StockAdjustmentDto,
    @CurrentUser() currentUser: RequestUser
  ) {
    return this.inventoryService.adjustStock(id, dto, currentUser);
  }

  @Get("low-stock")
  @Roles("ADMIN", "CASHIER")
  @ApiOperation({ summary: "List ingredients under their configured minimum stock" })
  listLowStock() {
    return this.inventoryService.listLowStock();
  }

  @Get("movements")
  @Roles("ADMIN", "CASHIER")
  @ApiOperation({ summary: "List stock movement history" })
  listMovements(@Query("limit", new DefaultValuePipe(50), ParseIntPipe) limit: number) {
    return this.inventoryService.listMovements(limit);
  }
}
