import { Injectable, Logger } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";

import { DtoRegister, IResponse } from "@/lib/models";

import { DbService } from "./db.service";

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private db: DbService,
    private jwt: JwtService
  ) {}

  Register = async (payload: DtoRegister): Promise<IResponse<undefined>> => {
    try {
      const existingUser = await this.db.user.findFirst({
        where: {
          email: payload.email,
        },
      });

      if (existingUser) {
        return {
          code: "Duplicate",
          message: "Email is already in registered.",
        };
      }

      const password = await bcrypt.hash(payload.password, 10);

      await this.db.$transaction(async (tx) => {
        const user = await tx.user.create({
          data: {
            name: payload.name,
            email: payload.email,
            password,
            role: "GUEST",
          },
        });

        await tx.profile.create({
          data: {
            userId: user.id,
            name: payload.name,
            email: payload.email,
            status: "INACTIVE",
            createdAt: new Date(),
          },
        });
      });

      return {
        code: "Success",
        message: `A verification code is sent to ${payload.email}`,
      };
    } catch (error) {
      this.logger.error({ action: "Register", error });
      return {
        code: "Error",
        message: "Something went wrong",
      };
    }
  };
}
