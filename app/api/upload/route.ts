import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { query } from '@/lib/mysql';

const ALLOWED_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'webp', 'svg', 'gif']);
const MAX_UPLOAD_BYTES = 10 * 1024 * 1024; // 10MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const originalName = file.name || 'image.jpg';
    const extension = (originalName.split('.').pop() || '').toLowerCase();
    const mimeType = file.type || 'application/octet-stream';

    if (!ALLOWED_EXTENSIONS.has(extension) || !mimeType.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Invalid file type. Only images (JPG, PNG, WebP, SVG, GIF) are allowed.' },
        { status: 400 }
      );
    }

    if (file.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB.' },
        { status: 400 }
      );
    }

    // Prepare upload directory in public/uploads
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadDir, { recursive: true });

    // Generate safe, unique filename
    const sanitizedBase = originalName
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .slice(0, 50);
    const uniqueSuffix = `${Date.now()}_${Math.floor(Math.random() * 10000)}`;
    const filename = `${sanitizedBase}_${uniqueSuffix}.${extension}`;
    const filePath = path.join(uploadDir, filename);

    // Write file to disk
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/${filename}`;

    // Insert record into media table
    let insertId: number | null = null;
    try {
      const sql = `
        INSERT INTO media (filename, original_name, filepath, url, mime_type, size, width, height, caption, alt_text)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const params = [
        filename,
        originalName,
        publicUrl,
        publicUrl,
        mimeType,
        file.size,
        0,
        0,
        '',
        sanitizedBase.replace(/_/g, ' '),
      ];
      const result: any = await query(sql, params);
      insertId = result.insertId;
    } catch (dbErr) {
      console.warn('Could not insert media into database table:', dbErr);
    }

    const data = {
      id: insertId ? String(insertId) : filename,
      url: publicUrl,
      filename,
      originalName,
      mimeType,
      size: file.size,
      width: 0,
      height: 0,
      caption: '',
      altText: sanitizedBase.replace(/_/g, ' '),
    };

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: error.message || 'File upload failed' },
      { status: 500 }
    );
  }
}
