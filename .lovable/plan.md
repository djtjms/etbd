## Plan: Dynamic Client Logos with Admin Management

### What will be built

The hardcoded client logos on the homepage will be replaced with a fully dynamic system backed by the `client_logos` database table (already created). An admin management page will allow adding, editing, deleting, and reordering client logos with image uploads.

### Changes (3 files modified, 1 file created)

**1. Create `src/pages/admin/ClientLogosManagement.tsx**`

- Full CRUD admin page following the same pattern as `ServicesManagement.tsx`
- Image upload via existing `ImageUpload` component (uploads to `uploads` bucket, folder `client-logos`)
- Fields: name, logo image, sort order, active toggle
- "Import Defaults" button to seed 12 placeholder logos when table is empty
- Grid layout with logo preview cards, edit/delete/toggle actions

**2. Update `src/components/admin/AdminLayout.tsx**`

- Add sidebar link for "Client Logos" (`/admin/client-logos`) with the `Image` icon from lucide-react, placed after "Services"

**3. Update `src/App.tsx**`

- Import `ClientLogosManagement` and add protected route at `/admin/client-logos`

**4. Update `src/components/home/ClientsLogoSection.tsx**`

- Fetch active logos from `client_logos` table ordered by `sort_order`
- If DB returns logos, display them (with `logo_url` image or initials fallback)
- If DB is empty or fetch fails, fall back to current hardcoded list
- Duplicate array for seamless marquee animation (same as current behavior)

### No database changes needed

The `client_logos` table and RLS policies already exist from the previous migration.

5. **Fix loading screen stuck** 