// src/middlewares/response.middleware.ts

import { Request, Response, NextFunction } from "express";
import { errorResponse, successResponse } from "../../utils/response.util";

declare global {
  namespace Express {
    interface Response {
      success: <T, M = any>(
        status_code: number,
        message: string,
        data?: T,
        meta?: M
      ) => void;
      error: (
        status_code: number,
        message: string,
        error?: any,
        stack?: string
      ) => void;
    }
  }
}

export function responseHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.success = function <T, M = any>(
    status_code: number,
    message: string,
    data?: T,
    meta?: M
  ) {
    return res
      .status(status_code)
      .json(successResponse(status_code, message, data, meta));
  };

  res.error = function (
    status_code: number,
    message: string,
    error?: any,
    stack?: string
  ) {
    // bisa juga set status code berdasarkan jenis error
    return res
      .status(status_code)
      .json(errorResponse(status_code, message, error, stack));
  };

  next();
}
