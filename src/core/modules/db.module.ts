import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { DBService } from "../services/db.service";

@Module({
  imports: [ConfigModule],
  providers: [DBService],
  exports: [DBService],
})
export class DBModule {}
