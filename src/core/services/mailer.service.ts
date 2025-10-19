import { Inject, Injectable, Logger } from "@nestjs/common";
import * as nodemailer from "nodemailer";

import { MailerOptions } from "@/lib/common";
import { IMail, type IMailerOption, IResponse } from "@/lib/models";

@Injectable()
export class MailerService {
  private readonly logger = new Logger(MailerService.name);
  private transporter: nodemailer.Transporter;

  constructor(@Inject(MailerOptions) private options: IMailerOption) {
    this.transporter = nodemailer.createTransport({
      service: options.transport.service,
      auth: {
        user: options.transport.auth.email,
        pass: options.transport.auth.password,
      },
      debug: options.debug,
      logger: options.debug,
      connectionTimeout: 1000 * 15,
      socketTimeout: 1000 * 15,
    });
  }

  async Send(body: IMail): Promise<IResponse<undefined>> {
    const mailerFrom = this.options.defaults?.from;
    try {
      await this.transporter.sendMail({
        from: mailerFrom,
        to: body.to,
        subject: body.subject,
        html: body.html,
      });
      return {
        code: "Success",
        message: "Sent",
      };
    } catch (err) {
      this.logger.error({ action: "Mail-Sending", err });
      return {
        code: "Error",
        message: `Something went wrong`,
      };
    }
  }
}
