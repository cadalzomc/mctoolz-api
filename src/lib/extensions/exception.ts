import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpStatus,
  ValidationError,
} from "@nestjs/common";
import { Response } from "express";
import { MulterError } from "multer";

export function ValidationExceptionFactory(errors: ValidationError[]): BadRequestException {
  const message: Record<string, string> = errors.reduce(
    (acc, err) => {
      const field: string = err.property;
      const constraints: string[] = Object.values(err.constraints ?? {});
      acc[field] = constraints.join(", ");
      return acc;
    },
    {} as Record<string, string>
  );
  return new BadRequestException({
    code: "Error",
    message: "Validation failed",
    data: message,
  });
}

@Catch(MulterError)
export class MulterExceptionFilter implements ExceptionFilter {
  catch(exception: MulterError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    response.status(HttpStatus.BAD_REQUEST).json({
      code: "Error",
      message: exception.message,
    });
  }
}
