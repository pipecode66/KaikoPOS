import { ApiProperty } from "@nestjs/swagger";
import { CashMovementType } from "@prisma/client";
import { IsEnum, IsNumber, IsOptional, IsString, Min } from "class-validator";

export class CreateCashMovementDto {
  @ApiProperty({ enum: CashMovementType })
  @IsEnum(CashMovementType)
  type!: CashMovementType;

  @ApiProperty({ example: 15000 })
  @IsNumber()
  @Min(0)
  amount!: number;

  @ApiProperty({ required: false, example: "Cambio para domiciliario" })
  @IsOptional()
  @IsString()
  reason?: string;
}
