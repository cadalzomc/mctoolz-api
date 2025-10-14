export interface IJwtValue {
  sub: string;
  username: string;
  role: string;
  exp: number;
  iat: number;
}

export interface IJwtPayload {
  sub: string;
  username: string;
  role: string;
}
