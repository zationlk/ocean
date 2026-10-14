import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';
import { safeParseJson } from '@/lib/utils';
import { normalizeImageUrl } from '@/lib/image-utils';

export const dynamic = 'force-dynamic';

function formatProduct(p: any) {
  if (!p) return null;
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

  return {
    ...p,
    id: String(p.id),
    parentId: p.parent_id ? String(p.parent_id) : null,
    parent_id: p.parent_id ? String(p.parent_id) : null,
    isVariant: !!(p.is_variant || p.isVariant),
    is_variant: !!(p.is_variant || p.isVariant),
    modelNumber: p.model_number || p.modelNumber || '',
    model_number: p.model_number || p.modelNumber || '',
    images: imagesArray,
    specifications: safeParseJson<Record<string, any>>(p.specifications, {}),
    features: safeParseJson<string[]>(p.features, []),
    variantAttributes: safeParseJson<Record<string, string>>(p.variant_attributes, {}),
    variant_attributes: safeParseJson<Record<string, string>>(p.variant_attributes, {}),
    isFeatured: !!(p.is_featured || p.isFeatured),
    isNew: !!(p.is_new || p.isNew),
    shortDescription: p.short_description || p.shortDescription || '',
    short_description: p.short_description || p.shortDescription || '',
    createdAt: p.created_at || p.createdAt,
    updatedAt: p.updated_at || p.updatedAt,
  };
}

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

    const sql = 'SELECT * FROM products WHERE slug = ? OR id = ? LIMIT 1';
    const products = await query(sql, [slug, slug]) as any[];

    if (!products || products.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const data = formatProduct(products[0]);

    // Fetch parent or sibling variants
    if (data) {
      const effectiveParentId = data.parentId || data.id;
      // Get all products in this family (the parent + all variants)
      const familySql = 'SELECT * FROM products WHERE parent_id = ? OR id = ? ORDER BY id ASC';
      const familyRows = await query(familySql, [effectiveParentId, effectiveParentId]) as any[];
      const familyProducts = (familyRows || []).map(formatProduct);

      // Separate into variants (all items in the group)
      data.variants = familyProducts;
      data.parent = familyProducts.find(p => p.id === String(effectiveParentId)) || null;
    }

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

    const allowedFields = [
      'name', 'category', 'subcategory', 'model_number',
      'description', 'short_description', 'badge', 'is_featured', 'is_new',
      'parent_id', 'is_variant'
    ];
    const jsonFields = ['images', 'specifications', 'features', 'variant_attributes'];

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
    paramsArr.push(slug);

    const sql = `UPDATE products SET ${fields.join(', ')} WHERE slug = ? OR id = ?`;
    await query(sql, paramsArr);

    const getSql = 'SELECT * FROM products WHERE slug = ? OR id = ? LIMIT 1';
    const updatedProducts = await query(getSql, [slug, slug]) as any[];
    if (!updatedProducts || updatedProducts.length === 0) {
      return NextResponse.json({ error: 'Product not found after update' }, { status: 404 });
    }

    const data = formatProduct(updatedProducts[0]);
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

    // Find the product id first
    const rows = await query('SELECT id FROM products WHERE slug = ? OR id = ? LIMIT 1', [slug, slug]) as any[];
    if (rows && rows.length > 0) {
      const prodId = rows[0].id;
      // Delete child variants
      await query('DELETE FROM products WHERE parent_id = ?', [prodId]);
      // Delete the product
      await query('DELETE FROM products WHERE id = ?', [prodId]);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Product DELETE error:', error);
    return NextResponse.json({ error: error.message || 'Invalid request' }, { status: 400 });
  }
}
