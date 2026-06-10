export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  subcategory?: string;
  description: string;
  shortDescription: string;
  images: string[];
  specifications?: Record<string, string>;
  features?: string[];
  isFeatured: boolean;
  isNew?: boolean;
  badge?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  image: string;
  productCount?: number;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company?: string;
  content: string;
  rating: number;
  avatar?: string;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  productId?: string;
  productName?: string;
  status: "unread" | "read" | "replied";
  createdAt: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  description?: string;
  image: string;
  category: string;
}

export interface Brand {
  id: string;
  name: string;
  logo: string;
  website?: string;
}

export interface SiteSettings {
  companyName: string;
  tagline: string;
  address: string;
  email: string;
  website: string;
  telephone: string;
  mobile: string;
  whatsapp: string;
  businessHours: {
    weekdays: string;
    saturday: string;
    sunday: string;
  };
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
  };
  heroTitle: string;
  heroSubtitle: string;
  aboutText: string;
  metaDescription: string;
}
