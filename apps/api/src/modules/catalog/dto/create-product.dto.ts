import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsBoolean, IsNumber, IsOptional, IsString, Min, ValidateNested } from "class-validator";

export class ProductRecipeItemDto {
  @ApiProperty()
  @IsString()
  ingredientId!: string;

  @ApiProperty({ example: 18 })
  @IsNumber()
  @Min(0.001)
  quantity!: number;
}

export class CreateProductDto {
  @ApiProperty({ example: "BEB-004" })
  @IsString()
  sku!: string;

  @ApiProperty({ example: "Latte Caramelo" })
  @IsString()
  name!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 14500 })
  @IsNumber()
  @Min(0)
  price!: number;

  @ApiProperty()
  @IsString()
  categoryId!: string;

  @ApiProperty({ required: false, default: true })
  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;

  @ApiProperty({ required: false, default: true })
  @IsOptional()
  @IsBoolean()
  notesEnabled?: boolean;

  @ApiProperty({ required: false, isArray: true, type: ProductRecipeItemDto })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ProductRecipeItemDto)
  recipes?: ProductRecipeItemDto[];
}
