type OTPMode = "numbers" | "chars" | "alphanumeric";
interface OTPOptions {
  mode?: OTPMode;
  length?: number;
  expiresInMinutes?: number;
}

export const GenOTP = (options: OTPOptions = {}) => {
  const { mode = "numbers", length = 6, expiresInMinutes = 5 } = options;

  let charset: string;
  const numbers = "0123456789";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxy";

  switch (mode) {
    case "chars":
      charset = characters;
      break;
    case "alphanumeric":
      charset = `${characters}${numbers}`;
      break;

    default:
      charset = numbers;
  }

  const value = Array.from(
    { length },
    () => charset[Math.floor(Math.random() * charset.length)]
  ).join("");

  const expiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1000);

  return {
    value,
    expiresAt,
  };
};
