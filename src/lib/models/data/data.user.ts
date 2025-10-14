export interface IUser {
  id: number;
  name?: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  birthdate: Date;
  photo: string;
  created_at: Date;
  updated_at: Date;
  password?: string;
  username?: string;
  role: string;
  status: string;
  provider: string;
  provider_id: string;
}
