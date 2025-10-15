export type TResponseCode =
  | "Success"
  | "Failed"
  | "Error"
  | "Duplicate"
  | "NotFound"
  | "Forbidden"
  | "Locked"
  | "Unauthorized"
  | "Disabled"
  | "Invalid";

export type TRole = "SUPER" | "ADMIN" | "MANAGER" | "CASHIER" | "CONSIGNOR" | "CONSIGNEE";
