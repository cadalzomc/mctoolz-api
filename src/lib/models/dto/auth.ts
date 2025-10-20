import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class DtoLogin {
  @IsEmail({}, { message: "Invalid email format" })
  @IsNotEmpty({ message: "Email is required" })
  email!: string;

  @IsString({ message: "Password must be a string" })
  @IsNotEmpty({ message: "Password is required" })
  @MinLength(5, { message: "Password must be at least 6 characters long" })
  password!: string;
}

export class DtoRegister {
  @IsString({ message: "Must be a string" })
  @IsNotEmpty({ message: "Required" })
  name!: string;

  @IsEmail({}, { message: "Invalid email format" })
  @IsNotEmpty({ message: "Required" })
  email!: string;

  @MaxLength(35, { message: "Maximum of 35 characters" })
  @MinLength(6, { message: "Minimum of 5 characters" })
  @IsString({ message: "Must be a string" })
  @IsNotEmpty({ message: "Required" })
  password!: string;

  @IsOptional()
  @IsString()
  passwordConfirm?: string;
}

export class DtoResend {
  @IsEmail({}, { message: "Invalid email format" })
  @IsNotEmpty({ message: "Email is required" })
  email!: string;
}

export class DtoVerify {
  @IsEmail({}, { message: "Invalid email format" })
  @IsNotEmpty({ message: "Email is required" })
  email!: string;

  @IsString({ message: "Must be a string" })
  @IsNotEmpty({ message: "Required" })
  token!: string;
}
