import { ApiProperty } from "@nestjs/swagger";
import { PaymentMethod } from "@prisma/client";
import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsEnum, IsNumber, IsOptional, IsString, Min, ValidateNested } from "class-validator";

class PaymentEntryDto {
  @ApiProperty({ enum: PaymentMethod })
  @IsEnum(PaymentMethod)
  method!: PaymentMethod;

  @ApiProperty({ example: 18500 })
  @IsNumber()
  @Min(0)
  amount!: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  reference?: string;
}

export class SettleOrderDto {
  @ApiProperty()
  @IsString()
  registerId!: string;

  @ApiProperty({ isArray: true, type: PaymentEntryDto })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => PaymentEntryDto)
  payments!: PaymentEntryDto[];
}

export { PaymentEntryDto };
