import { InjectQueue } from "@nestjs/bullmq";
import { Injectable, Logger } from "@nestjs/common";
import { Queue } from "bullmq";

import { MailerQueues } from "@/lib/common";
import { IMail } from "@/lib/models";

@Injectable()
export class QueueService {
  private readonly logger = new Logger(QueueService.name);

  constructor(@InjectQueue(MailerQueues) private queueMailbox: Queue) {}

  async AddMails(payload: IMail[]) {
    const jobs = payload.map((e) => ({
      name: "Mailer",
      data: e,
      opts: {
        attempts: 2,
        backoff: { type: "exponential", delay: 3000 },
        removeOnComplete: true,
        removeOnFail: true,
      },
    }));
    await this.queueMailbox.addBulk(jobs);
  }

  async addMail(payload: IMail) {
    await this.queueMailbox.add("Mailer", payload, {
      attempts: 2,
      backoff: { type: "exponential", delay: 3000 },
      removeOnComplete: true,
      removeOnFail: true,
    });
  }
}
