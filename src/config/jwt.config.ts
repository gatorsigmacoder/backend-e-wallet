import dotenv from "dotenv";
dotenv.config();

export const jwtConfig = {
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || "itssecret",
  JWT_ACCESS_EXPIRES_IN: Number(process.env.JWT_ACCESS_EXPIRES_IN || 60),
};
