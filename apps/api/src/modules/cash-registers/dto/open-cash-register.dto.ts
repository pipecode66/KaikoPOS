import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString, Min } from "class-validator";

export class OpenCashRegisterDto {
  @ApiProperty({ example: "Caja Principal" })
  @IsString()
  label!: string;

  @ApiProperty({ example: 250000 })
  @IsNumber()
  @Min(0)
  openingAmount!: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}
