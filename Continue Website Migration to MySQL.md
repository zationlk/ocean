# Continue Website Migration to MySQL

> **Workspace:** c:\xampp\htdocs\ocean

---

**User**

#past_chats:ocean-lighting\Migrate Website to MySQL Backend.md 
 
 continue with this

**Assistant**

Let me start by reading the migration document and checking the project structure to understand what needs to be continued.

Let me continue reading the migration document to see where it left off, and also check the current state of key files in the project.

Now I can see the current state. The `lib/data.ts` still contains all static data, and the `admin-actions.ts` is incomplete. Let me check the API routes and admin pages to understand what's left to do.

Let me audit the codebase to find all files still importing static data and understand the current state of API routes and admin pages.

Good - admin products and categories pages are already using APIs. Now let me check the remaining admin pages (dashboard, gallery, projects, inquiries, media, settings, product new/edit) and frontend pages that still import static data.

Now let me check the remaining admin pages, API routes, and frontend pages that still use static data.

Now let me check the remaining API routes and frontend pages that need updating.

Now let me check the remaining frontend pages that need updates.

Now I have a complete picture. Let me check a few more remaining pages and then start executing the migration systematically. Let me use sub-agents to work on multiple files in parallel.

Let me now complete the admin-actions.ts with all the missing actions, then use sub-agents to update admin and frontend pages in parallel.

Good, admin-actions.ts is now complete. Now let me launch sub-agents to update admin pages and frontend pages in parallel. First, let me quickly check if the gallery and projects API routes support PUT.

Now I'll launch sub-agents to update admin pages and frontend pages in parallel.

I'll help you update these 6 admin files to fetch from APIs instead of using static data. Let me start by exploring the project structure and understanding the existing patterns.

Let me explore the codebase structure and read the relevant files to understand the existing patterns.

Now let me read all the relevant files to understand the current patterns and code.

Now let me read the remaining two files and check for type definitions.

Now let me read the reference pattern file (admin/products/page.tsx), the 6 target files, and the key library files.

Now let me check the API routes to understand the response formats for the data handling.

Now let me read the remaining two files for products new and edit pages, and also check a couple API routes to understand response formats.

Excellent, I now have a thorough understanding of all the files. Let me check the media and settings API routes quickly, then start updating the files.

Now let me update the LightingClient.tsx file first.

Now I have a complete understanding. Let me start updating the files. I'll begin with the dashboard page.

Now let me update BathwareClient.tsx with the same pattern.

Dashboard done. Now updating inquiries page.

Now let me update gallery/page.tsx - remove static data and extended gallery, use only API data.

Now let me update ContactClient.tsx - fetch siteSettings from API and use createInquiry from admin-actions.

Now updating the media page.

Now updating settings page.

Now let me update wishlist/page.tsx with siteSettings API fetch.

Now updating products new page.

Now let me update the last file - compare/page.tsx.

Now the final file - products edit page.

Let me verify the changes by running TypeScript diagnostics.

All 6 files have been updated successfully. TypeScript diagnostics passed with 0 errors. Here's a summary of changes per file:

---

### 1. **app/lighting/LightingClient.tsx**
- **Removed**: `import { products as allProducts, categories as allCategories } from "@/lib/data"`
- **Added**: `useState` for `categories`, `products`, `loading` state
- **Added**: `useEffect` with `Promise.all` fetching `/api/categories` and `/api/products`
- **Response handling**: Handles both array responses and `{data:[]}` wrapper via `Array.isArray() ? data : (data.data || [])`
- **Filtering**: `lightingCategories` and `lightingProducts` computed via `useMemo` filtering by `LIGHTING_SLUGS`
- **Loading state**: Skeleton UI for hero section (breadcrumbs, title, pills) + `SkeletonGrid` component (8 product cards)
- **Added imports**: `useEffect`, `SkeletonGrid`, `Category`, `Product` from types

---

### 2. **app/bathware/BathwareClient.tsx**
- **Removed**: Same static import from `@/lib/data`
- **Added**: Same useState/useEffect pattern as LightingClient
- **Fetch**: Same `/api/categories` + `/api/products` dual fetch
- **Filtering**: Filtered by `BATHWARE_SLUGS` via useMemo
- **Loading state**: Same skeleton hero + `SkeletonGrid` (8 cards)
- **Added imports**: `useEffect`, `SkeletonGrid`, `Category`, `Product`

---

### 3. **app/gallery/page.tsx**
- **Removed**: Entire `extendedStaticGallery` array + `staticGalleryItems` import from `@/lib/data`
- **Removed**: Fallback logic that kept static data if API returned nothing
- **Initial state**: `galleryItems` initialized as empty `GalleryItem[]` (not pre-filled)
- **Fetch**: Single `/api/gallery` only — handles array or `{data:[]}` wrapper
- **Loading state**: 6 skeleton masonry cards with varied heights + skeleton text placeholders
- **Lightbox logic**: Preserved entirely (prev/next, zoom, close)
- **Added import**: `GalleryItem` type

---

### 4. **app/contact/ContactClient.tsx**
- **Removed**: `import { siteSettings } from "@/lib/data"`
- **Removed**: `import { createSupabaseBrowserClient } from "@/lib/supabase"`
- **Removed**: Direct Supabase `insert` call
- **Added**: `siteSettings` state (`SiteSettings` + default empty) + `loadingSettings` state
- **Added**: `useEffect` fetching `/api/settings` on mount
- **Form submit**: Uses `createInquiry()` from `@/lib/admin-actions` instead of Supabase
- **Loading infoCards**: Uses empty-string lines while `loadingSettings` is true, cards render with non-breaking spaces
- **WhatsApp/map address**: Renders non-breaking space placeholder while settings load
- **Added imports**: `useEffect`, `createInquiry`, `SiteSettings` type

---

### 5. **app/wishlist/page.tsx**
- **Removed**: `import { siteSettings } from "@/lib/data"`
- **Added**: `useState` + `useEffect` fetching `/api/settings`
- **Default settings**: Empty `SiteSettings` as default while API loads
- **Usage**: `siteSettings.whatsapp` used in per-product WhatsApp links and the "Send Wishlist via WhatsApp" CTA
- **Added imports**: `useState`, `useEffect`, `SiteSettings` type

---

### 6. **app/compare/page.tsx**
- **Removed**: `import { siteSettings } from "@/lib/data"`
- **Added**: `useState` + `useEffect` fetching `/api/settings` on mount
- **Default empty settings**: Empty `SiteSettings` default
- **Usage**: `siteSettings.whatsapp` in per-product WhatsApp inquire links
- **Added imports**: `useState`, `useEffect`, `SiteSettings` type

I noticed there's a bug in the edit page's product lookup logic (line 80). Let me fix that, then run diagnostics.

All 6 files pass with zero TypeScript diagnostics. Let me mark the final task complete and provide the summary.

All 6 admin files have been successfully updated. Here's a summary of changes per file:

---

## Summary of Changes

### 1. **`app/admin/dashboard/page.tsx`**
- **Added** `"use client"` directive, `useState`, `useEffect`, `useCallback` imports, and `toast` from react-hot-toast
- **Removed** static imports of `products` and `categories` from `@/lib/data`
- **Added** `fetchData()` using `Promise.all` to GET `/api/products` and `/api/categories` in parallel
- **Handles** both `Array.isArray(data)` and object responses (via fallback `[]`)
- **Added** `normalise()` helper to convert snake_case (`is_featured`, `short_description`) to camelCase
- **Stats** (total products, categories, featured, new arrivals) and **quickActions** moved inside component to compute from fetched state
- **Lighting/Bathware counts** calculated using `LIGHTING_SLUGS` set on `products.filter()`
- **Progress bar widths** guard against division-by-zero when `products.length === 0`
- **Loading UI**: Skeleton spinner cards for stats + gold spinner for main content area
- **Recent products empty state**: Shows `Package` icon + "No products yet" when none exist
- **Product image fallback**: `onError` handler to Unsplash placeholder for broken images

---

### 2. **`app/admin/inquiries/page.tsx`**
- **Removed** `createSupabaseBrowserClient` import, `noSupabase` state, and the Supabase "not connected" warning UI
- **Added** `updateInquiryStatus` and `deleteInquiry` imports from `@/lib/admin-actions`
- **Replaced** Supabase `from("inquiries").select()` with `fetch("/api/inquiries")` GET
- **Added** `normalise()` helper that maps `product_id → productId`, `product_name → productName`, `created_at → createdAt`
- **Status updates** now call `updateInquiryStatus(id, status)` (which uses `PATCH /api/inquiries` with `{id, status}` body) with optimistic UI update and rollback `fetchInquiries()` on error
- **Deletes** now call `deleteInquiry(id)` (which uses `DELETE /api/inquiries?id=${id}`) instead of direct Supabase `.delete().eq()`
- **Detail panel** uses normalized `current.productName` instead of `current.product_name`
- **Unchanged**: search/filter, animations, mail/WhatsApp reply CTAs, read/replied badges

---

### 3. **`app/admin/media/page.tsx`**
- **Removed** hardcoded `sampleImages` array
- **Added** `useEffect` + `useCallback` `fetchMedia()` that GETs `/api/media`
- **Added** `normalise()` helper to build display `name` (from `originalName`/`original_name`/`filename`) and format `size` as KB from bytes
- **Delete button** now calls `deleteMedia(id)` from admin-actions (→ `DELETE /api/media?id=${id}`) with optimistic UI update and rollback refetch on error
- **Upload handler** now reads each selected file via `FileReader` as dataURL and calls `createMedia(payload)` from admin-actions (→ `POST /api/media`) for each file, prepending created records to the grid
- **Added** loading spinner state while fetching media
- **Added** image `onError` fallback to Unsplash placeholder

---

### 4. **`app/admin/settings/page.tsx`**
- **Removed** `import { siteSettings } from "@/lib/data"`
- **Added** `updateSettings` from `@/lib/admin-actions` and `SiteSettings` type from `@/lib/types`
- **Added** `DEFAULT_SETTINGS` object (all empty strings / nested defaults) used as fallback, so the form renders while fetching
- **Added** `fetchSettings()` → GET `/api/settings` merges response over defaults
- **Loading state**: Shows spinner inside a card skeleton while fetching
- **Submit handler** calls `updateSettings(settings)` → `POST /api/settings` (replaces the fake `setTimeout` simulation)
- **Submit shows error toast** on failure, "Settings saved!" on success (via real API response)
- All existing nested field handling (`businessHours.weekdays` etc.) preserved exactly

---

### 5. **`app/admin/products/new/page.tsx`**
- **Removed** static `categories` import from `@/lib/data`
- **Removed** `supabaseError` state, the amber "Supabase not connected" alert banner, and the fake-success code path
- **Added** `Category` type from `@/lib/types`, `categoriesLoading` state, and `fetchCategories()` → GET `/api/categories` with useEffect
- **Category `<select>`** is `disabled` while `categoriesLoading` is true and shows "Loading categories…" placeholder
- **Submit flow**: Calls `createProduct(payload)` from admin-actions. On `error`, shows real `toast.error("Failed to create: " + error)`. On success, shows success toast, sets saving=false, then navigates. Only the success path now redirects.
- Removed `AlertCircle` import (no longer needed)

---

### 6. **`app/admin/products/[id]/edit/page.tsx`**
- **Removed** `staticProducts`, `categories` static imports from `@/lib/data`
- **Removed** `createSupabaseBrowserClient` import and entire Supabase-first + static fallback logic
- **Removed** `supabaseOk` state and the amber "Supabase not connected" banner
- **Added** `Category` type, `productId` state, `normaliseProduct()` helper (snake→camel)
- **New `loadData()`** runs in parallel:
  1. `GET /api/products?slug=${id}` — when API returns a single object (as the route does for slug lookups), uses it directly; if array returned, finds by id/slug match
  2. Falls back to `GET /api/products` full list and searches by `String(id) === id` or slug match
  3. `GET /api/categories` for the dropdown
- **Populates** `form`, `features`, `specs` from the normalized product; stores the numeric string id in `productId` for the update call
- **Submit**: calls `updateProduct(productId, payload)` with actual id; on `error` shows real error toast; on success navigates back
- **NotFound state** still preserved (product not found in either lookup path)
- Quick featured/new toggles, all form structure, image previews, animated save button — all UI preserved

---

**All 6 files report 0 TypeScript diagnostics errors.** Each file follows the same `useState + useCallback + useEffect(fetchData)` pattern already established in `admin/products/page.tsx` with consistent loading spinners, toast error handling, optimistic updates with rollback refetch, and camelCase/snake_case normalization helpers.

Both sub-agents completed successfully. Now let me work on the remaining frontend pages: product detail pages and projects page. Then I'll clean up static data and run diagnostics.

Good - ProductsClient.tsx is already updated. Now let me handle the remaining files: projects page, product detail pages, and then the data cleanup.

Good - the seed_data.sql is already cleaned. Now let me update the remaining frontend pages (projects, product detail) and then clear the static data file.

---

