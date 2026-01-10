import { Client } from "pg";
import { dbConfig } from "../config/database.config";

// Connect ke database default dulu (postgres)
const defaultClient = new Client({
  user: dbConfig.DB_USER,
  host: dbConfig.DB_HOST,
  password: dbConfig.DB_PASSWORD,
  port: dbConfig.DB_PORT,
  database: "postgres",
});

async function main() {
  try {
    await defaultClient.connect();
    console.log("Connected to default postgres DB");

    // Cek apakah DB target sudah ada
    const checkDb = await defaultClient.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [dbConfig.DB_NAME]
    );

    if (checkDb.rowCount === 0) {
      console.log(`Database "${dbConfig.DB_NAME}" not found — creating...`);
      await defaultClient.query(`CREATE DATABASE ${dbConfig.DB_NAME}`);
      console.log(`Database "${dbConfig.DB_NAME}" created`);
    } else {
      console.log(`Database "${dbConfig.DB_NAME}" already exists`);
    }
  } catch (err) {
    console.error("Error init database:", err);
  } finally {
    await defaultClient.end();
  }
}

main();
