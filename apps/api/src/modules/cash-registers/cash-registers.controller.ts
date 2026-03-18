import { Body, Controller, Get, Param, ParseUUIDPipe, Post, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";

import { CurrentUser, RequestUser } from "../../common/decorators/current-user.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { CashRegistersService } from "./cash-registers.service";
import { CloseCashRegisterDto } from "./dto/close-cash-register.dto";
import { CreateCashMovementDto } from "./dto/create-cash-movement.dto";
import { OpenCashRegisterDto } from "./dto/open-cash-register.dto";

@ApiTags("Cash Registers")
@ApiBearerAuth()
@Controller("cash-registers")
export class CashRegistersController {
  constructor(private readonly cashRegistersService: CashRegistersService) {}

  @Get("active")
  @Roles("ADMIN", "CASHIER")
  @ApiOperation({ summary: "Get the currently open register for a station" })
  getActive(@Query("label") label?: string) {
    return this.cashRegistersService.getActive(label);
  }

  @Post("open")
  @Roles("ADMIN", "CASHIER")
  @ApiOperation({ summary: "Open a cash register shift" })
  open(@Body() dto: OpenCashRegisterDto, @CurrentUser() currentUser: RequestUser) {
    return this.cashRegistersService.open(dto, currentUser);
  }

  @Post(":id/movements")
  @Roles("ADMIN", "CASHIER")
  @ApiOperation({ summary: "Register a manual cash movement" })
  createMovement(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Body() dto: CreateCashMovementDto,
    @CurrentUser() currentUser: RequestUser
  ) {
    return this.cashRegistersService.createMovement(id, dto, currentUser);
  }

  @Post(":id/close")
  @Roles("ADMIN", "CASHIER")
  @ApiOperation({ summary: "Close an active register and reconcile amounts" })
  close(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Body() dto: CloseCashRegisterDto,
    @CurrentUser() currentUser: RequestUser
  ) {
    return this.cashRegistersService.close(id, dto, currentUser);
  }

  @Get(":id/summary")
  @Roles("ADMIN", "CASHIER")
  @ApiOperation({ summary: "Get cash register summary totals by movement and payment method" })
  getSummary(@Param("id", new ParseUUIDPipe()) id: string) {
    return this.cashRegistersService.getSummary(id);
  }
}
