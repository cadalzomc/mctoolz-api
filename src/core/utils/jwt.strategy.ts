import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

import { IConfigJwt, IJwtValue } from "@/lib/models";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(cs: ConfigService) {
    const cm = cs.get<IConfigJwt>("jwt");
    const secret = cm ? cm.secret : "";
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  validate(value: IJwtValue) {
    return { sub: value.sub, username: value.username, role: value.role };
  }
}
