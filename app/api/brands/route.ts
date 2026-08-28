import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';

const parseBrand = (b: any) => ({
  ...b,
  sortOrder: b.sort_order,
  createdAt: b.created_at,
  updatedAt: b.updated_at,
});

export async function GET() {
  try {
    const sql = 'SELECT * FROM brands ORDER BY sort_order';
    const brands = await query(sql) as any[];
    const parsed = Array.isArray(brands) ? brands.map(parseBrand) : [];
    return NextResponse.json(parsed);
  } catch (error: any) {
    console.error('Brands fetch error:', error);
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, logo, website, sort_order } = body;

    const sql = `
      INSERT INTO brands (name, logo, website, sort_order)
      VALUES (?, ?, ?, ?)
    `;

    const params = [name, logo || null, website || null, sort_order || 0];
    const result: any = await query(sql, params);
    const insertId = result.insertId;

    const getSql = 'SELECT * FROM brands WHERE id = ?';
    const newBrands = await query(getSql, [insertId]) as any[];
    const data = parseBrand(newBrands[0]);

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error: any) {
    console.error('Brand POST error:', error);
    return NextResponse.json({ error: error.message || 'Invalid request body' }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Brand ID required' }, { status: 400 });
    }

    const fields: string[] = [];
    const params: any[] = [];
    const allowedFields = ['name', 'logo', 'website', 'sort_order'];

    for (const key of allowedFields) {
      if (key in updates) {
        fields.push(`${key} = ?`);
        params.push(updates[key]);
      }
    }

    if (fields.length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    fields.push('updated_at = CURRENT_TIMESTAMP');
    params.push(id);

    const sql = `UPDATE brands SET ${fields.join(', ')} WHERE id = ?`;
    await query(sql, params);

    const getSql = 'SELECT * FROM brands WHERE id = ?';
    const updatedBrands = await query(getSql, [id]) as any[];
    const data = parseBrand(updatedBrands[0]);

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Brand PUT error:', error);
    return NextResponse.json({ error: error.message || 'Invalid request body' }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Brand ID required' }, { status: 400 });
    }

    const sql = 'DELETE FROM brands WHERE id = ?';
    await query(sql, [id]);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Brand DELETE error:', error);
    return NextResponse.json({ error: error.message || 'Invalid request' }, { status: 400 });
  }
}
