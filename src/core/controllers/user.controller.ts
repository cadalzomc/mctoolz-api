import { Controller, Get, Param } from "@nestjs/common";

import { UserService } from "../services/user.service";

@Controller("users")
export class UserController {
  constructor(private userService: UserService) {}

  @Get(":id")
  async getUserById(@Param("id") id: string) {
    return this.userService.getUserById(id);
  }
}
