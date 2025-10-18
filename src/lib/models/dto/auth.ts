import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

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
