import { Controller, Get, Query } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";

import { Roles } from "../../common/decorators/roles.decorator";
import { DateRangeQueryDto } from "./dto/date-range-query.dto";
import { ReportsService } from "./reports.service";

@ApiTags("Reports")
@ApiBearerAuth()
@Controller("reports")
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get("daily-summary")
  @Roles("ADMIN", "CASHIER")
  @ApiOperation({ summary: "Get daily or date-range sales summary" })
  getDailySummary(@Query() query: DateRangeQueryDto) {
    return this.reportsService.getDailySummary(query);
  }

  @Get("payment-methods")
  @Roles("ADMIN", "CASHIER")
  @ApiOperation({ summary: "Get totals grouped by payment method" })
  getPaymentMethods(@Query() query: DateRangeQueryDto) {
    return this.reportsService.getPaymentMethods(query);
  }

  @Get("best-sellers")
  @Roles("ADMIN", "CASHIER")
  @ApiOperation({ summary: "Get best-selling products" })
  getBestSellers(@Query() query: DateRangeQueryDto) {
    return this.reportsService.getBestSellers(query);
  }

  @Get("cash-movements")
  @Roles("ADMIN", "CASHIER")
  @ApiOperation({ summary: "Get cash movement report" })
  getCashMovements(@Query() query: DateRangeQueryDto) {
    return this.reportsService.getCashMovements(query);
  }
}
