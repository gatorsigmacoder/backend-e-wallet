export interface LoginResultSuccess {
  success: true;
  code: number;
  message: string;
  data: {
    access_token: string;
  };
}

export interface LoginResultError {
  success: false;
  code: number;
  message: string;
  error?: any;
}

export type LoginResult = LoginResultSuccess | LoginResultError;

export interface RegisResultSuccess {
  success: true;
  code: number;
  message: string;
  data: {
    id?: string;
    name: string;
    email: string;
  };
}

export interface RegisResultError {
  success: false;
  code: number;
  message: string;
  error?: any;
}

export type RegisResult = RegisResultSuccess | RegisResultError;
