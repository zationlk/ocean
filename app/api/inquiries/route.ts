import { NextResponse } from 'next/server'
import { createSupabaseClient } from '@/lib/supabase'

export async function GET() {
  const supabase = createSupabaseClient()

  const { data, error } = await supabase
    .from('inquiries')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Inquiries fetch error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data || [])
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const supabase = createSupabaseClient()

    const { data, error } = await supabase
      .from('inquiries')
      .insert({
        ...body,
        status: 'unread',
      })
      .select()
      .single()

    if (error) {
      console.error('Inquiry insert error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Inquiry POST error:', error)
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { id, ...updates } = body
    const supabase = createSupabaseClient()

    const { data, error } = await supabase
      .from('inquiries')
      .update(updates)
      .eq('id', id)
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