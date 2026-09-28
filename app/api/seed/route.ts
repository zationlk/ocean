import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  return handleSeed(request);
}

export async function POST(request: Request) {
  return handleSeed(request);
}

async function handleSeed(request: Request) {
  const logs: string[] = [];
  function addLog(msg: string) {
    logs.push(`[${new Date().toISOString().slice(11, 19)}] ${msg}`);
  }

  addLog('Starting database seed / restore process...');

  const dbHost = process.env.MYSQL_HOST || '127.0.0.1';
  const dbPort = parseInt(process.env.MYSQL_PORT || '3306');
  const dbUser = process.env.MYSQL_USER || 'root';
  const dbPass = process.env.MYSQL_PASSWORD || '';
  const dbName = process.env.MYSQL_DATABASE || 'ocean_lighting';

  addLog(`Target database: ${dbName} on ${dbHost}:${dbPort} (user: ${dbUser})`);

  let conn;
  try {
    conn = await mysql.createConnection({
      host: dbHost,
      port: dbPort,
      user: dbUser,
      password: dbPass,
      database: dbName,
      multipleStatements: true,
      ssl: dbHost !== '127.0.0.1' && dbHost !== 'localhost' ? { rejectUnauthorized: false } : undefined,
    });
    addLog('✅ Database connection established successfully');

    // 1. Locate SQL file or fetch from GitHub
    let sqlContent = '';
    const localSqlPath = path.join(process.cwd(), 'database', 'full_production_backup.sql');
    if (fs.existsSync(localSqlPath)) {
      addLog(`Found local SQL dump at ${localSqlPath}`);
      sqlContent = fs.readFileSync(localSqlPath, 'utf8');
    } else {
      addLog('Local SQL file not found on disk, fetching latest dump from GitHub repository...');
      const ghRes = await fetch(
        'https://raw.githubusercontent.com/zationlk/ocean/main/database/full_production_backup.sql',
        { cache: 'no-store' }
      );
      if (!ghRes.ok) {
        throw new Error(`Failed to fetch SQL from GitHub: HTTP ${ghRes.status} ${ghRes.statusText}`);
      }
      sqlContent = await ghRes.text();
      addLog(`Fetched ${Math.round(sqlContent.length / 1024)} KB SQL dump from GitHub`);
    }

    if (!sqlContent || sqlContent.length < 100) {
      throw new Error('SQL content is empty or invalid.');
    }

    addLog('Executing SQL statements (creating tables & inserting rows)...');
    await conn.query(sqlContent);
    addLog('✅ SQL script executed with 0 errors');

    // 2. Query counts
    const [prods]: any = await conn.query('SELECT COUNT(*) as c FROM products');
    const [cats]: any = await conn.query('SELECT COUNT(*) as c FROM categories');
    const [brands]: any = await conn.query('SELECT COUNT(*) as c FROM brands');
    const [settings]: any = await conn.query('SELECT COUNT(*) as c FROM site_settings');
    const [testimonials]: any = await conn.query('SELECT COUNT(*) as c FROM testimonials');

    const counts = {
      products: prods[0]?.c ?? 0,
      categories: cats[0]?.c ?? 0,
      brands: brands[0]?.c ?? 0,
      siteSettings: settings[0]?.c ?? 0,
      testimonials: testimonials[0]?.c ?? 0,
    };

    addLog(`Summary of imported records:`);
    addLog(`   Products:      ${counts.products}`);
    addLog(`   Categories:    ${counts.categories}`);
    addLog(`   Brands:        ${counts.brands}`);
    addLog(`   Site Settings: ${counts.siteSettings}`);
    addLog(`   Testimonials:  ${counts.testimonials}`);

    await conn.end();

    const acceptHeader = request.headers.get('accept') || '';
    if (acceptHeader.includes('text/html')) {
      return new NextResponse(
        `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Ocean Lighting — Database Seed Successful</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #f8fafc; padding: 40px 20px; }
    .card { max-width: 700px; margin: 0 auto; background: #1e293b; border-radius: 12px; padding: 32px; border: 1px solid #334155; box-shadow: 0 10px 25px rgba(0,0,0,0.5); }
    h1 { color: #38bdf8; margin-top: 0; }
    .badge { display: inline-block; background: #065f46; color: #34d399; padding: 6px 14px; border-radius: 9999px; font-weight: bold; font-size: 14px; margin-bottom: 20px; }
    pre { background: #020617; color: #a5f3fc; padding: 18px; border-radius: 8px; font-size: 13px; line-height: 1.6; white-space: pre-wrap; border: 1px solid #1e293b; }
    .btn { display: inline-block; background: #2563eb; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 20px; }
    .btn:hover { background: #1d4ed8; }
    .btn-site { background: #059669; margin-left: 10px; }
    .btn-site:hover { background: #047857; }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">✅ Database Seeded Successfully</div>
    <h1>Ocean Lighting Database Ready!</h1>
    <pre>${logs.join('\n')}</pre>
    <a class="btn" href="/admin/login">🔐 Go to Admin Login</a>
    <a class="btn btn-site" href="/">🏠 View Website Home</a>
  </div>
</body>
</html>`,
        { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully',
      counts,
      logs,
    });
  } catch (err: any) {
    if (conn) {
      try { await conn.end(); } catch (_) {}
    }
    addLog(`❌ Error: ${err.message}`);

    const acceptHeader = request.headers.get('accept') || '';
    if (acceptHeader.includes('text/html')) {
      return new NextResponse(
        `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Ocean Lighting — Database Seed Error</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #f8fafc; padding: 40px 20px; }
    .card { max-width: 700px; margin: 0 auto; background: #1e293b; border-radius: 12px; padding: 32px; border: 1px solid #ef4444; }
    h1 { color: #f87171; margin-top: 0; }
    pre { background: #020617; color: #fca5a5; padding: 18px; border-radius: 8px; font-size: 13px; line-height: 1.6; white-space: pre-wrap; }
    .btn { display: inline-block; background: #2563eb; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Database Seed Error</h1>
    <p>Could not connect or execute seed on database <code>${dbName}</code>.</p>
    <pre>${logs.join('\n')}\n\nStack:\n${err.stack || err.message}</pre>
    <a class="btn" href="/">Return to Site</a>
  </div>
</body>
</html>`,
        { status: 500, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: err.message,
        code: err.code || null,
        logs,
      },
      { status: 500 }
    );
  }
}
