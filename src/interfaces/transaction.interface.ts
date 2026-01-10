export interface TopUpResultSuccess {
  success: true;
  code: number;
  message: string;
}

export interface TopUpResultError {
  success: false;
  code: number;
  message: string;
  error?: any;
}

export type TopUpResult = TopUpResultSuccess | TopUpResultError;

export interface TransferResultSuccess {
  success: true;
  code: number;
  message: string;
}

export interface TransferResultError {
  success: false;
  code: number;
  message: string;
  error?: any;
}

export type TransferResult = TransferResultSuccess | TransferResultError;
