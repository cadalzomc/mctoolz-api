import { Injectable } from "@nestjs/common";

@Injectable()
export class HealthService {
  constructor() {}

  GetHome() {
    return "Hello from NestJS!";
  }
}
