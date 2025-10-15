import { Controller, Get } from "@nestjs/common";

import { HealthService } from "../services/health.service";

@Controller("health")
export class HealthController {
  constructor(private readonly service: HealthService) {}

  @Get()
  getHome() {
    return this.service.GetHome();
  }
}
