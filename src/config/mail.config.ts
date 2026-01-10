import dotenv from "dotenv";
dotenv.config();

export const mailConfig = {
  MAIL_HOST: process.env.MAIL_HOST || "",
  MAIL_PORT: Number(process.env.MAIL_PORT) || 587,
  MAIL_USER: process.env.MAIL_USER || "",
  MAIL_PASSWORD: process.env.MAIL_PASSWORD || "",
};
