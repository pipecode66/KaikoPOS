import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";

import { CurrentUser, RequestUser } from "../../common/decorators/current-user.decorator";
import { Roles } from "../../common/decorators/roles.decorator";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UsersService } from "./users.service";

@ApiTags("Users")
@ApiBearerAuth()
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles("ADMIN")
  @ApiOperation({ summary: "List users with assigned roles" })
  findAll() {
    return this.usersService.findAll();
  }

  @Post()
  @Roles("ADMIN")
  @ApiOperation({ summary: "Create a new platform user" })
  create(@Body() dto: CreateUserDto, @CurrentUser() currentUser: RequestUser) {
    return this.usersService.create(dto, currentUser);
  }

  @Patch(":id")
  @Roles("ADMIN")
  @ApiOperation({ summary: "Update an existing user and role assignment" })
  update(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Body() dto: UpdateUserDto,
    @CurrentUser() currentUser: RequestUser
  ) {
    return this.usersService.update(id, dto, currentUser);
  }

  @Patch(":id/active")
  @Roles("ADMIN")
  @ApiOperation({ summary: "Activate or deactivate a user" })
  setActive(
    @Param("id", new ParseUUIDPipe()) id: string,
    @Body() dto: Pick<UpdateUserDto, "isActive">,
    @CurrentUser() currentUser: RequestUser
  ) {
    return this.usersService.setActive(id, dto.isActive ?? true, currentUser);
  }
}
