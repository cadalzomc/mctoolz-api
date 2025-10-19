import { OnWorkerEvent, Processor, WorkerHost } from "@nestjs/bullmq";
import { Logger } from "@nestjs/common";
import { Job } from "bullmq";

import { MailerQueues } from "@/lib/common";
import { IMail } from "@/lib/models";

import { MailerService } from "../services/mailer.service";

@Processor(MailerQueues, { concurrency: 3 })
export class MailerWorker extends WorkerHost {
  private readonly logger = new Logger(MailerWorker.name);

  constructor(private readonly mail: MailerService) {
    super();
  }

  async process(job: Job<IMail, any, string>) {
    if (job.name === "Mailer") {
      await this.SendMail(job);
    }
  }

  private SendMail = async (job: Job<IMail, any, string>) => {
    const { data } = job;
    await this.mail.Send(data);
  };

  @OnWorkerEvent("active")
  onActive(job: Job<IMail, any, string>) {
    const env = job.data.to.map((r) => ({ email: r.address })).map((e) => e.email);
    this.logger.log(`${job.name}:[${job.id}] emails:${env.join(",")} is in process...`);
  }

  @OnWorkerEvent("completed")
  onCompleted(job: Job<IMail, any, string>) {
    const env = job.data.to.map((r) => ({ email: r.address })).map((e) => e.email);
    this.logger.log(`${job.name}:[${job.id}] emails:${env.join(",")} Completed.`);
  }

  @OnWorkerEvent("failed")
  onFailed(job: Job<IMail, any, string>, error: Error) {
    const env = job.data.to.map((r) => ({ email: r.address })).map((e) => e.email);
    this.logger.error(`${job.name}:[${job.id}] emails:${env.join(",")} Failed: ${error.message}`);
  }
}
