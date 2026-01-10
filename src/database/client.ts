import { Pool } from "pg";
import { dbConfig } from "../config/database.config";

export const db = new Pool({
  host: dbConfig.DB_HOST,
  port: dbConfig.DB_PORT,
  database: dbConfig.DB_NAME,
  user: dbConfig.DB_USER,
  password: dbConfig.DB_PASSWORD,
  max: 10, // maksimal connection
  idleTimeoutMillis: 10_000, // idle timeout
  connectionTimeoutMillis: 5_000,
  ssl: false,
});
