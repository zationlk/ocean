import { NextResponse } from 'next/server'
import { createSupabaseClient } from '@/lib/supabase'

export async function GET() {
  const supabase = createSupabaseClient()

  const { data, error } = await supabase
    .from('site_settings')
    .select('*')

  if (error) {
    console.error('Settings fetch error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data || [])
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const supabase = createSupabaseClient()

    const { data, error } = await supabase
      .from('site_settings')
      .upsert(body, { onConflict: 'key' })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { key, value } = body
    const supabase = createSupabaseClient()

    const { data, error } = await supabase
      .from('site_settings')
      .update({ value })
      .eq('key', key)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
}