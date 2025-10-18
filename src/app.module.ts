import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";

import { AuthModule } from "./core/modules/auth.module";
import { DbModule } from "./core/modules/db.module";
import { HealthModule } from "./core/modules/health.module";
import { UserModule } from "./core/modules/user.module";
import { EnvConfig } from "./lib/configs/env";

@Module({
  imports: [
    ConfigModule.forRoot({ cache: true, isGlobal: true, load: [EnvConfig] }),
    JwtModule.register({
      global: true,
    }),
    AuthModule,
    DbModule,
    HealthModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
