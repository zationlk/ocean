import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';

const parseMedia = (m: any) => ({
  ...m,
  originalName: m.original_name,
  mimeType: m.mime_type,
  altText: m.alt_text,
  createdAt: m.created_at,
  updatedAt: m.updated_at,
});

export async function GET() {
  try {
    const sql = 'SELECT * FROM media ORDER BY created_at DESC';
    const media = await query(sql) as any[];
    const parsed = media.map(parseMedia);
    return NextResponse.json(parsed || []);
  } catch (error: any) {
    console.error('Media fetch error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch media' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      filename,
      original_name,
      filepath,
      url,
      mime_type,
      size,
      width,
      height,
      caption,
      alt_text,
    } = body;

    const sql = `
      INSERT INTO media (filename, original_name, filepath, url, mime_type, size, width, height, caption, alt_text)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
      filename,
      original_name,
      filepath,
      url,
      mime_type || null,
      size || null,
      width || null,
      height || null,
      caption || null,
      alt_text || null,
    ];
    const result: any = await query(sql, params);
    const insertId = result.insertId;

    const getSql = 'SELECT * FROM media WHERE id = ?';
    const newMedia = await query(getSql, [insertId]) as any[];
    const data = parseMedia(newMedia[0]);

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error: any) {
    console.error('Media POST error:', error);
    return NextResponse.json({ error: error.message || 'Invalid request body' }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Media ID required' }, { status: 400 });
    }

    const sql = 'DELETE FROM media WHERE id = ?';
    await query(sql, [id]);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Media DELETE error:', error);
    return NextResponse.json({ error: error.message || 'Invalid request' }, { status: 400 });
  }
}
