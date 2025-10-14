import { join } from "path";

import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";

import { AppModule } from "./app.module";
import { ValidationExceptionFactory } from "./lib/extensions/exception";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
    cors: {
      origin: process.env.CORS_ORIGIN || "*",
      credentials: true,
      allowedHeaders: ["Content-Type", "X-Niftyers", "Authorization"],
    },
  });

  app.setGlobalPrefix("api");
  app.set("trust proxy", 1);

  app.useStaticAssets(join(__dirname, "..", "public", "assets"), {
    prefix: "/assets",
    maxAge: "30d",
    immutable: true,
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

  const port = Number(process.env.APP_PORT) || 3000;
  await app.listen(port);
}

void bootstrap();
