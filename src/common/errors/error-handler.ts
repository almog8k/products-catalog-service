import * as Http from "http";
import { StatusCodes } from "http-status-codes";
import { logger } from "../logger/logger-wrapper";
import { AppErrorResponse } from "../middlewares/error-handling-midleware";
import { AppError, HttpErrorCodeMapper } from "./error-types";

class ErrorHandler {
  private httpServerRef: Http.Server;

  public listenToErrorEvents(httpServer: Http.Server) {
    this.httpServerRef = httpServer;

    process.on("uncaughtException", async (error: Error) => {
      logger.error({ msg: error.message });
    });

    process.on("unhandledRejection", async (reason: Error) => {
      logger.error({ msg: reason.message });
    });

    process.on("SIGTERM", async () => {
      logger.error({
        msg: "App received SIGTERM event, try to gracefully close the server",
      });
      await this.terminateHttpServerAndExit();
    });

    process.on("SIGINT", async () => {
      logger.error({
        msg: "App received SIGINT event, try to gracefully close the server",
      });
      await this.terminateHttpServerAndExit();
    });
  }

  public handleError(
    error: Error | AppError,
    response: AppErrorResponse
  ): void {
    if (this.isTrustedError(error) && response !== undefined) {
      this.handleTrustedError(error as AppError, response);
    } else {
      this.handleCriticalError(error, response);
    }
  }

  private handleTrustedError(
    error: AppError,
    response: AppErrorResponse
  ): void {
    const responseStatusCode = HttpErrorCodeMapper(error);
    response.status(responseStatusCode).json({ message: error.message });
  }

  private handleCriticalError(
    error: Error | AppError,
    response?: AppErrorResponse
  ): void {
    logger.error({ msg: error.message, metadata: error });
    if (response !== undefined) {
      response
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ message: "Internal server error" });
    }

    this.terminateHttpServerAndExit();
  }

  private isTrustedError(error: Error | AppError): boolean {
    if (error instanceof AppError) {
      return error.isTrusted;
    }
    return false;
  }

  private async terminateHttpServerAndExit(): Promise<void> {
    logger.error({ msg: "Gracefully closing the server" });
    if (this.httpServerRef !== undefined) {
      await this.httpServerRef.close();
    }
    process.exit(1);
  }
}

export const errorHandler = new ErrorHandler();
