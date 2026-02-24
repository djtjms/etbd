
Goal: eliminate the “stuck loading” behavior, remove hardcoded branding behavior so admin changes are reflected reliably, and harden the build/publish pipeline with parallel verification gates before release.

What I found from analysis
1) The “stuck loading” symptom appears in two forms:
- Initial HTML loader can remain forever if app scripts fail to execute on a published environment.
- Home hero can appear permanently as skeleton because it is lazy-loaded (`Index.tsx` + `Suspense`) and can stall on chunk/network/cache mismatch.

2) Branding is only partially dynamic today:
- Dynamic branding exists in `Header`, `Footer`, and `AdminLayout`, but several user-visible parts are still static/hardcoded (loader text/color, auth logo, WhatsApp button styling).
- Branding fetch uses a single request with no retry/cache strategy in `useBranding.tsx`, so transient backend/read failures fall back to defaults and look “hardcoded”.
- Database currently has one branding row and uploaded branding files exist, so this is not a missing-table issue.

3) Service management mismatch:
- `services` table is currently empty, while `ServicesSection.tsx` falls back to hardcoded in-code services, which can make admin edits feel ineffective unless records are created.

4) Pipeline exists in parallel phases, but it does not yet include runtime smoke checks to detect “loader-only published page” failures.

Do I know what the issue is?
Yes. This is a combined reliability problem:
- fragile loading flow (critical UI lazy load + no fail-safe UX),
- partial branding hardcoding + weak branding resiliency,
- missing post-build runtime validation in CI.

Implementation plan (parallelized phases)

Phase A — Loading reliability hardening (critical path)
A1. Remove fragile lazy-loading for the above-the-fold hero
- File: `src/pages/Index.tsx`
- Replace lazy import/Suspense for `HeroSection` with direct import render.
- Keep skeleton usage only for genuinely non-critical async sections if needed.
- Outcome: homepage no longer depends on a deferred chunk for first meaningful paint.

A2. Add robust loader fail-safe behavior
- Files: `index.html`, `src/main.tsx`
- Keep initial loader, but add a guarded inline timeout watchdog:
  - after N seconds, swap spinner text to recovery message (“Still loading… Retry”) instead of infinite spinner.
  - keep lightweight retry action (reload button/link).
- In `main.tsx`, remove loader in a guaranteed-safe way:
  - remove on startup, then re-check after first frame/microtask (defensive idempotent removal).
- Outcome: no “forever spinner” state; users always get a recoverable state.

A3. Improve route-level loading feedback for admin/auth
- File: `src/components/auth/ProtectedRoute.tsx`
- Add timeout fallback copy if auth loading exceeds threshold (without exposing technical internals).
- Outcome: clearer diagnosis vs ambiguous “Loading...”.

Phase B — Make branding fully admin-driven and resilient
B1. Centralize branding state with cache + retry
- File: `src/hooks/useBranding.tsx`
- Add:
  - fetch retry with short backoff,
  - local cache (localStorage) of last successful branding payload,
  - immediate use of cached branding before network response.
- Ensure select orders by latest (`updated_at desc`) before `limit(1)` to avoid stale-row edge cases if multiple rows appear later.
- Outcome: branding remains stable across refresh/device/network hiccups.

B2. Apply branding in currently hardcoded surfaces
- Files:
  - `index.html` (loader label/color fallback strategy),
  - `src/pages/Auth.tsx` (use branding logo + text fallback instead of static-only asset),
  - `src/components/consultation/WhatsAppButton.tsx` (remove hardcoded green-only treatment, optionally align with branding primary color while keeping accessibility contrast),
  - `src/components/admin/AdminLayout.tsx` (already dynamic; add image load fallback handler).
- Outcome: admin branding updates are visible consistently across public/admin/auth/loading surfaces.

B3. Persist and reflect changes immediately from admin save
- File: `src/pages/admin/BrandingSettings.tsx`
- After successful save:
  - update branding cache immediately,
  - trigger context refresh,
  - add success toast message that includes “changes applied”.
- Add minimal validation/sanitization for logo URL, color, and social links.
- Outcome: no “saved but unchanged” perception.

Phase C — Services management coherence (quick win, optional but recommended)
C1. Eliminate hardcoded-vs-admin mismatch
- File: `src/components/home/ServicesSection.tsx`
- Keep fallback only as emergency fallback, but add clear precedence:
  - database services always win when present.
- File: `src/pages/admin/ServicesManagement.tsx`
- Add “Import Default Services” action (one-click seed) when table empty.
- Outcome: users can manage the exact services they see, end-to-end.

Phase D — Parallel CI/CD verification gates before publish
D1. Keep current parallel phases and add runtime smoke checks
- File: `.github/workflows/deploy.yml`
- Existing:
  - Phase 1 (parallel): lint + typecheck
  - Phase 2: build
  - Phase 3 (parallel): package + FTP deploy
- Add:
  - `smoke-dist` job after build: assert built `dist/index.html` includes expected script tags/assets and not dev references.
  - `smoke-preview` job: serve built dist and curl key routes (`/`, `/admin`, `/demo`) to validate HTML + asset reachability.
  - optional `smoke-published` job (if published URL secret present): fetch live URL and fail if only loader shell is returned.
- Outcome: pipeline blocks broken publish artifacts before release.

D2. Add explicit deployment summary checks
- include pass/fail matrix in summary for:
  - build artifact integrity,
  - route smoke results,
  - publish endpoint health.

Verification plan (must-pass before final publish)
1) Functional checks
- Home page renders hero content (not skeleton forever) on fresh load/hard refresh.
- Admin login, dashboard, branding save, and immediate frontend reflection.
- Services management create/edit/image upload and public display.

2) Responsive/device checks
- Desktop, tablet, mobile viewports:
  - `/`, `/admin`, `/admin/branding`, `/admin/services`, `/demo`.
- Ensure no overlap/regression in logo, buttons, and key panels.

3) Cross-browser checks
- Chromium-based + WebKit/Firefox equivalent checks for loader removal and branding rendering.

4) Publish checks
- Verify both preview and published URLs after release.
- Validate that published HTML references built assets and app mounts correctly.

Risk controls
- Keep changes incremental and isolated by concern (loading, branding, CI).
- If any regression appears, rollback is straightforward by reverting phase commits independently.
- No destructive database changes are required for core fix; optional services seed is additive only.

Definition of done
- No persistent loading state on homepage/admin.
- Branding updates from admin visibly propagate across loader/auth/header/footer/admin without manual code edits.
- Services shown on homepage align with admin-managed records (or clearly seeded defaults).
- CI runs parallel phases with added smoke gates and blocks faulty publish artifacts.
- Manual multi-device checks pass before final publish.
