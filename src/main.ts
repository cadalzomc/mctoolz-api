import { join } from "path";

import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import cookieParser from "cookie-parser";

import { AppModule } from "./app.module";
import { MulterExceptionFilter, ValidationExceptionFactory } from "./lib/extensions/exception";
import { RouteLogger } from "./lib/extensions/logger";

async function bootstrap() {
  const appPrefix = process.env.APP_NAME || "Shelfpoints";
  const corsOrigin = process.env.APP_CORS || "http://localhost:3355";

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
    cors: {
      origin: corsOrigin,
      credentials: true,
      allowedHeaders: ["Content-Type", "X-Niftyers", "Authorization"],
    },
    logger: new RouteLogger(appPrefix, { timestamp: false }),
  });

  app.set("trust proxy", 1);
  app.use(cookieParser());

  app.useStaticAssets(join(__dirname, "..", "public", "assets"), {
    prefix: "/assets",
    maxAge: "30d",
    immutable: true,
  });

  app.useStaticAssets(join(__dirname, "public/uploads"), {
    prefix: "/uploads/",
    maxAge: "1d",
    etag: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      stopAtFirstError: true,
      exceptionFactory: ValidationExceptionFactory,
    })
  );

  app.useGlobalFilters(new MulterExceptionFilter());

  const port = Number(process.env.APP_PORT) || 3000;
  await app.listen(port);
}

void bootstrap();
