import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { jwtConfig } from "../../config/jwt.config";
import { HttpStatus } from "../../utils/http-status.util";

interface JwtPayload {
  id: string;
  username: string;
  iat: number;
  exp: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export function authenticateJWT(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.error(
      HttpStatus.UNAUTHORIZED.code,
      HttpStatus.UNAUTHORIZED.message
    );
  }

  // Expect header: "Bearer <token>"
  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.error(
      HttpStatus.UNAUTHORIZED.code,
      "Format header authorization salah"
    );
  }

  const token = parts[1];
  try {
    const decoded = jwt.verify(
      token,
      jwtConfig.JWT_ACCESS_SECRET
    ) as JwtPayload;
    req.user = decoded;
    next();
  } catch (error: any) {
    return res.error(HttpStatus.FORBIDDEN.code, "Token tidak valid");
  }
}
