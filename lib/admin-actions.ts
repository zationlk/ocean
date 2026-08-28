export interface ProductPayload {
  name: string;
  slug: string;
  category: string;
  subcategory?: string;
  model_number?: string;
  short_description: string;
  description: string;
  images: string[];
  features: string[];
  specifications: Record<string, string>;
  is_featured: boolean;
  is_new: boolean;
  badge: string;
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function buildSlug(name: string): string {
  return slugify(name);
}

export async function createProduct(payload: ProductPayload) {
  try {
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok) return { data: null, error: json.error || "Failed to create product" };
    return { data: json.data, error: null };
  } catch (e: any) {
    return { data: null, error: String(e) };
  }
}

export async function updateProduct(id: string | number, payload: Partial<ProductPayload>) {
  try {
    const res = await fetch("/api/products", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...payload }),
    });
    const json = await res.json();
    if (!res.ok) return { data: null, error: json.error || "Failed to update product" };
    return { data: json.data, error: null };
  } catch (e: any) {
    return { data: null, error: String(e) };
  }
}

export async function deleteProduct(id: string | number) {
  try {
    const res = await fetch(`/api/products?id=${id}`, { method: "DELETE" });
    const json = await res.json();
    if (!res.ok) return { error: json.error || "Failed to delete product" };
    return { error: null };
  } catch (e: any) {
    return { error: String(e) };
  }
}

export async function toggleFeatured(id: string | number, current: boolean) {
  return updateProduct(id, { is_featured: !current });
}

export async function toggleNew(id: string | number, current: boolean) {
  return updateProduct(id, { is_new: !current });
}

export async function createCategory(payload: any) {
  try {
    const res = await fetch("/api/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok) return { data: null, error: json.error || "Failed to create category" };
    return { data: json.data, error: null };
  } catch (e: any) {
    return { data: null, error: String(e) };
  }
}

export async function updateCategory(id: string | number, payload: any) {
  try {
    const res = await fetch("/api/categories", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...payload }),
    });
    const json = await res.json();
    if (!res.ok) return { data: null, error: json.error || "Failed to update category" };
    return { data: json.data, error: null };
  } catch (e: any) {
    return { data: null, error: String(e) };
  }
}

export async function deleteCategory(id: string | number) {
  try {
    const res = await fetch(`/api/categories?id=${id}`, { method: "DELETE" });
    const json = await res.json();
    if (!res.ok) return { error: json.error || "Failed to delete category" };
    return { error: null };
  } catch (e: any) {
    return { error: String(e) };
  }
}

// ─── TESTIMONIALS ─────────────────────────────────────────────────────────────

export async function createTestimonial(payload: any) {
  try {
    const res = await fetch("/api/testimonials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok) return { data: null, error: json.error || "Failed to create testimonial" };
    return { data: json.data, error: null };
  } catch (e: any) {
    return { data: null, error: String(e) };
  }
}

export async function updateTestimonial(idOrPayload: any, payload?: any) {
  try {
    const bodyPayload = payload ? { id: idOrPayload, ...payload } : idOrPayload;
    const res = await fetch("/api/testimonials", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bodyPayload),
    });
    const json = await res.json();
    if (!res.ok) return { data: null, error: json.error || "Failed to update testimonial" };
    return { data: json.data, error: null };
  } catch (e: any) {
    return { data: null, error: String(e) };
  }
}

export async function deleteTestimonial(id: string | number) {
  try {
    const res = await fetch(`/api/testimonials?id=${id}`, { method: "DELETE" });
    const json = await res.json();
    if (!res.ok) return { error: json.error || "Failed to delete testimonial" };
    return { error: null };
  } catch (e: any) {
    return { error: String(e) };
  }
}

// ─── BRANDS ───────────────────────────────────────────────────────────────────

export async function createBrand(payload: any) {
  try {
    const res = await fetch("/api/brands", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok) return { data: null, error: json.error || "Failed to create brand" };
    return { data: json.data, error: null };
  } catch (e: any) {
    return { data: null, error: String(e) };
  }
}

export async function updateBrand(idOrPayload: any, payload?: any) {
  try {
    const bodyPayload = payload ? { id: idOrPayload, ...payload } : idOrPayload;
    const res = await fetch("/api/brands", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bodyPayload),
    });
    const json = await res.json();
    if (!res.ok) return { data: null, error: json.error || "Failed to update brand" };
    return { data: json.data, error: null };
  } catch (e: any) {
    return { data: null, error: String(e) };
  }
}

export async function deleteBrand(id: string | number) {
  try {
    const res = await fetch(`/api/brands?id=${id}`, { method: "DELETE" });
    const json = await res.json();
    if (!res.ok) return { error: json.error || "Failed to delete brand" };
    return { error: null };
  } catch (e: any) {
    return { error: String(e) };
  }
}

// ─── GALLERY ──────────────────────────────────────────────────────────────────

export async function createGallery(payload: any) {
  try {
    const res = await fetch("/api/gallery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok) return { data: null, error: json.error || "Failed to create gallery item" };
    return { data: json.data, error: null };
  } catch (e: any) {
    return { data: null, error: String(e) };
  }
}

export async function updateGallery(id: string | number, payload: any) {
  try {
    const res = await fetch("/api/gallery", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...payload }),
    });
    const json = await res.json();
    if (!res.ok) return { data: null, error: json.error || "Failed to update gallery item" };
    return { data: json.data, error: null };
  } catch (e: any) {
    return { data: null, error: String(e) };
  }
}

export async function deleteGallery(id: string | number) {
  try {
    const res = await fetch(`/api/gallery?id=${id}`, { method: "DELETE" });
    const json = await res.json();
    if (!res.ok) return { error: json.error || "Failed to delete gallery item" };
    return { error: null };
  } catch (e: any) {
    return { error: String(e) };
  }
}

// ─── PROJECTS ─────────────────────────────────────────────────────────────────

export async function createProject(payload: any) {
  try {
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok) return { data: null, error: json.error || "Failed to create project" };
    return { data: json.data, error: null };
  } catch (e: any) {
    return { data: null, error: String(e) };
  }
}

export async function updateProject(id: string | number, payload: any) {
  try {
    const res = await fetch(`/api/projects/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok) return { data: null, error: json.error || "Failed to update project" };
    return { data: json.data, error: null };
  } catch (e: any) {
    return { data: null, error: String(e) };
  }
}

export async function deleteProject(id: string | number) {
  try {
    const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
    const json = await res.json();
    if (!res.ok) return { error: json.error || "Failed to delete project" };
    return { error: null };
  } catch (e: any) {
    return { error: String(e) };
  }
}

// ─── MEDIA ────────────────────────────────────────────────────────────────────

export async function createMedia(payload: any) {
  try {
    const res = await fetch("/api/media", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok) return { data: null, error: json.error || "Failed to upload media" };
    return { data: json.data, error: null };
  } catch (e: any) {
    return { data: null, error: String(e) };
  }
}

export async function deleteMedia(id: string | number) {
  try {
    const res = await fetch(`/api/media?id=${id}`, { method: "DELETE" });
    const json = await res.json();
    if (!res.ok) return { error: json.error || "Failed to delete media" };
    return { error: null };
  } catch (e: any) {
    return { error: String(e) };
  }
}

// ─── INQUIRIES ────────────────────────────────────────────────────────────────

export async function updateInquiryStatus(id: string | number, status: "unread" | "read" | "replied") {
  try {
    const res = await fetch("/api/inquiries", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    const json = await res.json();
    if (!res.ok) return { error: json.error || "Failed to update inquiry" };
    return { error: null };
  } catch (e: any) {
    return { error: String(e) };
  }
}

export async function deleteInquiry(id: string | number) {
  try {
    const res = await fetch(`/api/inquiries?id=${id}`, { method: "DELETE" });
    const json = await res.json();
    if (!res.ok) return { error: json.error || "Failed to delete inquiry" };
    return { error: null };
  } catch (e: any) {
    return { error: String(e) };
  }
}

export async function createInquiry(payload: any) {
  try {
    const res = await fetch("/api/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok) return { data: null, error: json.error || "Failed to send inquiry" };
    return { data: json.data, error: null };
  } catch (e: any) {
    return { data: null, error: String(e) };
  }
}

// ─── SETTINGS ─────────────────────────────────────────────────────────────────

export async function updateSettings(payload: Record<string, any>) {
  try {
    const res = await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json();
    if (!res.ok) return { error: json.error || "Failed to save settings" };
    return { error: null };
  } catch (e: any) {
    return { error: String(e) };
  }
}
