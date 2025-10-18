export interface IHealthDatabase {
  connected: boolean;
  provider: string;
}

export interface IHealth {
  name: string;
  version: string;
  db: IHealthDatabase;
}
