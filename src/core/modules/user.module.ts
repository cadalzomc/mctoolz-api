import { Module } from "@nestjs/common";

import { UserController } from "../controllers/user.controller";
import { UserService } from "../services/user.service";

import { DbModule } from "./db.module";

@Module({
  imports: [DbModule],
  controllers: [UserController],
  providers: [UserService],

  exports: [UserService],
})
export class UserModule {}
