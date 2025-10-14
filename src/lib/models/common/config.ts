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
