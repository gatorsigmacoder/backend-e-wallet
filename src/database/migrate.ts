import fs from "fs";
import path from "path";
import { db } from "./client";

async function runMigrations() {
  const client = await db.connect();
  try {
    await client.query("BEGIN");

    await client.query(`
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    `);
    await client.query(`
    CREATE EXTENSION IF NOT EXISTS "pgcrypto";
    `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        run_on TIMESTAMP NOT NULL DEFAULT now()
      );
    `);

    // baca semua file .sql dari folder migrations
    const files = fs
      .readdirSync(path.join(__dirname, "../migrations"))
      .filter((f) => f.endsWith(".sql"));

    for (const file of files) {
      const alreadyRun = await client.query(
        "SELECT * FROM migrations WHERE name = $1",
        [file]
      );

      if (alreadyRun.rowCount === 0) {
        const sql = fs.readFileSync(
          path.join(__dirname, "../migrations", file),
          "utf8"
        );

        console.log(`Running migration: ${file}`);
        await client.query(sql);

        await client.query("INSERT INTO migrations (name) VALUES ($1)", [file]);
      }
    }

    await client.query("COMMIT");
    console.log("Migrations complete.");
  } catch (e) {
    await client.query("ROLLBACK");
    console.error("Migration failed:", e);
  } finally {
    client.release();
  }
}

runMigrations();
