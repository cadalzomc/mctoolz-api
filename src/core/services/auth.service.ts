import { Injectable, Logger } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";

import { GenOTP, GetTemplate, TemplateHeader } from "@/lib/common";
import {
  DtoLogin,
  DtoRegister,
  IAuthResponse,
  IJwtPayload,
  IJwtValue,
  IMail,
  IResponse,
} from "@/lib/models";

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

  Login = async (payload: DtoLogin): Promise<IResponse<IAuthResponse>> => {
    try {
      const existingUser = await this.db.user.findUnique({
        where: {
          email: payload.email,
        },
      });

      if (!existingUser) {
        return {
          code: "NotFound",
          message: "Email does not exist. Please try again",
        };
      }

      if (existingUser.status === "LOCKED") {
        return {
          code: "Locked",
          message: "Account is locked. Please contact support",
        };
      }

      const isMatch = await bcrypt.compare(payload.password, existingUser.password);

      if (!isMatch) {
        return {
          code: "Invalid",
          message: "Invalid password. Please try again",
        };
      }

      const jwtPayload: IJwtPayload = {
        sub: existingUser.id.toString(),
        email: existingUser.email,
        role: existingUser.role as string,
      };

      const token = this.jwt.sign(jwtPayload);
      const value = this.jwt.verify<IJwtValue>(token);
      const expiredAt = new Date(value.exp * 1000);

      return {
        code: "Success",
        message: "Authorized",
        data: {
          id: existingUser.id,
          token,
          expiredAt,
          role: existingUser.role,
        },
      };
    } catch (err) {
      this.logger.error({ action: "Login", err });
      return {
        code: "Error",
        message: "Something went wrong",
      };
    }
  };

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

  Resend = async (email: string): Promise<IResponse<undefined>> => {
    try {
      const existingUser = await this.db.user.findFirst({
        where: {
          email,
        },
      });

      if (!existingUser) {
        return {
          code: "NotFound",
          message: "Email does not exists",
        };
      }

      const otp = GenOTP();

      await this.db.token.deleteMany({
        where: { owner: email },
      });

      await this.db.token.create({
        data: {
          type: "OTP",
          token: otp.value,
          expiresAt: otp.expiresAt,
          owner: email,
          purpose: "Resend: Account verification",
        },
      });

      const html = GetTemplate("register", {
        header: { ...TemplateHeader },
        data: {
          otp: otp.value,
          name: existingUser.name,
        },
      });

      const mail: IMail = {
        to: [{ name: existingUser.name, address: email }],
        subject: "MCToolz Account Verification",
        html,
      };

      await this.queues.addMail(mail);

      return {
        code: "Success",
        message: `A new verification code is sent to ${email}`,
      };
    } catch (err) {
      this.logger.error({ action: "Resend", err });
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
          message: "Invalid token. Please try again",
        };
      }

      if (existingToken.expiresAt < now) {
        return {
          code: "Expired",
          message: "Token has expired. Try resend code",
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
