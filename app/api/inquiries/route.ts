import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';

export async function GET() {
  try {
    const sql = 'SELECT * FROM inquiries ORDER BY created_at DESC';
    const inquiries = await query(sql) as any[];

    const parsedInquiries = inquiries.map(i => ({
      ...i,
      productId: i.product_id,
      productName: i.product_name,
      createdAt: i.created_at,
    }));

    return NextResponse.json(parsedInquiries || []);
  } catch (error: any) {
    console.error('Inquiries fetch error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch inquiries' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, subject, message, product_id, product_name } = body;

    const sql = `
      INSERT INTO inquiries (name, email, phone, subject, message, product_id, product_name, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'unread')
    `;

    const params = [
      name, email, phone || null, subject, message,
      product_id || null, product_name || null,
    ];

    const result: any = await query(sql, params);
    const insertId = result.insertId;

    const getSql = 'SELECT * FROM inquiries WHERE id = ?';
    const newInquiries = await query(getSql, [insertId]) as any[];
    const i = newInquiries[0];
    const data = {
      ...i,
      productId: i.product_id,
      productName: i.product_name,
      createdAt: i.created_at,
    };

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Inquiry POST error:', error);
    return NextResponse.json({ error: error.message || 'Invalid request body' }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Inquiry ID required' }, { status: 400 });
    }

    const fields: string[] = [];
    const params: any[] = [];
    const allowedFields = ['name', 'email', 'phone', 'subject', 'message', 'product_id', 'product_name', 'status'];

    for (const key of allowedFields) {
      if (key in updates) {
        fields.push(`${key} = ?`);
        params.push(updates[key]);
      }
    }

    if (fields.length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    params.push(id);
    const sql = `UPDATE inquiries SET ${fields.join(', ')} WHERE id = ?`;
    await query(sql, params);

    const getSql = 'SELECT * FROM inquiries WHERE id = ?';
    const updatedInquiries = await query(getSql, [id]) as any[];
    const i = updatedInquiries[0];
    const data = {
      ...i,
      productId: i.product_id,
      productName: i.product_name,
      createdAt: i.created_at,
    };

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Inquiry PATCH error:', error);
    return NextResponse.json({ error: error.message || 'Invalid request body' }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Inquiry ID required' }, { status: 400 });
    }

    const sql = 'DELETE FROM inquiries WHERE id = ?';
    await query(sql, [id]);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Inquiry DELETE error:', error);
    return NextResponse.json({ error: error.message || 'Invalid request' }, { status: 400 });
  }
}
