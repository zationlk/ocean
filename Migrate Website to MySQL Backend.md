# Migrate Website to MySQL Backend

> **Workspace:** c:\xampp\htdocs\ocean

---

**User**

i think still the entire website is Running on static data — where changes won't persist in the pages like products, categories, projects, gallery, inquires, media, settings and other.permenantely delete all the sample data, and make the entire website properly work on the mysql backend database.

**Assistant**

I'll analyze the project structure first to understand the current setup, identify where static data is stored, and then plan the migration to a MySQL backend. Let me start by exploring the codebase.

Good, I can see the project structure. Now let me examine the key files to understand the current setup - the static data source, database connection, and API routes.

Now let me examine the existing API routes and admin pages to understand the current integration patterns.

I see the issue clearly now. Some API routes use Supabase, some use MySQL, and the frontend still imports from static `data.ts`. Let me examine the frontend components and admin pages to understand the full scope.

Now let me check the missing API routes, the admin pages patterns, and the types file to understand the full data structure.

Now I have a complete understanding. Let me check a few admin pages and then proceed with the systematic migration. Let me also check if there's a `.env.local` file for configuration.

Let me update the database schema with missing tables and create a clean version without sample data.

Now let me clean the seed data file and start converting all the API routes. I'll work on multiple files in parallel.

Now let me convert all the Supabase API routes to MySQL. I'll work on multiple files simultaneously.

Now let me create the missing API routes (testimonials, brands, media) and update admin-actions.ts.

Let me first explore the existing codebase to understand the patterns used for similar API routes.

Now let me create the three route files. I'll start with testimonials/route.ts:

All three API route files have been created successfully. Here's a summary of each:

### 1. `app/api/testimonials/route.ts`
- **GET**: Lists all testimonials ordered by `created_at DESC`, with fields parsed to camelCase (`createdAt`, `updatedAt`)
- **POST**: Inserts `name`, `role`, `company`, `content`, `rating`, `avatar`. Returns the newly created record with `{ success: true, data }`
- **PUT**: Updates by `id` from JSON body. Uses allowed-fields filtering (`name`, `role`, `company`, `content`, `rating`, `avatar`), auto-sets `updated_at`
- **DELETE**: Deletes by `?id=` query param

### 2. `app/api/brands/route.ts`
- **GET**: Lists all brands ordered by `sort_order`, with fields parsed to camelCase (`sortOrder`, `createdAt`, `updatedAt`)
- **POST**: Inserts `name`, `logo`, `website`, `sort_order`. Returns the newly created record
- **PUT**: Updates by `id` from JSON body. Uses allowed-fields filtering (`name`, `logo`, `website`, `sort_order`), auto-sets `updated_at`
- **DELETE**: Deletes by `?id=` query param

### 3. `app/api/media/route.ts`
- **GET**: Lists all media ordered by `created_at DESC`, with fields parsed to camelCase (`originalName`, `mimeType`, `altText`, `createdAt`, `updatedAt`)
- **POST**: Inserts `filename`, `original_name`, `filepath`, `url`, `mime_type`, `size`, `width`, `height`, `caption`, `alt_text`. Returns the newly created record
- **DELETE**: Deletes by `?id=` query param (no PUT endpoint as requested)

All routes use `import { query } from '@/lib/mysql'` and follow the same response patterns as the existing `categories` route — returning success-wrapped objects for POST/PUT/DELETE and camelCase-parsed arrays for GET.

Now let me update admin-actions.ts to use API routes instead of Supabase.

Now let me update all the frontend and admin pages to fetch from APIs. This is a large task, so I'll use sub-agents for efficiency.

I'll help you update these files to fetch data from API endpoints. Let me start by exploring the project structure and reading the relevant files.

I'll help you update these files to fetch data from APIs. Let me start by exploring the project structure and reading the current files.

Now let me read all the relevant files to understand the current implementation and data structures.

Now let me check the `lib/data.ts` file to understand the shape of `siteSettings`, `products`, and `categories`:

Let me also check the SkeletonCard component and the API routes to understand the data structures.

Now I have all the context needed. Let me start updating each file. I'll begin with CategoriesSection.tsx.

Now I have a clear picture of the data structure. Let me update all the files one by one. Starting with the first component - Navbar.tsx.

Navbar is updated. Now let me update Footer.tsx:

CategoriesSection is done. Now let me update FeaturedProducts.tsx.

Now updating WhatsAppButton.tsx:

Now updating QuickView.tsx:

Now let me update NewArrivals.tsx.

Now updating ProductCard.tsx:

Now let me update ProductMarquee.tsx.

Now updating HeroSection.tsx:

Now let me update TestimonialsSection.tsx.

Now updating CTASection.tsx - this one has `cards` defined at module level using siteSettings, so I need to restructure it:

Now the final component - SearchModal.tsx - this one needs to fetch both products and categories from APIs:

Now I need to add loading state display in SearchModal. Let me update the results section:

Now let me update BrandsSection.tsx. It doesn't import from @/lib/data, but it does use hardcoded brands. Let me update it to fetch from the API.

All components are now updated. Let me mark the task complete and run diagnostics:

All files are updated. Now let me verify the changes by checking for TypeScript errors.

Good, the types are all compatible. Now let me run diagnostics to check for any TypeScript or lint errors.

All files have been updated successfully with no TypeScript or lint errors. Here's a summary of the changes made:

## Summary of Updates

### Components fetching `siteSettings` from `/api/settings`:

1. **`components/layout/Navbar.tsx`** (lines 54-72): Added `useState` + `useEffect` to fetch siteSettings with empty placeholder strings for `address`, `telephone`, `mobile`, `email`. Loading state tracked with `isLoading`.

2. **`components/layout/Footer.tsx`** (lines 1-44): Added `"use client"` directive, imported `useState` + `useEffect`. Default placeholders include all nested objects (`businessHours`, `socialMedia`).

3. **`components/ui/WhatsAppButton.tsx`** (lines 3-34): Fetches only `whatsapp` from settings. Returns `null` while loading (no WhatsApp number = don't show the button).

4. **`components/ui/QuickView.tsx`** (lines 11-14, 41-64): Fetch happens inside the `QuickViewModal` component. Defaults include `whatsapp` and `telephone`.

5. **`components/products/ProductCard.tsx`** (lines 10-14, 40-62): Fetches only `whatsapp` needed for the WhatsApp inquiry link.

6. **`components/home/HeroSection.tsx`** (lines 8-10, 67-90): Fetches `telephone` for the call CTA button.

7. **`components/home/CTASection.tsx`** (lines 8-17, 19-74): The `cards` array was moved inside the component (previously at module-level referencing `siteSettings` statically). Fetches `telephone`, `mobile`, `whatsapp`, and `businessHours`.

### Component fetching products & categories:

8. **`components/ui/SearchModal.tsx`** (lines 3-62, 132-139): Added interfaces for `Product` and `Category`. Fetches both `/api/products` and `/api/categories` in parallel using `Promise.all`. Added a loading spinner (`animate-spin`) that displays while data is being fetched. Handles both array and `{data: []}` response shapes.

All components maintain their existing imports, styles, and functionality — only the data source was changed from static imports to API fetches with loading states.

No diagnostics errors. Let me check the package.json for any available scripts and run the build/typecheck if available.

Lint passed successfully (exit code 0) with only pre-existing warnings about `<img>` elements, none related to our changes. All files have been successfully updated. Here's a summary of the changes:

## Summary of Updates

### 1. **CategoriesSection.tsx** (`components/home/CategoriesSection.tsx:1`)
- Added `"use client"` (was already present)
- Replaced imports from `@/lib/data` with `useState`, `useEffect` from React and `Category`, `Product` types from `@/lib/types`
- Added state for `categories`, `products`, and `loading`
- Fetches both `/api/categories` and `/api/products` in parallel via `Promise.all`
- Added skeleton loading state with category card placeholders
- All existing UI, filtering logic (lighting vs bathware), and `countMap` preserved

### 2. **FeaturedProducts.tsx** (`components/home/FeaturedProducts.tsx:1`)
- Added `"use client"` (was already present)
- Replaced `staticProducts` import with `useState`, `useEffect` and `Product` type
- Added state for `products` and `loading`
- Fetches `/api/products?featured=true`
- Added skeleton loading grid (6 cards) with matching structure to product cards
- Tab filtering logic (all/lighting/bathware) and animations fully preserved

### 3. **NewArrivals.tsx** (`components/home/NewArrivals.tsx:1`)
- Added `"use client"` directive
- Replaced `@/lib/data` import with `useState`, `useEffect` and `Product` type
- Added state for `products` and `loading`
- Fetches `/api/products?limit=8` (ordered by `created_at DESC` by API)
- Added skeleton loading grid (4 cards)
- Existing `isNew` filter and `.slice(0, 4)` logic preserved

### 4. **ProductMarquee.tsx** (`components/home/ProductMarquee.tsx:1`)
- Added `"use client"` directive
- Replaced `@/lib/data` import with `useState`, `useEffect` and `Product` type
- Added state for `products` and `loading`
- Fetches `/api/products?limit=12`
- Loading state renders an empty `div` with matching section styling (as requested)
- Seamless marquee duplication `[...products, ...products]` preserved

### 5. **TestimonialsSection.tsx** (`components/home/TestimonialsSection.tsx:1`)
- Added `"use client"` (was already present)
- Replaced `@/lib/data` import with `useState`, `useEffect` and `Testimonial` type
- Added state for `testimonials` and `loading`
- Fetches `/api/testimonials`
- Added skeleton loading grid (4 testimonial cards) with star placeholders and author area
- All framer-motion animations and social proof strip fully preserved

### 6. **BrandsSection.tsx** (`components/home/BrandsSection.tsx:1`)
- Added `"use client"` (was already present)
- Replaced hardcoded string array with `useState`, `useEffect` and `Brand` type
- Added state for `brands` and `loading`
- Fetches `/api/brands`
- Added skeleton loading marquee with placeholder brand bars
- Changed key to `${brand.id}-${index}` and uses `brand.name` for display
- Triple-duplication marquee logic `[...brands, ...brands, ...brands]` preserved

I'll help you update these 10 files to fetch data from APIs instead of using static imports. Let me start by exploring the project structure and reading the current files.

Let me start by exploring the project structure and reading all the relevant admin files and API routes.

Now let me read all the relevant admin files, API routes, and library files.

Now let me read the data file and check the API routes to understand the data structures:

Now let me read the API routes and lib files to understand the endpoints and data structures.

Now I have a complete understanding of the codebase. Let me start updating the files one by one.

Now let me start updating the admin files. Starting with **app/admin/products/page.tsx**.

Now updating **app/admin/categories/page.tsx** to use fetch calls and add loading state.

---

