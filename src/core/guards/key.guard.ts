import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Request } from "express";

@Injectable()
export class KeyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request>();
    const key = req.headers["x-niftyers"];
    if (key !== process.env.APP_KEY) {
      throw new ForbiddenException("Request is not allowed. Contact niftyers for access");
    }
    return true;
  }
}
