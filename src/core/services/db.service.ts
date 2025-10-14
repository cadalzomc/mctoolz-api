import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

import { IConfigDb } from "@/lib/models/common";

@Injectable()
export class DBService {
  constructor(private readonly config: ConfigService) {}

  GetClient(): SupabaseClient {
    const dbConfig = this.config.get<IConfigDb>("database")!;

    const supabase = createClient(dbConfig.url, dbConfig.key);
    return supabase;
  }
}
