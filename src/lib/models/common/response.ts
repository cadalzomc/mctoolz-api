import { TResponseCode } from "@/types/global";

export interface IResponseMeta {
  total: number;
  page: number;
  lastPage: number;
}

export interface IResponse<T> {
  code: TResponseCode;
  message: string;
  data?: T;
  meta?: IResponseMeta;
}
