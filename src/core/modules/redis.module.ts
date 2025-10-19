import { Global, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { Redis } from "ioredis";

import { RedisClient } from "@/lib/common";
import { IConfigRedis } from "@/lib/models";

import { RedisService } from "../services/redis.service";

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: RedisClient,
      useFactory: (configService: ConfigService): Redis => {
        const cn = configService.get<IConfigRedis>("redis");
        return new Redis({
          host: cn?.host,
          port: cn?.port,
          username: cn?.username,
          password: cn?.password,
          lazyConnect: true,
          maxRetriesPerRequest: null,
          enableReadyCheck: false,
          ...(cn?.isTls ? { tls: {} } : {}),
        });
      },
      inject: [ConfigService],
    },
    RedisService,
  ],
  exports: [RedisClient, RedisService],
})
export class RedisModule {}
