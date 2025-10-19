import { Body, Controller, Post, UseGuards } from "@nestjs/common";

import { DtoRegister, DtoVerify } from "@/lib/models";

import { KeyGuard } from "../guards/key.guard";
import { AuthService } from "../services/auth.service";

@Controller("auth")
@UseGuards(KeyGuard)
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post("register")
  Register(@Body() payload: DtoRegister) {
    return this.auth.Register(payload);
  }

  @Post("verify")
  VerifyAndLogin(@Body() payload: DtoVerify) {
    return this.auth.Verify(payload.email, payload.token);
  }
}
