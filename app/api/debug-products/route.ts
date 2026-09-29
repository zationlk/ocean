import { NextResponse } from 'next/server';
import pool from '@/lib/mysql';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const conn = await pool.getConnection();
    try {
      // Fetch a few products directly
      const [products]: any = await conn.query(
        'SELECT id, name, slug, category, is_featured, images, created_at FROM products ORDER BY created_at DESC LIMIT 5'
      );
      
      const [firstRaw]: any = await conn.query('SELECT * FROM products LIMIT 1');
      
      return NextResponse.json({
        productCount: products.length,
        products: products,
        firstRawKeys: firstRaw.length > 0 ? Object.keys(firstRaw[0]) : [],
        firstRaw: firstRaw.length > 0 ? firstRaw[0] : null,
      });
    } finally {
      conn.release();
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message, code: err.code }, { status: 500 });
  }
}
