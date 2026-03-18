import { PartialType } from "@nestjs/swagger";
import { ApiProperty } from "@nestjs/swagger";
import { RoleCode } from "@prisma/client";
import { IsArray, IsBoolean, IsEnum, IsOptional } from "class-validator";

import { CreateUserDto } from "./create-user.dto";

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({ enum: RoleCode, isArray: true, required: false })
  @IsOptional()
  @IsArray()
  @IsEnum(RoleCode, { each: true })
  roles?: RoleCode[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
