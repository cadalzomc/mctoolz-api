import { DynamicModule, Global, Module } from "@nestjs/common";

import { MailerOptions } from "@/lib/common";
import { IMailerOption } from "@/lib/models";

import { MailerService } from "../services/mailer.service";

import type { FactoryProvider, ModuleMetadata } from "@nestjs/common";

interface IMailerModuleAsyncOptions extends Pick<ModuleMetadata, "imports"> {
  useFactory: (...args: any[]) => Promise<IMailerOption> | IMailerOption;
  inject?: FactoryProvider["inject"];
}

@Global()
@Module({
  providers: [MailerService],
  exports: [MailerService],
})
export class MailerModule {
  static forRootAsync(options: IMailerModuleAsyncOptions): DynamicModule {
    return {
      module: MailerModule,
      imports: options.imports,
      providers: [
        {
          provide: MailerOptions,
          useFactory: options.useFactory,
          inject: options.inject,
        },
        {
          provide: MailerService,
          useFactory: (opts: IMailerOption) => new MailerService(opts),
          inject: [MailerOptions] as const,
        },
      ],
      exports: [MailerService, MailerOptions],
    };
  }
}
