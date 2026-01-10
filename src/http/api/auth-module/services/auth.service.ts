import { jwtConfig } from "../../../../config/jwt.config";
import { db } from "../../../../database/client";
import { RegisterDto } from "../dtos/register.dto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  LoginResult,
  RegisResult,
} from "../../../../interfaces/auth.interface";
import { log } from "console";
import { LoginDto } from "../dtos/login.dto";
import { HttpStatus } from "../../../../utils/http-status.util";

export class AuthService {
  async register(payload: RegisterDto): Promise<RegisResult> {
    // Cek apakah email sudah digunakan
    const client = await db.connect();
    try {
      await client.query("BEGIN");
      const { rows: checkUser }: any = await client.query(
        "SELECT users.* FROM users LEFT JOIN profiles ON profiles.user_id = users.id WHERE users.email = $1 OR profiles.phone = $2 LIMIT 1",
        [payload.email, payload.phone]
      );
      if (checkUser.length > 0) {
        await client.query("ROLLBACK");
        return {
          success: false,
          message: "Nomor telephone atau email sudah digunakan",
          code: HttpStatus.BAD_REQUEST.code,
        };
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(payload.password, 10);

      // Simpan user
      const { rows: insertedValue }: any = await client.query(
        "INSERT INTO users (name, email, password, is_active) VALUES ($1, $2, $3, $4) RETURNING *",
        [payload.name, payload.email, hashedPassword, 1]
      );

      await client.query(
        "INSERT INTO profiles (user_id, phone, address, bio) VALUES ($1, $2, $3, $4)",
        [insertedValue[0].id, payload.phone, payload.address, payload.bio]
      );

      await client.query(
        "INSERT INTO e_wallets (user_id, balance) VALUES ($1, $2)",
        [insertedValue[0].id, 0.0]
      );

      await client.query("COMMIT");
      const data = {
        email: payload.email,
        name: payload.name,
      };
      return {
        success: true,
        message: HttpStatus.CREATED.message,
        code: HttpStatus.CREATED.code,
        data,
      };
    } catch (error: any) {
      await client.query("ROLLBACK");
      return {
        success: false,
        message: error.message || HttpStatus.INTERNAL_SERVER_ERROR.message,
        code: HttpStatus.INTERNAL_SERVER_ERROR.code,
      };
    } finally {
      await client.release();
    }
  }

  async login(payload: LoginDto): Promise<LoginResult> {
    try {
      const { email, password } = payload;

      const { rows }: any = await db.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
      );

      if (!rows[0]) {
        return {
          success: false,
          code: 401,
          message: "Invalid credentials",
        };
      }

      const passwordValid = await bcrypt.compare(password, rows[0].password);
      if (!passwordValid) {
        return {
          success: false,
          code: 401,
          message: "Invalid credentials",
        };
      }

      const accessPayload = {
        id: rows[0].id,
        email: rows[0].email,
        username: rows[0].username,
      };

      log(jwtConfig.JWT_ACCESS_EXPIRES_IN);
      const accessToken = jwt.sign(accessPayload, jwtConfig.JWT_ACCESS_SECRET, {
        expiresIn: jwtConfig.JWT_ACCESS_EXPIRES_IN,
      });

      return {
        success: true,
        code: 200,
        message: "Login berhasil",
        data: {
          access_token: accessToken,
        },
      };
    } catch (error: any) {
      return {
        success: false,
        code: 500,
        message: error.message || "Internal server error",
      };
    }
  }
}
