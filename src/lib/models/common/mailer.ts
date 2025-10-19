export interface IMailAddress {
  name: string;
  address: string;
}

export interface IMailAttachment {
  filename: string;
  content: File;
}

export interface IMail {
  to: IMailAddress[];
  subject: string;
  html: string;
  attachments?: IMailAttachment[];
}

export interface IMailerAuth {
  username: string;
  password: string;
}

export interface IMailerOptionDefault {
  from?: string;
}

export interface IMailerTransport {
  service?: string;
  host?: string;
  port?: number;
  secure?: boolean;
  auth: IMailerAuth;
  defaults?: IMailerOptionDefault;
}

export interface IMailerOption {
  transport: IMailerTransport;
  defaults?: {
    from?: string;
  };
  debug: boolean;
}
