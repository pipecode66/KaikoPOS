import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsNumber, IsOptional, IsString, Min, ValidateNested } from "class-validator";

class SplitOrderItemDto {
  @ApiProperty()
  @IsString()
  orderItemId!: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @Min(1)
  quantity!: number;
}

export class SplitOrderDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  destinationTableId?: string;

  @ApiProperty({ isArray: true, type: SplitOrderItemDto })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => SplitOrderItemDto)
  items!: SplitOrderItemDto[];
}

export { SplitOrderItemDto };
