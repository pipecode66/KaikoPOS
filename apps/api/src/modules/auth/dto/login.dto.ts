import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MinLength } from "class-validator";

export class LoginDto {
  @ApiProperty({ example: "admin@sandeli.local" })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: "Demo1234!" })
  @IsString()
  @MinLength(8)
  password!: string;
}
