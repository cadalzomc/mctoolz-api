import "dotenv/config";

export const EnvConfig = () => ({
  app: {
    version: process.env.APP_VERSION || "0.0.1",
    name: process.env.APP_NAME || "",
    port: Number(process.env.APP_PORT || "7700"),
    host: process.env.APP_HOST || "",
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
});
