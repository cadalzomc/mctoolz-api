import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";

import { AuthController } from "../controllers/auth.controller";
import { KeyGuard } from "../guards/key.guard";
import { AuthService } from "../services/auth.service";
import { JwtStrategy } from "../utils/jwt.strategy";

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: "jwt" }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (cs: ConfigService) => ({
        secret: cs.get<string>("jwt.secret"),
        signOptions: { expiresIn: cs.get<any>("jwt.expiry") },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, KeyGuard],

  exports: [AuthService, JwtStrategy, PassportModule],
})
export class AuthModule {}
