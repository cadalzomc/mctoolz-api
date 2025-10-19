import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";

import { AuthModule } from "./core/modules/auth.module";
import { DbModule } from "./core/modules/db.module";
import { HealthModule } from "./core/modules/health.module";
import { MailerModule } from "./core/modules/mailer.module";
import { UserModule } from "./core/modules/user.module";
import { EnvConfig } from "./lib/configs/env";
import { IConfigMailer, IMailerOption } from "./lib/models";

@Module({
  imports: [
    ConfigModule.forRoot({ cache: true, isGlobal: true, load: [EnvConfig] }),
    JwtModule.register({
      global: true,
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (cs: ConfigService) => {
        const cm = cs.get<IConfigMailer>("mailer");
        const opt: IMailerOption = {
          transport: {
            service: cm?.service,
            auth: {
              email: cm?.sender.email ?? "",
              password: cm?.sender.password ?? "",
            },
          },
          defaults: {
            from: `"${cm?.sender.name}" <${cm?.sender.email}>`,
          },
          debug: cm?.debug ?? false,
        };
        return opt;
      },
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
