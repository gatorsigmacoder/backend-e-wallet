import { db } from "../../../../database/client";
import { GetAllUserResult } from "../../../../interfaces/user.interface";
import { HttpStatus } from "../../../../utils/http-status.util";

export class UserService {
  async getAll(): Promise<GetAllUserResult> {
    try {
      const { rows }: any = await db.query(
        "SELECT users.id, users.name, profiles.bio FROM users LEFT JOIN profiles ON users.id = profiles.user_id"
      );
      const formatted = rows.map(
        (user: { id: string; name: string; bio: string }) => ({
          id: user.id,
          name: user.name,
          profile: user.bio ? { bio: user.bio } : null,
        })
      );
      return {
        code: HttpStatus.OK.code,
        success: true,
        message: HttpStatus.OK.message,
        data: formatted,
      };
    } catch (error: any) {
      return {
        code: HttpStatus.INTERNAL_SERVER_ERROR.code,
        success: false,
        message: error.message,
      };
    }
  }
}
