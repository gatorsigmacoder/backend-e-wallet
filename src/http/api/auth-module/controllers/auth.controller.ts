import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { RegisterSchema } from "../dtos/register.dto";
import { HttpStatus } from "../../../../utils/http-status.util";
import { getZodError } from "../../../../utils/request.util";
import { LoginSchema } from "../dtos/login.dto";

const authService = new AuthService();

export class AuthController {
  async register(req: Request, res: Response) {
    const validate = RegisterSchema.safeParse(req.body);

    if (!validate.success) {
      const errors = getZodError(validate.error);

      return res.error(
        HttpStatus.BAD_REQUEST.code,
        HttpStatus.BAD_REQUEST.message,
        errors
      );
    }

    const parsedBody = validate.data;

    const user = await authService.register(parsedBody);

    if (!user.success) {
      return res.error(
        user.code || HttpStatus.INTERNAL_SERVER_ERROR.code,
        user.message || HttpStatus.INTERNAL_SERVER_ERROR.message
      );
    }

    return res.success(
      HttpStatus.CREATED.code,
      HttpStatus.CREATED.message,
      user.data
    );
  }

  async login(req: Request, res: Response) {
    const validate = LoginSchema.safeParse(req.body);

    if (!validate.success) {
      const errors = getZodError(validate.error);

      return res.error(
        HttpStatus.BAD_REQUEST.code,
        HttpStatus.BAD_REQUEST.message,
        errors
      );
    }

    const parsedBody = validate.data;

    const result = await authService.login(parsedBody);

    if (!result.success) {
      return res.error(
        HttpStatus.fromCode(result.code)?.code ?? HttpStatus.BAD_REQUEST.code,
        result.message
      );
    }

    return res.success(HttpStatus.OK.code, HttpStatus.OK.message, result.data);
  }
}
