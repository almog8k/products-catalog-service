import { StatusCodes } from "http-status-codes";

export class AppError extends Error {
  constructor(
    public name: string,
    public message: string,
    public isTrusted = true
  ) {
    super(message);
  }
}

export class InvalidInputError extends AppError {
  constructor(public message: string) {
    super("Invalid Input Error", message);
  }
}

export class ResourceNotFoundError extends AppError {
  constructor(public message: string) {
    super("Resource not Found Error", message);
  }
}

export class ResourceExistsError extends AppError {
  constructor(public message: string) {
    super("Resource Already Exists Error", message);
  }
}

export class DBConnectionError extends AppError {
  constructor(public message: string, public isTrusted) {
    super("DB Connection Error", message, isTrusted);
  }
}

export const HttpErrorCodeMapper = (err: AppError): StatusCodes => {
  if (err instanceof InvalidInputError) {
    return StatusCodes.BAD_REQUEST;
  }
  if (err instanceof ResourceNotFoundError) {
    return StatusCodes.NOT_FOUND;
  }

  return StatusCodes.INTERNAL_SERVER_ERROR;
};
