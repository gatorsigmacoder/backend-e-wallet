import dotenv from "dotenv";
dotenv.config();

export const dbConfig = {
  DB_HOST: process.env.DB_HOST || "localhost",
  DB_USER: process.env.DB_USER || "posgresql",
  DB_PORT: Number(process.env.DB_PORT || 5432),
  DB_PASSWORD: process.env.DB_PASSWORD || "posgresql",
  DB_NAME: process.env.DB_NAME || "e_wallet",
};

export const redisConfig = {
  REDIS_HOST: process.env.REDIS_HOST || "localhost",
  REDIS_PORT: Number(process.env.REDIS_PORT) || 6379,
};
