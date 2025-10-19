import { BullModule } from "@nestjs/bullmq";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { MailerQueues } from "@/lib/common";
import { IConfigRedis } from "@/lib/models";

import { QueueService } from "../services/queue.service";
import { MailerWorker } from "../workers/mailer.worker";

@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (cs: ConfigService) => {
        const cn = cs.get<IConfigRedis>("redis");
        return {
          connection: {
            host: cn?.host,
            port: cn?.port,
            username: cn?.username,
            password: cn?.password,
            ...(cn?.isTls ? { tls: {} } : {}),
          },
        };
      },
      inject: [ConfigService],
    }),
    BullModule.registerQueue({
      name: MailerQueues,
    }),
  ],
  providers: [QueueService, MailerWorker],
  exports: [QueueService, MailerWorker],
})
export class QueueModule {}
