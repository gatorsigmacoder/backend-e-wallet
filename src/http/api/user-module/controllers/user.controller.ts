import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { HttpStatus } from "../../../../utils/http-status.util";

const userService = new UserService();
export class UserController {
  async getAllUser(req: Request, res: Response) {
    const result = await userService.getAll();
    if (!result.success) {
      return res.error(
        result.code || HttpStatus.INTERNAL_SERVER_ERROR.code,
        result.message || HttpStatus.INTERNAL_SERVER_ERROR.message
      );
    }
    return res.success(HttpStatus.OK.code, HttpStatus.OK.message, result.data);
  }
}
