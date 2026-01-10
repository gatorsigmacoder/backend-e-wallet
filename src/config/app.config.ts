import dotenv from "dotenv";
dotenv.config();

export const appConfig = {
  APP_PORT: Number(process.env.APP_PORT) || 3000,
  APP_NAME: process.env.APP_NAME || "Express APP",
  NODE_ENV: process.env.NODE_ENV || "development",
};
