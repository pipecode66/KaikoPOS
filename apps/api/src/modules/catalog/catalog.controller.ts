import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";

import { CurrentUser, RequestUser } from "../../common/decorators/current-user.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { CatalogService } from "./catalog.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";

@ApiTags("Catalog")
@ApiBearerAuth()
@Controller("catalog")
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get("categories")
  @Roles("ADMIN", "CASHIER", "WAITER")
  @ApiOperation({ summary: "List product categories" })
  listCategories() {
    return this.catalogService.listCategories();
  }

  @Post("categories")
  @Roles("ADMIN")
  @ApiOperation({ summary: "Create a new product category" })
  createCategory(@Body() dto: CreateCategoryDto, @CurrentUser() currentUser: RequestUser) {
    return this.catalogService.createCategory(dto, currentUser);
  }

  @Get("products")
  @Roles("ADMIN", "CASHIER", "WAITER")
  @ApiOperation({ summary: "List sellable products with recipe references" })
  listProducts() {
    return this.catalogService.listProducts();
  }

  @Post("products")
  @Roles("ADMIN")
  @ApiOperation({ summary: "Create a new product" })
  createProduct(@Body() dto: CreateProductDto, @CurrentUser() currentUser: RequestUser) {
    return this.catalogService.createProduct(dto, currentUser);
  }

  @Patch("products/:id")
  @Roles("ADMIN")
  @ApiOperation({ summary: "Update product details and recipe references" })
  updateProduct(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateProductDto,
    @CurrentUser() currentUser: RequestUser
  ) {
    return this.catalogService.updateProduct(id, dto, currentUser);
  }

  @Patch("products/:id/availability")
  @Roles("ADMIN")
  @ApiOperation({ summary: "Enable or disable a product for sale" })
  toggleAvailability(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Body() dto: Pick<UpdateProductDto, "isAvailable">,
    @CurrentUser() currentUser: RequestUser
  ) {
    return this.catalogService.toggleAvailability(id, dto.isAvailable ?? true, currentUser);
  }
}
