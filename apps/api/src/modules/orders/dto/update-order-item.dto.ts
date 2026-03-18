import { PartialType } from "@nestjs/swagger";
import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsNumber, IsOptional, Min, ValidateNested } from "class-validator";

import { CreateOrderDto, CreateOrderItemDto } from "./create-order.dto";

export class UpdateOrderItemsDto extends PartialType(CreateOrderDto) {
  @ApiProperty({ isArray: true, type: CreateOrderItemDto })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items?: CreateOrderItemDto[];

  @ApiProperty({ required: false, example: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  discountAmount?: number;

  @ApiProperty({ required: false, example: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  taxAmount?: number;
}
