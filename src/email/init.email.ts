import Queue from "bull";
import nodemailer from "nodemailer";
import { mailConfig } from "../config/mail.config";
import { redisConfig } from "../config/database.config";

export const emailQueue = new Queue("email", {
  redis: { host: redisConfig.REDIS_HOST, port: redisConfig.REDIS_PORT },
});

export const transporter = nodemailer.createTransport({
  host: mailConfig.MAIL_HOST,
  port: mailConfig.MAIL_PORT,
  secure: false,
  auth: {
    user: mailConfig.MAIL_USER,
    pass: mailConfig.MAIL_PASSWORD,
  },
});
