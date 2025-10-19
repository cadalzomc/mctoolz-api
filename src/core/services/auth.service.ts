import { Injectable, Logger } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";

import { GenOTP, GetTemplate, TemplateHeader } from "@/lib/common";
import { DtoRegister, IAuthResponse, IJwtPayload, IJwtValue, IMail, IResponse } from "@/lib/models";

import { DbService } from "./db.service";
import { QueueService } from "./queue.service";

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private db: DbService,
    private jwt: JwtService,
    private readonly queues: QueueService
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
      const otp = GenOTP();

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

        await tx.token.create({
          data: {
            type: "OTP",
            token: otp.value,
            expiresAt: otp.expiresAt,
            owner: payload.email,
            purpose: "Account verification",
          },
        });
      });

      const html = GetTemplate("register", {
        header: { ...TemplateHeader },
        data: {
          otp: otp.value,
          name: payload.name,
        },
      });

      const mail: IMail = {
        to: [{ name: payload.name, address: payload.email }],
        subject: "MCToolz Account Verification",
        html,
      };

      await this.queues.addMail(mail);

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

  Verify = async (email: string, token: string): Promise<IResponse<IAuthResponse>> => {
    try {
      const username = email.toLowerCase();
      const now = new Date();

      const existingToken = await this.db.token.findFirst({
        where: {
          owner: username,
          token: token,
        },
      });

      if (!existingToken) {
        return {
          code: "Invalid",
          message: "Invalid token",
        };
      }

      if (existingToken.expiresAt < now) {
        return {
          code: "Expired",
          message: "Token has expired",
        };
      }

      const user = await this.db.user.findUnique({
        where: { email },
      });

      if (!user) {
        return {
          code: "NotFound",
          message: "Account not found",
        };
      }

      await this.db.$transaction(async (tx) => {
        await Promise.all([
          tx.token.deleteMany({ where: { owner: username } }),
          tx.user.update({
            where: { email },
            data: { status: "ACTIVE" },
          }),
          tx.profile.update({
            where: { userId: user.id },
            data: { status: "ACTIVE" },
          }),
        ]);
      });

      const jwtPayload: IJwtPayload = {
        sub: user.id.toString(),
        email: user.email,
        role: user.role as string,
      };

      const loginToken = this.jwt.sign(jwtPayload);
      const value = this.jwt.verify<IJwtValue>(loginToken);
      const expiredAt = new Date(value.exp * 1000);

      return {
        code: "Success",
        message: "Verified",
        data: {
          id: user.id,
          token: loginToken,
          expiredAt,
          role: user.role,
        },
      };
    } catch (err) {
      this.logger.error({ action: "Verify", err });
      return {
        code: "Error",
        message: "Something went wrong",
      };
    }
  };
}
