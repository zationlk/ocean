import { NextResponse } from 'next/server';
import { query } from '@/lib/mysql';
import { revalidateTag } from 'next/cache';

const DEFAULT_SETTINGS = {
  companyName: 'Ocean Lighting Solutions',
  tagline: 'Premium Lighting & Bathware',
  address: '',
  email: '',
  website: '',
  telephone: '',
  mobile: '',
  whatsapp: '',
  businessHours: { weekdays: '', saturday: '', sunday: '' },
  socialMedia: { facebook: '', instagram: '', youtube: '' },
  heroTitle: 'Welcome',
  heroSubtitle: '',
  aboutText: '',
  metaDescription: '',
};

export async function GET() {
  try {
    const sql = 'SELECT `key`, `value` FROM site_settings';
    const rows = await query(sql) as any[];

    const settingsMap: Record<string, any> = { ...DEFAULT_SETTINGS };

    for (const row of rows) {
      try {
        settingsMap[row.key] = JSON.parse(row.value);
      } catch {
        settingsMap[row.key] = row.value;
      }
    }

    return NextResponse.json(settingsMap);
  } catch (error: any) {
    console.error('Settings fetch error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const entries = Object.entries(body);

    const valuesSql = entries.map(() => '(?, ?)').join(', ');
    const params: any[] = [];

    for (const [key, val] of entries) {
      params.push(key);
      params.push(typeof val === 'object' ? JSON.stringify(val) : String(val));
    }

    const sql = `
      INSERT INTO site_settings (\`key\`, \`value\`) VALUES ${valuesSql}
      ON DUPLICATE KEY UPDATE \`value\` = VALUES(\`value\`), updated_at = CURRENT_TIMESTAMP
    `;

    await query(sql, params);
    revalidateTag('site-settings');
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Settings POST error:', error);
    return NextResponse.json({ error: error.message || 'Invalid request body' }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { key, value } = body;

    if (!key) {
      return NextResponse.json({ error: 'Setting key required' }, { status: 400 });
    }

    const serializedValue = typeof value === 'object' ? JSON.stringify(value) : String(value);

    const sql = `
      INSERT INTO site_settings (\`key\`, \`value\`) VALUES (?, ?)
      ON DUPLICATE KEY UPDATE \`value\` = ?, updated_at = CURRENT_TIMESTAMP
    `;

    await query(sql, [key, serializedValue, serializedValue]);
    revalidateTag('site-settings');
    return NextResponse.json({ success: true, data: { key, value } });
  } catch (error: any) {
    console.error('Settings PUT error:', error);
    return NextResponse.json({ error: error.message || 'Invalid request body' }, { status: 400 });
  }
}
