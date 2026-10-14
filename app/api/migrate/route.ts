import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  return handleMigrate(request);
}

export async function POST(request: Request) {
  return handleMigrate(request);
}

async function handleMigrate(request: Request) {
  const logs: string[] = [];
  function addLog(msg: string) {
    logs.push(`[${new Date().toISOString().slice(11, 19)}] ${msg}`);
  }

  addLog('Starting product variations database migration...');

  const dbHost = process.env.MYSQL_HOST || '127.0.0.1';
  const dbPort = parseInt(process.env.MYSQL_PORT || '3306', 10);
  const dbUser = process.env.MYSQL_USER || 'root';
  const dbPass = process.env.MYSQL_PASSWORD || '';
  const dbName = process.env.MYSQL_DATABASE || 'ocean_lighting';

  addLog(`Connecting to: ${dbName} on ${dbHost}:${dbPort}`);

  let conn;
  try {
    conn = await mysql.createConnection({
      host: dbHost,
      port: dbPort,
      user: dbUser,
      password: dbPass,
      database: dbName,
      ssl: dbHost !== '127.0.0.1' && dbHost !== 'localhost' ? { rejectUnauthorized: false } : undefined,
    });
    addLog('✅ Database connected');

    const [columns]: any = await conn.query(
      `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'products'`,
      [dbName]
    );
    const existingCols = new Set(columns.map((c: any) => c.COLUMN_NAME.toLowerCase()));

    if (!existingCols.has('parent_id')) {
      addLog('Adding column: parent_id...');
      await conn.query('ALTER TABLE products ADD COLUMN parent_id INT NULL DEFAULT NULL AFTER id, ADD INDEX idx_parent_id (parent_id)');
      addLog('✅ Added parent_id column');
    } else {
      addLog('• parent_id column already exists');
    }

    if (!existingCols.has('is_variant')) {
      addLog('Adding column: is_variant...');
      await conn.query('ALTER TABLE products ADD COLUMN is_variant BOOLEAN DEFAULT FALSE AFTER parent_id, ADD INDEX idx_is_variant (is_variant)');
      addLog('✅ Added is_variant column');
    } else {
      addLog('• is_variant column already exists');
    }

    if (!existingCols.has('variant_attributes')) {
      addLog('Adding column: variant_attributes...');
      await conn.query('ALTER TABLE products ADD COLUMN variant_attributes JSON NULL AFTER badge');
      addLog('✅ Added variant_attributes column');
    } else {
      addLog('• variant_attributes column already exists');
    }

    await conn.end();
    addLog('🎉 All migrations applied successfully!');

    const accept = request.headers.get('accept') || '';
    if (accept.includes('text/html')) {
      return new NextResponse(
        `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Ocean Lighting — Migration Successful</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0b0c10; color: #fff; padding: 40px 20px; }
    .card { max-width: 650px; margin: 0 auto; background: #13151c; border-radius: 16px; padding: 32px; border: 1px solid rgba(212,175,55,0.3); box-shadow: 0 10px 40px rgba(0,0,0,0.6); }
    h1 { color: #d4af37; margin-top: 0; font-size: 22px; }
    .badge { display: inline-block; background: rgba(34,197,94,0.15); color: #4ade80; border: 1px solid rgba(34,197,94,0.3); padding: 5px 12px; border-radius: 9999px; font-weight: bold; font-size: 13px; margin-bottom: 16px; }
    pre { background: #07080a; color: #e2e8f0; padding: 16px; border-radius: 12px; font-size: 13px; line-height: 1.6; white-space: pre-wrap; border: 1px solid rgba(255,255,255,0.08); }
    .btn { display: inline-block; background: #d4af37; color: #0a0a0c; padding: 10px 20px; text-decoration: none; border-radius: 10px; font-weight: bold; margin-top: 15px; }
    .btn-ghost { background: transparent; color: #94a3b8; border: 1px solid rgba(255,255,255,0.15); margin-left: 10px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">✅ Variations Migration Completed</div>
    <h1>Database Schema is Up to Date</h1>
    <pre>${logs.join('\n')}</pre>
    <a class="btn" href="/admin/products">Go to Admin Products</a>
    <a class="btn btn-ghost" href="/lighting">View Catalog</a>
  </div>
</body>
</html>`,
        { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
      );
    }

    return NextResponse.json({ success: true, logs });
  } catch (err: any) {
    if (conn) {
      try { await conn.end(); } catch (_) {}
    }
    addLog(`❌ Error: ${err.message}`);
    return NextResponse.json({ success: false, error: err.message, logs }, { status: 500 });
  }
}
