export interface IConfigApp {
  version: string;
  name: string;
  port: number;
  host: string;
  key: string;
}

export interface IConfigDb {
  url: string;
  key: string;
}

export interface IConfigJwt {
  secret: string;
  expiry: "4h" | "8h" | "12" | "24h";
}

export interface IConfigSender {
  name: string;
  username: string;
  password: string;
}

export interface IConfigMailer {
  service: string;
  sender: IConfigSender;
  debug: boolean;
}

export interface IConfigFrontend {
  admin: string;
  customer: string;
}

export interface IConfigRedis {
  host: string;
  port: number;
  username: string;
  password: string;
  isTls?: boolean;
}
