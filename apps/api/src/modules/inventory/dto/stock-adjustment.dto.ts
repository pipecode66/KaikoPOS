import { ApiProperty } from "@nestjs/swagger";
import { StockMovementType } from "@prisma/client";
import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";

export class StockAdjustmentDto {
  @ApiProperty({ enum: StockMovementType })
  @IsEnum(StockMovementType)
  type!: StockMovementType;

  @ApiProperty({ example: -50 })
  @IsNumber()
  quantity!: number;

  @ApiProperty({ required: false, example: "Conteo de cierre" })
  @IsOptional()
  @IsString()
  note?: string;

  @ApiProperty({ required: false, example: "stock-count-2026-03-18" })
  @IsOptional()
  @IsString()
  referenceId?: string;
}
