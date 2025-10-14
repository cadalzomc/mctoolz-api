import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { HealthController } from "../controllers/health.controller";
import { HealthService } from "../services/health.service";

@Module({
  imports: [ConfigModule],
  providers: [HealthService],
  controllers: [HealthController],
})
export class HealthModule {}
