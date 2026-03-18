import { ApiProperty } from "@nestjs/swagger";
import { KitchenTicketStatus } from "@prisma/client";
import { IsEnum } from "class-validator";

export class UpdateKitchenTicketStatusDto {
  @ApiProperty({ enum: KitchenTicketStatus })
  @IsEnum(KitchenTicketStatus)
  status!: KitchenTicketStatus;
}
