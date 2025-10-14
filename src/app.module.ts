import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { DBModule } from "./core/modules/db.module";
import { HealthModule } from "./core/modules/health.module";
import { UserModule } from "./core/modules/user.module";
import { EnvConfig } from "./lib/configs/env";

@Module({
  imports: [
    ConfigModule.forRoot({ cache: true, isGlobal: true, load: [EnvConfig] }),
    DBModule,
    HealthModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
