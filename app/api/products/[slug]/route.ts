import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const sql = 'SELECT * FROM products WHERE slug = ?';
    const products = await query(sql, [slug]) as any[];

    if (products.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const p = products[0];
    const data = {
      ...p,
      images: p.images ? JSON.parse(p.images as string) : [],
      specifications: p.specifications ? JSON.parse(p.specifications as string) : {},
      features: p.features ? JSON.parse(p.features as string) : [],
      isFeatured: !!p.is_featured,
      isNew: !!p.is_new,
      shortDescription: p.short_description,
      createdAt: p.created_at,
      updatedAt: p.updated_at,
    };

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Product fetch error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();

    const fields: string[] = [];
    const paramsArr: any[] = [];

    const allowedFields = ['name', 'category', 'subcategory', 'description', 'short_description', 'badge', 'is_featured', 'is_new'];
    const jsonFields = ['images', 'specifications', 'features'];

    for (const key of allowedFields) {
      if (key in body) {
        fields.push(`${key} = ?`);
        paramsArr.push(body[key]);
      }
    }
    for (const key of jsonFields) {
      if (key in body) {
        fields.push(`${key} = ?`);
        paramsArr.push(JSON.stringify(body[key]));
      }
    }

    if (fields.length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    fields.push('updated_at = CURRENT_TIMESTAMP');
    paramsArr.push(slug);

    const sql = `UPDATE products SET ${fields.join(', ')} WHERE slug = ?`;
    await query(sql, paramsArr);

    const getSql = 'SELECT * FROM products WHERE slug = ?';
    const updatedProducts = await query(getSql, [slug]) as any[];
    const p = updatedProducts[0];
    const data = {
      ...p,
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

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const sql = 'DELETE FROM products WHERE slug = ?';
    await query(sql, [slug]);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Product DELETE error:', error);
    return NextResponse.json({ error: error.message || 'Invalid request' }, { status: 400 });
  }
}
