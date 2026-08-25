import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';

// GET all gallery items
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    let sql = 'SELECT * FROM gallery_items';
    const params: any[] = [];

    if (category && category !== 'all') {
      sql += ' WHERE category = ?';
      params.push(category);
    }

    sql += ' ORDER BY id DESC';

    const items = await query(sql, params) as any[];
    return NextResponse.json(items);
  } catch (error) {
    console.error('Error fetching gallery items:', error);
    return NextResponse.json({ error: 'Failed to fetch gallery items' }, { status: 500 });
  }
}

// POST create new gallery item
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, image, category } = body;
    
    const sql = `
      INSERT INTO gallery_items (title, description, image, category)
      VALUES (?, ?, ?, ?)
    `;
    
    const params = [title, description, image, category];
    await query(sql, params);
    
    return NextResponse.json({ message: 'Gallery item created successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error creating gallery item:', error);
    return NextResponse.json({ error: 'Failed to create gallery item' }, { status: 500 });
  }
}

// PUT update gallery item
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, title, description, image, category } = body;
    
    const sql = `
      UPDATE gallery_items 
      SET title = ?, description = ?, image = ?, category = ?
      WHERE id = ?
    `;
    
    const params = [title, description, image, category, id];
    await query(sql, params);
    
    return NextResponse.json({ message: 'Gallery item updated successfully' });
  } catch (error) {
    console.error('Error updating gallery item:', error);
    return NextResponse.json({ error: 'Failed to update gallery item' }, { status: 500 });
  }
}

// DELETE gallery item
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Gallery item ID required' }, { status: 400 });
    }

    const sql = 'DELETE FROM gallery_items WHERE id = ?';
    await query(sql, [id]);
    
    return NextResponse.json({ message: 'Gallery item deleted successfully' });
  } catch (error) {
    console.error('Error deleting gallery item:', error);
    return NextResponse.json({ error: 'Failed to delete gallery item' }, { status: 500 });
  }
}