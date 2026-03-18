import { ApiProperty } from "@nestjs/swagger";
import { UnitOfMeasure } from "@prisma/client";
import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString, Min } from "class-validator";

export class CreateIngredientDto {
  @ApiProperty({ example: "ING-020", required: false })
  @IsOptional()
  @IsString()
  sku?: string;

  @ApiProperty({ example: "Chocolate oscuro" })
  @IsString()
  name!: string;

  @ApiProperty({ enum: UnitOfMeasure })
  @IsEnum(UnitOfMeasure)
  unit!: UnitOfMeasure;

  @ApiProperty({ example: 1200 })
  @IsNumber()
  @Min(0)
  currentStock!: number;

  @ApiProperty({ example: 200 })
  @IsNumber()
  @Min(0)
  minimumStock!: number;

  @ApiProperty({ example: 0.034 })
  @IsNumber()
  @Min(0)
  costPerUnit!: number;

  @ApiProperty({ required: false, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
