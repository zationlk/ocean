/**
 * Admin CRUD helpers — use Supabase when configured, fall back to in-memory static data.
 * All functions return { data, error } so callers handle both cases identically.
 */

import { createSupabaseBrowserClient } from "@/lib/supabase";

export interface ProductPayload {
  name: string;
  slug: string;
  category: string;
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
    const sb = createSupabaseBrowserClient();
    const { data, error } = await sb.from("products").insert({
      ...payload,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }).select().single();
    if (error) return { data: null, error: error.message };
    return { data, error: null };
  } catch (e) {
    return { data: null, error: String(e) };
  }
}

export async function updateProduct(id: string, payload: Partial<ProductPayload>) {
  try {
    const sb = createSupabaseBrowserClient();
    const { data, error } = await sb
      .from("products")
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();
    if (error) return { data: null, error: error.message };
    return { data, error: null };
  } catch (e) {
    return { data: null, error: String(e) };
  }
}

export async function deleteProduct(id: string) {
  try {
    const sb = createSupabaseBrowserClient();
    const { error } = await sb.from("products").delete().eq("id", id);
    if (error) return { error: error.message };
    return { error: null };
  } catch (e) {
    return { error: String(e) };
  }
}

export async function toggleFeatured(id: string, current: boolean) {
  return updateProduct(id, { is_featured: !current });
}

export async function toggleNew(id: string, current: boolean) {
  return updateProduct(id, { is_new: !current });
}
