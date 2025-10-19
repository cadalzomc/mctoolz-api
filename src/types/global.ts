export type TResponseCode =
  | "Success"
  | "Expired"
  | "Failed"
  | "Error"
  | "Duplicate"
  | "NotFound"
  | "Forbidden"
  | "Locked"
  | "Unauthorized"
  | "Disabled"
  | "Invalid";

export type TRole = "SUPER" | "ADMIN" | "GUEST";

export type TTemplateName = "register";
