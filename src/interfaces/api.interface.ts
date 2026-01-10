export interface ApiResponse<T = any, M = any> {
  status_code: number;
  success: boolean;
  message: string;
  data?: T;
  error?: any;
  meta_data?: M;
  stack?: string;
}
