import { Body, Controller, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

import { Public } from "../../common/decorators/public.decorator";
import { LoginDto } from "./dto/login.dto";
import { AuthService } from "./auth.service";

@ApiTags("Authentication")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post("login")
  @ApiOperation({ summary: "Authenticate a user and return a JWT token" })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }
}
