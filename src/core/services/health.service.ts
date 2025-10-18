import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { IConfigApp, IHealth } from "@/lib/models";

import { DbService } from "../services/db.service";

@Injectable()
export class HealthService {
  constructor(
    private db: DbService,
    private readonly config: ConfigService
  ) {}

  GetHealth = async (): Promise<IHealth> => {
    const envApp = this.config.get<IConfigApp>("app");

    let isConnected = false;

    try {
      await this.db.$queryRaw`SELECT 1`;
      isConnected = true;
    } catch {
      isConnected = false;
    }

    return {
      version: envApp!.version,
      name: envApp!.name,
      db: {
        connected: !!isConnected,
        provider: "PostgreSQL",
      },
    };
  };
}
