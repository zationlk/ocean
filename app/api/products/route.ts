import { NextResponse } from 'next/server'
import { createSupabaseClient } from '@/lib/supabase'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')
  const featured = searchParams.get('featured')
  const slug = searchParams.get('slug')
  const limit = searchParams.get('limit')

  const supabase = createSupabaseClient()

  // Handle single product by slug
  if (slug) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json(data)
  }

  // Build query for multiple products
  let query = supabase.from('products').select('*')

  if (category && category !== 'all') {
    query = query.eq('category', category)
  }
  if (featured === 'true') {
    query = query.eq('is_featured', true)
  }

  query = query.order('created_at', { ascending: false })

  if (limit) {
    query = query.limit(parseInt(limit))
  }

  const { data, error } = await query

  if (error) {
    console.error('Products fetch error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data || [])
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const supabase = createSupabaseClient()

    const { data, error } = await supabase
      .from('products')
      .insert(body)
      .select()
      .single()

    if (error) {
      console.error('Product insert error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Product POST error:', error)
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
}