import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';

function normalise(c: any) {
  return {
    ...c,
    mainCategory: c.mainCategory ?? c.main_category ?? 'lighting',
    productCount: c.productCount ?? c.product_count ?? 0,
    createdAt: c.createdAt ?? c.created_at,
    updatedAt: c.updatedAt ?? c.updated_at,
  };
}

export async function GET() {
  try {
    const sql = 'SELECT * FROM categories ORDER BY main_category ASC, product_count DESC';
    const categories = await query(sql) as any[];
    return NextResponse.json(categories.map(normalise) || []);
  } catch (error: any) {
    console.error('Categories fetch error:', error);
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, slug, description, icon, image, product_count, main_category } = body;

    const sql = `
      INSERT INTO categories (name, slug, main_category, description, icon, image, product_count)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      name,
      slug,
      main_category || 'lighting',
      description,
      icon || null,
      image || null,
      product_count || 0
    ];
    const result: any = await query(sql, params);
    const insertId = result.insertId;

    const getSql = 'SELECT * FROM categories WHERE id = ?';
    const newCategories = await query(getSql, [insertId]) as any[];
    const data = normalise(newCategories[0]);

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Category POST error:', error);
    return NextResponse.json({ error: error.message || 'Invalid request body' }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Category ID required' }, { status: 400 });
    }

    const fields: string[] = [];
    const params: any[] = [];
    const allowedFields = ['name', 'slug', 'description', 'icon', 'image', 'product_count', 'main_category'];

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

    const sql = `UPDATE categories SET ${fields.join(', ')} WHERE id = ?`;
    await query(sql, params);

    const getSql = 'SELECT * FROM categories WHERE id = ?';
    const updatedCategories = await query(getSql, [id]) as any[];
    const data = normalise(updatedCategories[0]);

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Category PUT error:', error);
    return NextResponse.json({ error: error.message || 'Invalid request body' }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Category ID required' }, { status: 400 });
    }

    const sql = 'DELETE FROM categories WHERE id = ?';
    await query(sql, [id]);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Category DELETE error:', error);
    return NextResponse.json({ error: error.message || 'Invalid request' }, { status: 400 });
  }
}
