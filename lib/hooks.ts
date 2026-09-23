"use client"

import { useState, useEffect, useCallback } from "react"
import { fetchSettingsCached } from "@/lib/settings-cache"

// ─────────────────────────────────────────────
// Type definitions
// ─────────────────────────────────────────────

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

// ─────────────────────────────────────────────
// useProducts — fetches from /api/products
// ─────────────────────────────────────────────

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
      const params = new URLSearchParams()
      if (options.category && options.category !== "all") {
        params.set("category", options.category)
      }
      if (options.featured) {
        params.set("featured", "true")
      }
      if (options.limit) {
        params.set("limit", String(options.limit))
      }

      const res = await fetch(`/api/products?${params.toString()}`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)

      const data = await res.json()
      const list: Product[] = Array.isArray(data) ? data : (data.data || [])

      if (list.length > 0) {
        setProducts(list)
      } else if (options.fallback) {
        setProducts(options.fallback)
      }
    } catch (err) {
      console.error("Products fetch error:", err)
      if (options.fallback) setProducts(options.fallback)
      setError(err instanceof Error ? err.message : "Failed to load products")
    } finally {
      setLoading(false)
    }
  }, [options.category, options.featured, options.limit]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  return { products, loading, error, refetch: fetchProducts }
}

// ─────────────────────────────────────────────
// useCategories — fetches from /api/categories
// ─────────────────────────────────────────────

export function useCategories(fallback?: Category[]) {
  const [categories, setCategories] = useState<Category[]>(fallback || [])
  const [loading, setLoading] = useState(true)

  const fetchCategories = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/categories")
      if (!res.ok) throw new Error(`HTTP ${res.status}`)

      const data = await res.json()
      const list: Category[] = Array.isArray(data) ? data : (data.data || [])

      if (list.length > 0) {
        setCategories(list)
      } else if (fallback) {
        setCategories(fallback)
      }
    } catch {
      if (fallback) setCategories(fallback)
    } finally {
      setLoading(false)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  return { categories, loading, refetch: fetchCategories }
}

// ─────────────────────────────────────────────
// useGallery — fetches from /api/gallery
// ─────────────────────────────────────────────

export function useGallery(category?: string, fallback?: GalleryItem[]) {
  const [items, setItems] = useState<GalleryItem[]>(fallback || [])
  const [loading, setLoading] = useState(true)

  const fetchGallery = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (category && category !== "all") params.set("category", category)

      const res = await fetch(`/api/gallery?${params.toString()}`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)

      const data = await res.json()
      const list: GalleryItem[] = Array.isArray(data) ? data : (data.data || [])

      if (list.length > 0) {
        setItems(list)
      } else if (fallback) {
        setItems(fallback)
      }
    } catch {
      if (fallback) setItems(fallback)
    } finally {
      setLoading(false)
    }
  }, [category]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchGallery()
  }, [fetchGallery])

  return { items, loading, refetch: fetchGallery }
}

// ─────────────────────────────────────────────
// useSettings — fetches from /api/settings (cached)
// ─────────────────────────────────────────────

export function useSettings(fallback?: Record<string, string>) {
  const [settings, setSettings] = useState<Record<string, string>>(fallback || {})
  const [loading, setLoading] = useState(true)

  const fetchSettings = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetchSettingsCached()
      if (Object.keys(data).length > 0) {
        setSettings(data)
      } else if (fallback) {
        setSettings(fallback)
      }
    } catch {
      if (fallback) setSettings(fallback)
    } finally {
      setLoading(false)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  return { settings, loading, refetch: fetchSettings }
}

// ─────────────────────────────────────────────
// useSubmitInquiry — POSTs to /api/inquiries
// ─────────────────────────────────────────────

export function useSubmitInquiry() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submitInquiry = async (data: InquiryFormData) => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone || null,
          subject: data.subject,
          message: data.message,
          product_id: data.productId || null,
          product_name: data.productName || null,
          status: "unread",
        }),
      })

      if (!res.ok) {
        const json = await res.json().catch(() => ({}))
        const msg = json.error || `HTTP ${res.status}`
        setError(msg)
        return { success: false, error: msg }
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