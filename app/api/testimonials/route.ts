import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';

const parseTestimonial = (t: any) => ({
  ...t,
  createdAt: t.created_at,
  updatedAt: t.updated_at,
});

export async function GET() {
  try {
    const sql = 'SELECT * FROM testimonials ORDER BY created_at DESC';
    const testimonials = await query(sql) as any[];
    const parsed = Array.isArray(testimonials) ? testimonials.map(parseTestimonial) : [];
    return NextResponse.json(parsed);
  } catch (error: any) {
    console.error('Testimonials fetch error:', error);
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, role, company, content, rating, avatar } = body;

    const sql = `
      INSERT INTO testimonials (name, role, company, content, rating, avatar)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const params = [name, role || null, company || null, content, rating || null, avatar || null];
    const result: any = await query(sql, params);
    const insertId = result.insertId;

    const getSql = 'SELECT * FROM testimonials WHERE id = ?';
    const newTestimonials = await query(getSql, [insertId]) as any[];
    const data = parseTestimonial(newTestimonials[0]);

    return NextResponse.json({ success: true, data }, { status: 201 });
  } catch (error: any) {
    console.error('Testimonial POST error:', error);
    return NextResponse.json({ error: error.message || 'Invalid request body' }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Testimonial ID required' }, { status: 400 });
    }

    const fields: string[] = [];
    const params: any[] = [];
    const allowedFields = ['name', 'role', 'company', 'content', 'rating', 'avatar'];

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

    const sql = `UPDATE testimonials SET ${fields.join(', ')} WHERE id = ?`;
    await query(sql, params);

    const getSql = 'SELECT * FROM testimonials WHERE id = ?';
    const updatedTestimonials = await query(getSql, [id]) as any[];
    const data = parseTestimonial(updatedTestimonials[0]);

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Testimonial PUT error:', error);
    return NextResponse.json({ error: error.message || 'Invalid request body' }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Testimonial ID required' }, { status: 400 });
    }

    const sql = 'DELETE FROM testimonials WHERE id = ?';
    await query(sql, [id]);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Testimonial DELETE error:', error);
    return NextResponse.json({ error: error.message || 'Invalid request' }, { status: 400 });
  }
}
