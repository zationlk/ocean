import { NextResponse } from 'next/server';
import pool from '@/lib/mysql';

export const dynamic = 'force-dynamic';

export async function GET() {
  const result: any = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    env: {
      MYSQL_HOST: process.env.MYSQL_HOST || '127.0.0.1 (fallback)',
      MYSQL_PORT: process.env.MYSQL_PORT || '3306 (fallback)',
      MYSQL_USER: process.env.MYSQL_USER ? process.env.MYSQL_USER.replace(/(.{2}).+(.{2})/, '$1***$2') : 'root (fallback)',
      MYSQL_DATABASE: process.env.MYSQL_DATABASE || 'ocean_lighting (fallback)',
      NODE_ENV: process.env.NODE_ENV,
    },
    database: {
      connected: false,
    }
  };

  try {
    const conn = await pool.getConnection();
    try {
      const [tableRows]: any = await conn.query('SHOW TABLES');
      const tableNames = (tableRows as any[]).map(r => Object.values(r)[0]);

      const counts: Record<string, number> = {};
      for (const t of ['products', 'categories', 'brands', 'site_settings', 'testimonials']) {
        if (tableNames.includes(t)) {
          const [cnt]: any = await conn.query(`SELECT COUNT(*) as c FROM \`${t}\``);
          counts[t] = cnt[0]?.c ?? 0;
        } else {
          counts[t] = -1; // table does not exist
        }
      }

      result.database = {
        connected: true,
        tablesCount: tableNames.length,
        tables: tableNames,
        counts,
      };
    } finally {
      conn.release();
    }
  } catch (err: any) {
    result.database = {
      connected: false,
      error: err.message,
      code: err.code || null,
      errno: err.errno || null,
    };
  }

  return NextResponse.json(result);
}
