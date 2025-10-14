import { Module } from "@nestjs/common";

import { UserController } from "../controllers/user.controller";
import { UserService } from "../services/user.service";

import { DBModule } from "./db.module";

@Module({
  imports: [DBModule],
  controllers: [UserController],
  providers: [UserService],

  exports: [UserService],
})
export class UserModule {}
