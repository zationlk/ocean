import { Database } from './database.types'

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]

// Product types
export type Product = Tables<'products'>
export type Category = Tables<'categories'>
export type Inquiry = Tables<'inquiries'>
export type GalleryItem = Tables<'gallery_items'>
export type SiteSetting = Tables<'site_settings'>

// Inquiry status
export type InquiryStatus = 'unread' | 'read' | 'replied'

// Form types for creating/updating
export type ProductInsert = Database['public']['Tables']['products']['Insert']
export type ProductUpdate = Database['public']['Tables']['products']['Update']
export type CategoryInsert = Database['public']['Tables']['categories']['Insert']
export type CategoryUpdate = Database['public']['Tables']['categories']['Update']
export type InquiryInsert = Database['public']['Tables']['inquiries']['Insert']
export type InquiryUpdate = Database['public']['Tables']['inquiries']['Update']
export type GalleryItemInsert = Database['public']['Tables']['gallery_items']['Insert']
export type GalleryItemUpdate = Database['public']['Tables']['gallery_items']['Update']