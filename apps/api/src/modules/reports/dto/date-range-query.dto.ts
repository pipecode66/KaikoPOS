import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsDateString, IsOptional } from "class-validator";

export class DateRangeQueryDto {
  @ApiPropertyOptional({ example: "2026-03-18" })
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @ApiPropertyOptional({ example: "2026-03-18" })
  @IsOptional()
  @IsDateString()
  endDate?: string;
}
