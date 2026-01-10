// src/utils/response.util.ts

import { ApiResponse } from "../interfaces/api.interface";

export function successResponse<T, M>(
  status_code: number,
  message: string,
  data?: T,
  meta_data?: M
): ApiResponse<T, M> {
  return {
    status_code,
    success: true,
    message,
    data,
    meta_data,
  };
}

export function errorResponse(
  status_code: number,
  message: string,
  error?: any,
  stack?: string
): ApiResponse<null, null> {
  return {
    status_code,
    success: false,
    message,
    error,
    stack,
  };
}
