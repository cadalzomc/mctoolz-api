import "dotenv/config";

export const EnvConfig = () => ({
  app: {
    version: process.env.APP_VERSION || "0.0.1",
    name: process.env.APP_NAME || "",
    port: Number(process.env.APP_PORT || "3500"),
    host: process.env.APP_HOST || "http://localhost:3000",
    key: process.env.APP_KEY || "",
  },
  database: {
    url: process.env.SUPABASE_URL || "",
    key: process.env.SUPABASE_KEY || "",
  },
  jwt: {
    secret: process.env.JWT_SECRET || "",
    expiry: process.env.JWT_EXPIRY || "8h",
  },
  frontend: {
    admin: process.env.WEB_ADMIN || "http://localhost:3000",
    customer: process.env.WEB_CUSTOMER || "http://localhost:3000",
  },
  mailer: {
    service: process.env.MAILER_SERVICE || "gmail",
    sender: {
      name: process.env.MAILER_SENDER || "",
      username: process.env.MAILER_USERNAME || "",
      password: process.env.MAILER_PASSWORD || "",
    },
    debug: process.env.MAILER_DEBUG === "1",
  },
  redis: {
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: Number(process.env.REDIS_PORT || "6379"),
    username: process.env.REDIS_USERNAME || "",
    password: process.env.REDIS_PASSWORD || "",
  },
});
