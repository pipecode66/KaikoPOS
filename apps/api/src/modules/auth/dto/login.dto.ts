import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MinLength } from "class-validator";

export class LoginDto {
  @ApiProperty({ example: "admin@sandeli.com" })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: "sandeli12@" })
  @IsString()
  @MinLength(8)
  password!: string;
}
