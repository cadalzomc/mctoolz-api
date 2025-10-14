import { Injectable } from "@nestjs/common";

import { IResponse } from "@/lib/models/common";
import { IUser } from "@/lib/models/data";

import { DBService } from "./db.service";

@Injectable()
export class UserService {
  constructor(private service: DBService) {}

  async getUserById(id: string) {
    const res: IResponse<IUser> = {
      code: "Failed",
      message: "Something went wrong",
    };

    try {
      const { data, error } = await this.service
        .GetClient()
        .from("users")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) {
        res.message = `Something went wrong: ${error?.message}`;
        return res;
      }

      if (!data) {
        res.message = "FAILED: User not found";
        return res;
      }

      res.data = data;
      res.code = "Success";
      res.message = "User found";

      return res;
    } catch (error) {
      console.log(error);
      res.message = "Something went wrong";
    }
  }
}
