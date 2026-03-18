import { ApiProperty } from "@nestjs/swagger";
import { RoleCode } from "@prisma/client";
import { ArrayMinSize, IsArray, IsEmail, IsEnum, IsOptional, IsString, MinLength } from "class-validator";

export class CreateUserDto {
  @ApiProperty({ example: "new.cashier@sandeli.com" })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: "sandeli12@" })
  @IsString()
  @MinLength(8)
  password!: string;

  @ApiProperty({ example: "Ana" })
  @IsString()
  firstName!: string;

  @ApiProperty({ example: "Gomez" })
  @IsString()
  lastName!: string;

  @ApiProperty({ example: "Ana Caja" })
  @IsString()
  displayName!: string;

  @ApiProperty({ enum: RoleCode, isArray: true })
  @IsArray()
  @ArrayMinSize(1)
  @IsEnum(RoleCode, { each: true })
  roles!: RoleCode[];

  @ApiProperty({ required: false, default: true })
  @IsOptional()
  isActive?: boolean;
}
