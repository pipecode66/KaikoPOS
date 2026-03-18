import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class MergeOrdersDto {
  @ApiProperty()
  @IsString()
  sourceOrderId!: string;

  @ApiProperty()
  @IsString()
  targetOrderId!: string;
}
