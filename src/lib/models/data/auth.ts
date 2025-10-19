export interface IAuthResponse {
  id: number;
  token: string;
  expiredAt: Date;
  role: string;
}
