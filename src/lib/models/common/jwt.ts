export interface IJwtValue {
  sub: string;
  email: string;
  role: string;
  exp: number;
  iat: number;
}

export interface IJwtPayload {
  sub: string;
  email: string;
  role: string;
}
