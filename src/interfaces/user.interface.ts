export interface UserWithProfile {
  id: string;
  name: string;
  profile: {
    bio: string;
  };
}
export interface GetAllUserResultSuccess {
  success: true;
  code: number;
  message: string;
  data: UserWithProfile[];
}

export interface GetAllUserResultError {
  success: false;
  code: number;
  message: string;
  error?: any;
}

export type GetAllUserResult = GetAllUserResultSuccess | GetAllUserResultError;
