import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsOptional, IsString, Min } from "class-validator";

export class CreateCategoryDto {
  @ApiProperty({ example: "Postres" })
  @IsString()
  name!: string;

  @ApiProperty({ required: false, example: 4, default: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  sortOrder?: number;
}
