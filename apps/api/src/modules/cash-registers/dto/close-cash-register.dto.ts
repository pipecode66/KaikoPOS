import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString, Min } from "class-validator";

export class CloseCashRegisterDto {
  @ApiProperty({ example: 387500 })
  @IsNumber()
  @Min(0)
  countedAmount!: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;
}
