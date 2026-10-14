const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");

function parseEnv(filePath) {
  const env = {};
  if (fs.existsSync(filePath)) {
    const lines = fs.readFileSync(filePath, "utf-8").split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx !== -1) {
        const key = trimmed.slice(0, eqIdx).trim();
        const val = trimmed.slice(eqIdx + 1).trim();
        env[key] = val;
      }
    }
  }
  return env;
}

async function run() {
  const envPath = path.join(__dirname, "..", ".env");
  const env = parseEnv(envPath);

  const config = {
    host: env.MYSQL_HOST || "127.0.0.1",
    port: parseInt(env.MYSQL_PORT || "3306", 10),
    user: env.MYSQL_USER || "root",
    password: env.MYSQL_PASSWORD || "",
    database: env.MYSQL_DATABASE || "ocean_lighting",
  };

  console.log(`Connecting to MySQL at ${config.host}:${config.port}, DB: ${config.database}...`);

  let conn;
  try {
    conn = await mysql.createConnection(config);
    console.log("MySQL connection established.");

    const [columns] = await conn.query(
      `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'products'`,
      [config.database]
    );
    const existingCols = new Set(columns.map(c => c.COLUMN_NAME.toLowerCase()));

    if (!existingCols.has("parent_id")) {
      console.log("Adding column 'parent_id'...");
      await conn.query("ALTER TABLE products ADD COLUMN parent_id INT NULL DEFAULT NULL AFTER id, ADD INDEX idx_parent_id (parent_id)");
      console.log("✓ Added parent_id");
    } else {
      console.log("• parent_id already exists");
    }

    if (!existingCols.has("is_variant")) {
      console.log("Adding column 'is_variant'...");
      await conn.query("ALTER TABLE products ADD COLUMN is_variant BOOLEAN DEFAULT FALSE AFTER parent_id, ADD INDEX idx_is_variant (is_variant)");
      console.log("✓ Added is_variant");
    } else {
      console.log("• is_variant already exists");
    }

    if (!existingCols.has("variant_attributes")) {
      console.log("Adding column 'variant_attributes'...");
      await conn.query("ALTER TABLE products ADD COLUMN variant_attributes JSON NULL AFTER badge");
      console.log("✓ Added variant_attributes");
    } else {
      console.log("• variant_attributes already exists");
    }

    console.log("Migration completed successfully!");
  } catch (err) {
    console.error("Migration error:", err.message);
  } finally {
    if (conn) await conn.end();
  }
}

run();
