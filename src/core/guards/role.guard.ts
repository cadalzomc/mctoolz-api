import { ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

import { IJwtPayload } from "@/lib/models";
import { TRole } from "@/types/global";

interface IAuthRequest extends Express.Request {
  user: IJwtPayload;
}

@Injectable()
export class RoleGuard extends AuthGuard("jwt") {
  private roles: TRole[] = [];

  setRoles(roles: TRole[]): this {
    this.roles = roles;
    return this;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const canActivate = await super.canActivate(context);
    if (!canActivate) {
      return false;
    }

    if (!this.roles || this.roles.length === 0) {
      return true;
    }

    const req = context.switchToHttp().getRequest<IAuthRequest>();
    const user = req.user;
    const isMatch = this.roles.includes(user.role as TRole);

    if (!isMatch) {
      throw new ForbiddenException("You do not have permission to access this feature");
    }

    return true;
  }

  static All(...roles: TRole[]): RoleGuard {
    return new RoleGuard().setRoles(roles);
  }
}
