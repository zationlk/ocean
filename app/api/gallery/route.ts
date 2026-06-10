import { NextResponse } from 'next/server'
import { createSupabaseClient } from '@/lib/supabase'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')

  const supabase = createSupabaseClient()

  let query = supabase.from('gallery_items').select('*')

  if (category && category !== 'all') {
    query = query.eq('category', category)
  }

  const { data, error } = await query.order('id', { ascending: false })

  if (error) {
    console.error('Gallery fetch error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data || [])
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const supabase = createSupabaseClient()

    const { data, error } = await supabase
      .from('gallery_items')
      .insert(body)
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
    const { id, ...updates } = body
    const supabase = createSupabaseClient()

    const { data, error } = await supabase
      .from('gallery_items')
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

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Gallery item ID required' }, { status: 400 })
    }

    const supabase = createSupabaseClient()
    const { error } = await supabase.from('gallery_items').delete().eq('id', id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}