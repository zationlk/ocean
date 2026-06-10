"use client"

import { useState, useEffect, useCallback } from "react"
import { createSupabaseBrowserClient } from "@/lib/supabase"

export function useProducts(options: { 
  category?: string
  featured?: boolean
  limit?: number
  fallback?: Product[]
} = {}) {
  const [products, setProducts] = useState<Product[]>(options.fallback || [])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const supabase = createSupabaseBrowserClient()
      let query = supabase.from("products").select("*")

      if (options.category && options.category !== "all") {
        query = query.eq("category", options.category)
      }
      if (options.featured) {
        query = query.eq("is_featured", true)
      }

      query = query.order("created_at", { ascending: false })

      if (options.limit) {
        query = query.limit(options.limit)
      }

      const { data, error: fetchError } = await query

      if (fetchError) {
        console.error("Fetch error:", fetchError)
        if (options.fallback) {
          setProducts(options.fallback)
        }
      } else if (data && data.length > 0) {
        setProducts(data)
      }
    } catch (err) {
      console.error("Products fetch error:", err)
      if (options.fallback) {
        setProducts(options.fallback)
      }
    } finally {
      setLoading(false)
    }
  }, [options.category, options.featured, options.limit])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  return { products, loading, error, refetch: fetchProducts }
}

export function useCategories(fallback?: Category[]) {
  const [categories, setCategories] = useState<Category[]>(fallback || [])
  const [loading, setLoading] = useState(true)

  const fetchCategories = useCallback(async () => {
    setLoading(true)
    try {
      const supabase = createSupabaseBrowserClient()
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("product_count", { ascending: false })

      if (!error && data && data.length > 0) {
        setCategories(data)
      } else if (fallback) {
        setCategories(fallback)
      }
    } catch {
      if (fallback) setCategories(fallback)
    } finally {
      setLoading(false)
    }
  }, [fallback])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  return { categories, loading, refetch: fetchCategories }
}

export function useGallery(category?: string, fallback?: GalleryItem[]) {
  const [items, setItems] = useState<GalleryItem[]>(fallback || [])
  const [loading, setLoading] = useState(true)

  const fetchGallery = useCallback(async () => {
    setLoading(true)
    try {
      const supabase = createSupabaseBrowserClient()
      let query = supabase.from("gallery_items").select("*")

      if (category && category !== "all") {
        query = query.eq("category", category)
      }

      const { data, error } = await query.order("id", { ascending: false })

      if (!error && data && data.length > 0) {
        setItems(data)
      } else if (fallback) {
        setItems(fallback)
      }
    } catch {
      if (fallback) setItems(fallback)
    } finally {
      setLoading(false)
    }
  }, [category, fallback])

  useEffect(() => {
    fetchGallery()
  }, [fetchGallery])

  return { items, loading, refetch: fetchGallery }
}

export function useSettings(fallback?: Record<string, string>) {
  const [settings, setSettings] = useState<Record<string, string>>(fallback || {})
  const [loading, setLoading] = useState(true)

  const fetchSettings = useCallback(async () => {
    setLoading(true)
    try {
      const supabase = createSupabaseBrowserClient()
      const { data, error } = await supabase.from("site_settings").select("*")

      if (!error && data && data.length > 0) {
        const settingsObj: Record<string, string> = {}
        data.forEach((item: { key: string; value: string }) => {
          settingsObj[item.key] = item.value
        })
        setSettings(settingsObj)
      } else if (fallback) {
        setSettings(fallback)
      }
    } catch {
      if (fallback) setSettings(fallback)
    } finally {
      setLoading(false)
    }
  }, [fallback])

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  return { settings, loading, refetch: fetchSettings }
}

export function useSubmitInquiry() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submitInquiry = async (data: InquiryFormData) => {
    setLoading(true)
    setError(null)

    try {
      const supabase = createSupabaseBrowserClient()
      const { error: submitError } = await supabase.from("inquiries").insert({
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        subject: data.subject,
        message: data.message,
        product_id: data.productId || null,
        product_name: data.productName || null,
        status: "unread",
      })

      if (submitError) {
        setError(submitError.message)
        return { success: false, error: submitError.message }
      }

      return { success: true }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to submit"
      setError(message)
      return { success: false, error: message }
    } finally {
      setLoading(false)
    }
  }

  return { submitInquiry, loading, error }
}

interface Product {
  id: string
  name: string
  slug: string
  category: string
  description: string
  short_description: string
  images: string[]
  specifications?: Record<string, string>
  features?: string[]
  is_featured: boolean
  is_new?: boolean
  badge?: string
}

interface Category {
  id: string
  name: string
  slug: string
  description: string
  icon?: string
  image?: string
  product_count: number
}

interface GalleryItem {
  id: string
  title: string
  description?: string
  image: string
  category: string
}

interface InquiryFormData {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  productId?: string
  productName?: string
}