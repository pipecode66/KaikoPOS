import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class MoveOrderDto {
  @ApiProperty()
  @IsString()
  orderId!: string;

  @ApiProperty()
  @IsString()
  toTableId!: string;
}
