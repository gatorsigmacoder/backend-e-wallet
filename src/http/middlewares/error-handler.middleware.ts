import { Request, Response, NextFunction } from "express";
import { HttpStatus } from "../../utils/http-status.util";
import { appConfig } from "../../config/app.config";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error("Unhandled error:", err);
  const status =
    err.statusCode || err.status || HttpStatus.INTERNAL_SERVER_ERROR.code;
  const devMode = appConfig.NODE_ENV === "development";
  let payload: { message: string; stack?: string } = {
    message:
      devMode && typeof err.message === "string"
        ? err.message
        : HttpStatus.INTERNAL_SERVER_ERROR.message,
  };

  // hanya sertakan stack kalau di dev dan err.stack ada
  if (devMode && err.stack) {
    payload.stack = err.stack;
  }

  const stack = devMode && err.stack ? err.stack : {};
  return res.error(status, payload.message, undefined, payload.stack);
}

export function notFoundHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  return res.error(
    HttpStatus.NOT_FOUND.code,
    `Route ${req.method} ${req.originalUrl} not found`
  );
}
