import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';
import { safeParseJson } from '@/lib/utils';
import { normalizeImageUrl, resolveExternalImageUrl } from '@/lib/image-utils';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

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
    isVariant: !!p.is_variant,
    is_variant: !!p.is_variant,
    modelNumber: p.model_number || '',
    model_number: p.model_number || '',
    images: imagesArray,
    specifications: safeParseJson<Record<string, any>>(p.specifications, {}),
    features: safeParseJson<string[]>(p.features, []),
    variantAttributes: safeParseJson<Record<string, string>>(p.variant_attributes, {}),
    variant_attributes: safeParseJson<Record<string, string>>(p.variant_attributes, {}),
    isFeatured: !!p.is_featured,
    isNew: !!p.is_new,
    shortDescription: p.short_description || '',
    short_description: p.short_description || '',
    createdAt: p.created_at,
    updatedAt: p.updated_at,
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const featured = searchParams.get('featured');
  const slug = searchParams.get('slug');
  const limit = searchParams.get('limit');
  const parentId = searchParams.get('parent_id');
  const onlyParents = searchParams.get('only_parents');
  const onlyVariants = searchParams.get('only_variants');

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
      params.push(1);
    }
    if (parentId) {
      conditions.push('parent_id = ?');
      params.push(parentId);
    }
    if (onlyParents === 'true') {
      conditions.push('(parent_id IS NULL OR is_variant = 0)');
    } else if (onlyVariants === 'true') {
      conditions.push('is_variant = 1');
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }

    sql += ' ORDER BY created_at DESC';

    if (limit) {
      sql += ' LIMIT ?';
      params.push(parseInt(limit, 10));
    }

    const products = await query(sql, params) as any[];
    const parsedProducts = (products || []).map(formatProduct);

    if (slug && parsedProducts.length > 0) {
      const product = parsedProducts[0];
      // Also fetch sibling/child variants
      const effectiveParentId = product.parentId || product.id;
      const variantsSql = 'SELECT * FROM products WHERE (parent_id = ? OR id = ?) AND id != ? ORDER BY id ASC';
      const variantRows = await query(variantsSql, [effectiveParentId, effectiveParentId, product.id]) as any[];
      product.variants = (variantRows || []).map(formatProduct);
      return NextResponse.json(product);
    }

    return NextResponse.json(parsedProducts);
  } catch (error: any) {
    console.error('Products fetch error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch products', products: [] }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name, slug, category, subcategory, model_number, description, short_description,
      images, specifications, features, is_featured, is_new, badge,
      parent_id, is_variant, variant_attributes, variants
    } = body;

    const resolvedImages = Array.isArray(images)
      ? await Promise.all(images.map((img: string) => resolveExternalImageUrl(img)))
      : [];

    const baseSlug = slug || slugify(name);

    const sql = `
      INSERT INTO products (
        name, slug, category, subcategory, model_number, description, short_description,
        images, specifications, features, is_featured, is_new, badge,
        parent_id, is_variant, variant_attributes
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      name,
      baseSlug,
      category,
      subcategory || null,
      model_number || null,
      description,
      short_description,
      JSON.stringify(resolvedImages),
      JSON.stringify(specifications || {}),
      JSON.stringify(features || []),
      is_featured ? 1 : 0,
      is_new ? 1 : 0,
      badge || null,
      parent_id || null,
      is_variant ? 1 : 0,
      variant_attributes ? JSON.stringify(variant_attributes) : null,
    ];

    const result: any = await query(sql, params);
    const insertId = result.insertId;

    // Handle nested variants creation if provided
    const createdVariants: any[] = [];
    if (Array.isArray(variants) && variants.length > 0) {
      for (let i = 0; i < variants.length; i++) {
        const v = variants[i];
        if (!v || !v.name) continue;

        const vName = v.name.trim();
        const vAttrs = v.variant_attributes || v.variantAttributes || {};
        const vSlugBase = v.slug || slugify(`${name}-${vName}`);
        const vSlug = `${vSlugBase}-${insertId}-${i + 1}`;

        const vImages = Array.isArray(v.images) && v.images.length > 0 && v.images[0]
          ? await Promise.all(v.images.map((img: string) => resolveExternalImageUrl(img)))
          : resolvedImages;

        const vSpecs = {
          ...(specifications || {}),
          ...(v.specifications || {}),
          ...vAttrs,
        };

        const vSql = `
          INSERT INTO products (
            name, slug, category, subcategory, model_number, description, short_description,
            images, specifications, features, is_featured, is_new, badge,
            parent_id, is_variant, variant_attributes
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
        `;

        const vParams = [
          vName,
          vSlug,
          category,
          subcategory || null,
          v.model_number || v.modelNumber || null,
          v.description || description,
          v.short_description || v.shortDescription || short_description,
          JSON.stringify(vImages),
          JSON.stringify(vSpecs),
          JSON.stringify(features || []),
          v.is_featured ? 1 : 0,
          v.is_new ? 1 : 0,
          v.badge || null,
          insertId,
          JSON.stringify(vAttrs),
        ];

        try {
          const vResult: any = await query(vSql, vParams);
          createdVariants.push({ id: vResult.insertId, name: vName, slug: vSlug });
        } catch (vErr) {
          console.error('Error inserting variant:', vErr);
        }
      }
    }

    const getSql = 'SELECT * FROM products WHERE id = ?';
    const newProducts = await query(getSql, [insertId]) as any[];
    const productData = formatProduct(newProducts[0]);
    if (productData) {
      productData.variants = createdVariants;
    }

    return NextResponse.json({ success: true, data: productData });
  } catch (error: any) {
    console.error('Product POST error:', error);
    return NextResponse.json({ error: error.message || 'Invalid request body' }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, variants, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
    }

    if ('images' in updates && Array.isArray(updates.images)) {
      updates.images = await Promise.all(
        updates.images.map((img: string) => resolveExternalImageUrl(img))
      );
    }

    const fields: string[] = [];
    const params: any[] = [];

    const allowedFields = [
      'name', 'slug', 'category', 'subcategory', 'model_number',
      'description', 'short_description', 'badge', 'is_featured', 'is_new',
      'parent_id', 'is_variant'
    ];
    const jsonFields = ['images', 'specifications', 'features', 'variant_attributes'];

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

    if (fields.length > 0) {
      fields.push('updated_at = CURRENT_TIMESTAMP');
      params.push(id);
      const sql = `UPDATE products SET ${fields.join(', ')} WHERE id = ?`;
      await query(sql, params);
    }

    // Handle child variants updates if provided
    if (Array.isArray(variants)) {
      // Find existing variants for this parent
      const existingRows = await query('SELECT id FROM products WHERE parent_id = ?', [id]) as any[];
      const existingIds = new Set((existingRows || []).map(r => String(r.id)));
      const incomingIds = new Set<string>();

      for (let i = 0; i < variants.length; i++) {
        const v = variants[i];
        if (!v || !v.name) continue;

        const vAttrs = v.variant_attributes || v.variantAttributes || {};
        const vImages = Array.isArray(v.images) && v.images.length > 0 && v.images[0]
          ? await Promise.all(v.images.map((img: string) => resolveExternalImageUrl(img)))
          : (updates.images || []);

        if (v.id && existingIds.has(String(v.id))) {
          incomingIds.add(String(v.id));
          // Update existing variant
          const vSql = `
            UPDATE products SET
              name = ?, model_number = ?, specifications = ?,
              images = ?, badge = ?, variant_attributes = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ? AND parent_id = ?
          `;
          await query(vSql, [
            v.name.trim(),
            v.model_number || v.modelNumber || null,
            JSON.stringify(v.specifications || vAttrs),
            JSON.stringify(vImages),
            v.badge || null,
            JSON.stringify(vAttrs),
            v.id,
            id
          ]);
        } else {
          // Insert new variant
          const vSlug = `${slugify(v.name)}-${id}-${Date.now().toString().slice(-4)}${i}`;
          const vSql = `
            INSERT INTO products (
              name, slug, category, subcategory, model_number, description, short_description,
              images, specifications, features, is_featured, is_new, badge,
              parent_id, is_variant, variant_attributes
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
          `;
          const vResult: any = await query(vSql, [
            v.name.trim(),
            vSlug,
            updates.category || 'lighting',
            updates.subcategory || null,
            v.model_number || v.modelNumber || null,
            updates.description || '',
            updates.short_description || '',
            JSON.stringify(vImages),
            JSON.stringify(v.specifications || vAttrs),
            JSON.stringify(updates.features || []),
            v.is_featured ? 1 : 0,
            v.is_new ? 1 : 0,
            v.badge || null,
            id,
            JSON.stringify(vAttrs),
          ]);
          incomingIds.add(String(vResult.insertId));
        }
      }

      // Delete variants that were removed by admin
      const existingArr = Array.from(existingIds);
      for (let i = 0; i < existingArr.length; i++) {
        const exId = existingArr[i];
        if (!incomingIds.has(exId)) {
          await query('DELETE FROM products WHERE id = ? AND parent_id = ?', [exId, id]);
        }
      }
    }

    const getSql = 'SELECT * FROM products WHERE id = ?';
    const updatedProducts = await query(getSql, [id]) as any[];
    const productData = formatProduct(updatedProducts[0]);

    if (productData) {
      const childRows = await query('SELECT * FROM products WHERE parent_id = ? ORDER BY id ASC', [id]) as any[];
      productData.variants = (childRows || []).map(formatProduct);
    }

    return NextResponse.json({ success: true, data: productData });
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

    // First delete any child variants if this is a parent
    await query('DELETE FROM products WHERE parent_id = ?', [id]);
    // Then delete the product itself
    const sql = 'DELETE FROM products WHERE id = ?';
    await query(sql, [id]);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Product DELETE error:', error);
    return NextResponse.json({ error: error.message || 'Invalid request' }, { status: 400 });
  }
}
