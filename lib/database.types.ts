export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          name: string
          slug: string
          category: string
          subcategory: string | null
          description: string
          short_description: string
          images: string[]
          specifications: Json | null
          features: string[] | null
          is_featured: boolean
          is_new: boolean | null
          badge: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          category: string
          subcategory?: string | null
          description: string
          short_description: string
          images?: string[]
          specifications?: Json | null
          features?: string[] | null
          is_featured?: boolean
          is_new?: boolean | null
          badge?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          category?: string
          subcategory?: string | null
          description?: string
          short_description?: string
          images?: string[]
          specifications?: Json | null
          features?: string[] | null
          is_featured?: boolean
          is_new?: boolean | null
          badge?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string
          icon: string | null
          image: string | null
          product_count: number
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description: string
          icon?: string | null
          image?: string | null
          product_count?: number
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string
          icon?: string | null
          image?: string | null
          product_count?: number
        }
      }
      inquiries: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          subject: string
          message: string
          product_id: string | null
          product_name: string | null
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone?: string | null
          subject: string
          message: string
          product_id?: string | null
          product_name?: string | null
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string | null
          subject?: string
          message?: string
          product_id?: string | null
          product_name?: string | null
          status?: string
          created_at?: string
        }
      }
      gallery_items: {
        Row: {
          id: string
          title: string
          description: string | null
          image: string
          category: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          image: string
          category: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          image?: string
          category?: string
        }
      }
      site_settings: {
        Row: {
          id: string
          key: string
          value: string
        }
        Insert: {
          id?: string
          key: string
          value: string
        }
        Update: {
          id?: string
          key?: string
          value?: string
        }
      }
    }
    Enums: {}
  }
}