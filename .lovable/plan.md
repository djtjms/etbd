

# Parallel Update Plan: i18n Expansion, Cleanup, UX Fixes, and CI/CD

## Phase 1: Fix Loading Screen Animation Stuck

**Problem:** The loading spinner in `index.html` uses green (`#10b981`) instead of the new blue brand color, and the loader is removed synchronously in `main.tsx` before React actually renders, which can cause a flash or stuck state.

**Changes:**
- `index.html` (lines 49-51): Update spinner `border-top-color` from `#10b981` to `#1877F2`, and the brand text color from `#10b981` to `#1877F2`. Use the new SVG logo instead of `logo.jpg`.
- `src/main.tsx`: Wrap loader removal in a `requestAnimationFrame` or `setTimeout(0)` to ensure React has mounted before removing the fallback, preventing the stuck/flash issue.

---

## Phase 2: Remove Old Unnecessary Logo and Branding Files

**Files to delete:**
- `public/logo.jpg` -- old green-themed logo (replaced by `engineersTech-logo-white.svg`)
- `src/assets/logo.jpg` -- old green-themed logo
- `public/placeholder.svg` -- unused placeholder

**Files to update:**
- `index.html`: Change favicon and apple-touch-icon from `/logo.jpg` to `/engineersTech-logo-white.svg`
- `project-backup/public/logo.jpg` and `project-backup/src/assets/logo.jpg` can remain for the PHP backup deployment (separate codebase)

---

## Phase 3: Expand i18n to All Remaining Pages

Add translation keys to `src/hooks/useLanguage.tsx` for all 10 languages covering:

**About page keys:**
- `about.badge`, `about.title`, `about.title_highlight`, `about.subtitle`
- `about.mission_badge`, `about.mission_title`, `about.mission_desc`
- `about.mission_items` (4 bullet points)
- `about.values_badge`, `about.values_title`
- `about.value_*` (4 values: innovation, client-centric, excellence, integrity)
- `about.team_badge`, `about.team_title`
- `about.cta_title`, `about.cta_desc`, `about.cta_button`, `about.cta_services`
- `about.stats_*` (projects, clients, years, support)

**Services page keys:**
- `services.page_badge`, `services.page_title`, `services.page_title_highlight`, `services.page_subtitle`
- `services.free_consultation`, `services.discuss_whatsapp`, `services.learn_more`
- `services.cta_title`, `services.cta_desc`, `services.cta_start`, `services.cta_view_work`

**Blog page keys:**
- `blog.badge`, `blog.title`, `blog.title_highlight`, `blog.subtitle`
- `blog.loading`, `blog.no_posts`, `blog.read_more`, `blog.contact_us`
- `blog.stay_updated`, `blog.stay_updated_desc`, `blog.subscribe`

**Portfolio page keys:**
- `portfolio.badge`, `portfolio.title`, `portfolio.title_highlight`, `portfolio.subtitle`
- `portfolio.loading`, `portfolio.coming_soon`, `portfolio.discuss_project`
- `portfolio.preview`, `portfolio.view_case_study`, `portfolio.get_quote`
- `portfolio.cta_title`, `portfolio.cta_desc`, `portfolio.cta_start`

**Demo page keys:**
- `demo.badge`, `demo.title`, `demo.title_highlight`, `demo.subtitle`
- `demo.search_placeholder`, `demo.all`, `demo.featured`
- `demo.no_demos`, `demo.loading`

**Privacy / Terms page keys:**
- `privacy.title`, `privacy.back`, `terms.title`, `terms.back`

Then update each page component to import `useLanguage` and use `t()` for all static text.

**Pages to update:**
- `src/pages/About.tsx`
- `src/pages/Services.tsx`
- `src/pages/Blog.tsx`
- `src/pages/Portfolio.tsx`
- `src/pages/Demo.tsx`
- `src/pages/Privacy.tsx`
- `src/pages/Terms.tsx`

---

## Phase 4: UI/UX Polish and Preloading Fixes

**Preloading improvements:**
- Add `<link rel="preload">` for the SVG logo and critical fonts in `index.html`
- Add `loading="lazy"` to non-critical images in service pages and portfolio

**UI fixes:**
- Services page: The `lg:flex-row-reverse` class on a grid doesn't work. Fix alternating layout by using proper `lg:order-1` / `lg:order-2` (already partially done, just remove the broken `lg:flex-row-reverse` class)
- Blog/Portfolio empty states: Add skeleton loading instead of plain text "Loading..."
- Ensure all interactive elements have proper focus-visible styles (already in CSS, just verify)

---

## Phase 5: GitHub Actions Workflow Update

Update `project-backup/.github/workflows/build-deploy.yml`:
- Remove the broken FTP deploy job (was causing "Input required: server" error)
- Add a lint step before build to catch errors early
- Keep only the build + artifact + release jobs
- Optionally add `project-backup/.github/workflows/deploy.yml` cleanup if it duplicates

---

## Technical Summary

| Phase | Files Changed | Scope |
|-------|--------------|-------|
| 1 - Loading fix | `index.html`, `src/main.tsx` | 2 files |
| 2 - Cleanup | Delete 2-3 files, update `index.html` | 3-4 files |
| 3 - i18n expansion | `useLanguage.tsx` + 7 page files | 8 files |
| 4 - UX polish | `index.html`, `Services.tsx`, `Blog.tsx`, `Portfolio.tsx` | 4 files |
| 5 - CI/CD | `build-deploy.yml` | 1 file |

All phases will be implemented in parallel where possible (phases 1-2 together, phase 3 all pages at once, phases 4-5 together).

