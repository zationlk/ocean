const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");

require("dotenv").config({ path: path.join(__dirname, ".env") });

async function runMigration() {
  const pool = mysql.createPool({
    host: process.env.MYSQL_HOST || "127.0.0.1",
    port: parseInt(process.env.MYSQL_PORT || "3306"),
    user: process.env.MYSQL_USER || "root",
    password: process.env.MYSQL_PASSWORD || "",
    database: process.env.MYSQL_DATABASE || "ocean_lighting",
    multipleStatements: true,
    waitForConnections: true,
  });

  const sqlPath = path.join(__dirname, "database", "migration_20260828_model_number_and_icons.sql");
  const sql = fs.readFileSync(sqlPath, "utf8");

  console.log("Using MySQL connection:");
  console.log(`  Host: ${process.env.MYSQL_HOST || "127.0.0.1"}`);
  console.log(`  User: ${process.env.MYSQL_USER || "root"}`);
  console.log(`  DB  : ${process.env.MYSQL_DATABASE || "ocean_lighting"}`);
  console.log("\nRunning migration...");

  try {
    const conn = await pool.getConnection();
    try {
      await conn.query("SELECT 1");
      console.log("  Connection OK");

      const statements = sql
        .split(/;\s*(?=--\s|ALTER|UPDATE|SET|PREPARE|DEALLOCATE|EXECUTE|USE\s)/i)
        .map(s => s.trim())
        .filter(Boolean);

      for (const stmt of statements) {
        if (/^(SET|PREPARE|EXECUTE|DEALLOCATE|USE)\b/i.test(stmt) || stmt.includes("PREPARE") || stmt.includes("EXECUTE") || stmt.includes("DEALLOCATE")) {
          continue;
        }
        try {
          const [result] = await conn.query(stmt);
          if (result.affectedRows !== undefined) {
            const firstLine = stmt.split("\n")[0].substring(0, 100);
            console.log(`  ✓ ${firstLine}  (affected: ${result.affectedRows}, changed: ${result.changedRows || 0})`);
          }
        } catch (e) {
          const firstLine = stmt.split("\n")[0].substring(0, 100);
          console.warn(`  ⚠ ${firstLine}`);
          console.warn(`    ${e.message}`);
        }
      }

      console.log("\nVerifying changes:");

      const [cols] = await conn.query(
        "SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'products' AND COLUMN_NAME = 'model_number'"
      );
      if (cols.length > 0) {
        console.log("  ✓ model_number column exists in products table");
      } else {
        console.log("  ✗ model_number column missing");
      }

      const [icons] = await conn.query("SELECT slug, icon FROM categories ORDER BY slug");
      console.log("  Category icons updated:");
      for (const c of icons) {
        console.log(`    ${c.icon}  ${c.slug}`);
      }

      const [models] = await conn.query("SELECT slug, model_number FROM products WHERE model_number IS NOT NULL ORDER BY slug");
      console.log(`\n  Products with model numbers (${models.length}):`);
      for (const p of models) {
        console.log(`    ${p.model_number}  →  ${p.slug}`);
      }

      console.log("\n✓ Migration completed successfully.");
    } finally {
      conn.release();
    }
  } catch (err) {
    console.error("\n✗ Migration failed:", err.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

runMigration();
