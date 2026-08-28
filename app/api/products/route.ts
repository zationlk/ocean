import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const featured = searchParams.get('featured');
  const slug = searchParams.get('slug');
  const limit = searchParams.get('limit');

  try {
    let sql = 'SELECT * FROM products';
    const params: any[] = [];
    const conditions: string[] = [];

    if (slug) {
      conditions.push('slug = ?');
      params.push(slug);
    }
    if (category && category !== 'all') {
      conditions.push('category = ?');
      params.push(category);
    }
    if (featured === 'true') {
      conditions.push('is_featured = ?');
      params.push(true);
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }

    sql += ' ORDER BY created_at DESC';

    if (limit) {
      sql += ' LIMIT ?';
      params.push(parseInt(limit));
    }

    const products = await query(sql, params) as any[];

    const parsedProducts = products.map(p => ({
      ...p,
      modelNumber: p.model_number,
      images: p.images ? JSON.parse(p.images as string) : [],
      specifications: p.specifications ? JSON.parse(p.specifications as string) : {},
      features: p.features ? JSON.parse(p.features as string) : [],
      isFeatured: !!p.is_featured,
      isNew: !!p.is_new,
      shortDescription: p.short_description,
      createdAt: p.created_at,
      updatedAt: p.updated_at,
    }));

    if (slug && parsedProducts.length > 0) {
      return NextResponse.json(parsedProducts[0]);
    }

    return NextResponse.json(parsedProducts || []);
  } catch (error) {
    console.error('Products fetch error:', error);
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name, slug, category, subcategory, model_number, description, short_description,
      images, specifications, features, is_featured, is_new, badge
    } = body;

    const sql = `
      INSERT INTO products (name, slug, category, subcategory, model_number, description, short_description, images, specifications, features, is_featured, is_new, badge)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      name, slug, category, subcategory || null, model_number || null, description, short_description,
      JSON.stringify(images || []),
      JSON.stringify(specifications || {}),
      JSON.stringify(features || []),
      is_featured || false,
      is_new || false,
      badge || null,
    ];

    const result: any = await query(sql, params);
    const insertId = result.insertId;

    const getSql = 'SELECT * FROM products WHERE id = ?';
    const newProducts = await query(getSql, [insertId]) as any[];
    const p = newProducts[0];
    const data = {
      ...p,
      modelNumber: p.model_number,
      images: p.images ? JSON.parse(p.images as string) : [],
      specifications: p.specifications ? JSON.parse(p.specifications as string) : {},
      features: p.features ? JSON.parse(p.features as string) : [],
      isFeatured: !!p.is_featured,
      isNew: !!p.is_new,
      shortDescription: p.short_description,
      createdAt: p.created_at,
      updatedAt: p.updated_at,
    };

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Product POST error:', error);
    return NextResponse.json({ error: error.message || 'Invalid request body' }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
    }

    const fields: string[] = [];
    const params: any[] = [];

    const allowedFields = ['name', 'slug', 'category', 'subcategory', 'model_number', 'description', 'short_description', 'badge', 'is_featured', 'is_new'];
    const jsonFields = ['images', 'specifications', 'features'];

    for (const key of allowedFields) {
      if (key in updates) {
        fields.push(`${key} = ?`);
        params.push(updates[key]);
      }
    }
    for (const key of jsonFields) {
      if (key in updates) {
        fields.push(`${key} = ?`);
        params.push(JSON.stringify(updates[key]));
      }
    }

    if (fields.length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    fields.push('updated_at = CURRENT_TIMESTAMP');
    params.push(id);

    const sql = `UPDATE products SET ${fields.join(', ')} WHERE id = ?`;
    await query(sql, params);

    const getSql = 'SELECT * FROM products WHERE id = ?';
    const updatedProducts = await query(getSql, [id]) as any[];
    const p = updatedProducts[0];
    const data = {
      ...p,
      modelNumber: p.model_number,
      images: p.images ? JSON.parse(p.images as string) : [],
      specifications: p.specifications ? JSON.parse(p.specifications as string) : {},
      features: p.features ? JSON.parse(p.features as string) : [],
      isFeatured: !!p.is_featured,
      isNew: !!p.is_new,
      shortDescription: p.short_description,
      createdAt: p.created_at,
      updatedAt: p.updated_at,
    };

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Product PUT error:', error);
    return NextResponse.json({ error: error.message || 'Invalid request body' }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
    }

    const sql = 'DELETE FROM products WHERE id = ?';
    await query(sql, [id]);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Product DELETE error:', error);
    return NextResponse.json({ error: error.message || 'Invalid request' }, { status: 400 });
  }
}
