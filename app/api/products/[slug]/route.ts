import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';
import { safeParseJson } from '@/lib/utils';
import { normalizeImageUrl } from '@/lib/image-utils';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } | Promise<{ slug: string }> }
) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const slug = resolvedParams?.slug;

    if (!slug) {
      return NextResponse.json({ error: 'Slug parameter missing' }, { status: 400 });
    }

    const sql = 'SELECT * FROM products WHERE slug = ? LIMIT 1';
    const products = await query(sql, [slug]) as any[];

    if (!products || products.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const p = products[0];
    const rawImages = safeParseJson<any>(p.images, []);
    let imagesArray: string[] = [];
    if (Array.isArray(rawImages)) {
      imagesArray = rawImages.filter(Boolean).map(normalizeImageUrl);
    } else if (typeof rawImages === 'string' && rawImages.trim()) {
      imagesArray = [normalizeImageUrl(rawImages.trim())];
    }
    if (imagesArray.length === 0) {
      imagesArray = ['/placeholder-product.jpg'];
    }

    const data = {
      ...p,
      modelNumber: p.model_number || p.modelNumber || '',
      images: imagesArray,
      specifications: safeParseJson<Record<string, any>>(p.specifications, {}),
      features: safeParseJson<string[]>(p.features, []),
      isFeatured: !!(p.is_featured || p.isFeatured),
      isNew: !!(p.is_new || p.isNew),
      shortDescription: p.short_description || p.shortDescription || '',
      createdAt: p.created_at || p.createdAt,
      updatedAt: p.updated_at || p.updatedAt,
    };

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Product fetch error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch product' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { slug: string } | Promise<{ slug: string }> }
) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const slug = resolvedParams?.slug;

    if (!slug) {
      return NextResponse.json({ error: 'Slug parameter missing' }, { status: 400 });
    }

    const body = await request.json();

    const fields: string[] = [];
    const paramsArr: any[] = [];

    const allowedFields = ['name', 'category', 'subcategory', 'model_number', 'description', 'short_description', 'badge', 'is_featured', 'is_new'];
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

    const getSql = 'SELECT * FROM products WHERE slug = ? LIMIT 1';
    const updatedProducts = await query(getSql, [slug]) as any[];
    if (!updatedProducts || updatedProducts.length === 0) {
      return NextResponse.json({ error: 'Product not found after update' }, { status: 404 });
    }

    const p = updatedProducts[0];
    const rawImages = safeParseJson<any>(p.images, []);
    let imagesArray: string[] = [];
    if (Array.isArray(rawImages)) {
      imagesArray = rawImages.filter(Boolean).map(normalizeImageUrl);
    } else if (typeof rawImages === 'string' && rawImages.trim()) {
      imagesArray = [normalizeImageUrl(rawImages.trim())];
    }
    if (imagesArray.length === 0) {
      imagesArray = ['/placeholder-product.jpg'];
    }

    const data = {
      ...p,
      modelNumber: p.model_number || p.modelNumber || '',
      images: imagesArray,
      specifications: safeParseJson<Record<string, any>>(p.specifications, {}),
      features: safeParseJson<string[]>(p.features, []),
      isFeatured: !!(p.is_featured || p.isFeatured),
      isNew: !!(p.is_new || p.isNew),
      shortDescription: p.short_description || p.shortDescription || '',
      createdAt: p.created_at || p.createdAt,
      updatedAt: p.updated_at || p.updatedAt,
    };

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Product PUT error:', error);
    return NextResponse.json({ error: error.message || 'Invalid request body' }, { status: 400 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { slug: string } | Promise<{ slug: string }> }
) {
  try {
    const resolvedParams = await Promise.resolve(params);
    const slug = resolvedParams?.slug;
    if (!slug) {
      return NextResponse.json({ error: 'Slug parameter missing' }, { status: 400 });
    }

    const sql = 'DELETE FROM products WHERE slug = ?';
    await query(sql, [slug]);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Product DELETE error:', error);
    return NextResponse.json({ error: error.message || 'Invalid request' }, { status: 400 });
  }
}
