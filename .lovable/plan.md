
# Blue Branding Color Theme Update Plan

## Logo Color Analysis

Based on the uploaded logo, the new brand color is a vibrant **blue**:

| Color | HSL Value | Hex Value | Usage |
|-------|-----------|-----------|-------|
| Primary Blue | `217 90% 52%` | `#1877F2` | Main brand color, buttons, links |
| Blue Glow | `217 95% 65%` | `#4A9BFF` | Hover states, glow effects |
| Blue Dark | `217 85% 30%` | `#0B4A9D` | Dark accent |
| Light Blue (Accent) | `200 85% 55%` | `#2BB3E8` | Secondary accent |
| Sky Blue | `195 90% 60%` | `#33C3F0` | Tertiary accent |

---

## Files to Update

### 1. Main CSS Variables (src/index.css)

Update the CSS custom properties to use blue instead of green:

```text
OLD (Green Theme)              ->  NEW (Blue Theme)
--primary: 145 80% 58%         ->  --primary: 217 90% 52%
--accent: 165 70% 45%          ->  --accent: 200 85% 55%
--ring: 145 80% 58%            ->  --ring: 217 90% 52%
--green-primary: 145 80% 58%   ->  --blue-primary: 217 90% 52%
--green-glow: 145 85% 68%      ->  --blue-glow: 217 95% 65%
--green-dark: 145 75% 25%      ->  --blue-dark: 217 85% 30%
--teal-accent: 165 70% 45%     ->  --lightblue-accent: 200 85% 55%
--cyan-accent: 185 75% 50%     ->  --sky-accent: 195 90% 60%
```

**Gradient Updates:**
- `--gradient-primary`: Blue to light blue to sky blue
- `--gradient-subtle`: Blue with transparency
- `--gradient-glow`: Blue radial glow
- `--gradient-mesh`: Blue mesh pattern

**Shadow Updates:**
- `--shadow-primary`: Blue glow shadow
- `--shadow-primary-lg`: Larger blue shadow
- `--shadow-glow`: Blue ambient glow

**Sidebar Updates:**
- `--sidebar-primary`: Blue
- `--sidebar-ring`: Blue

**Keyframe Animation:**
- Update `@keyframes glow` to use blue color

---

### 2. Tailwind Config (tailwind.config.ts)

Replace color aliases:
- `green.primary` -> `blue.primary`
- `green.glow` -> `blue.glow`
- `teal.accent` -> `lightblue.accent`
- `cyan.accent` -> `sky.accent`

Update `pulse-glow` keyframe to use blue.

---

### 3. Branding Settings (src/hooks/useBranding.tsx)

Update default primary color:
- `primary_color: "#90FFA3"` -> `primary_color: "#1877F2"`

---

### 4. Admin Branding Page (src/pages/admin/BrandingSettings.tsx)

Update default/placeholder color values:
- Default `primary_color: "#90FFA3"` -> `"#1877F2"`
- Placeholder text: `"#90FFA3"` -> `"#1877F2"`

---

### 5. Project Backup Files (Mirror Changes)

Apply the same updates to:
- `project-backup/src/index.css`
- `project-backup/tailwind.config.ts`
- `project-backup/src/hooks/useBranding.tsx`
- `project-backup/src/pages/admin/BrandingSettings.tsx`

---

## Color Palette Summary

| Variable | Old Value (Green) | New Value (Blue) |
|----------|-------------------|------------------|
| `--primary` | `145 80% 58%` | `217 90% 52%` |
| `--accent` | `165 70% 45%` | `200 85% 55%` |
| `--ring` | `145 80% 58%` | `217 90% 52%` |
| `--*-primary` | `145 80% 58%` | `217 90% 52%` |
| `--*-glow` | `145 85% 68%` | `217 95% 65%` |
| `--*-dark` | `145 75% 25%` | `217 85% 30%` |
| `--lightblue-accent` | `165 70% 45%` | `200 85% 55%` |
| `--sky-accent` | `185 75% 50%` | `195 90% 60%` |

---

## Implementation Order

1. **Update src/index.css** - Main CSS variables and gradients
2. **Update tailwind.config.ts** - Tailwind color mappings
3. **Update src/hooks/useBranding.tsx** - Default branding color
4. **Update src/pages/admin/BrandingSettings.tsx** - Admin defaults
5. **Mirror to project-backup/** - All corresponding files

---

## Technical Notes

- The primary color `#1877F2` (HSL: 217 90% 52%) matches the logo's blue
- Foreground colors remain unchanged (white/dark text on blue works well)
- The gradient will flow from primary blue -> light blue -> sky blue
- Glow effects will emit blue light instead of green
- All button states, links, and interactive elements will adopt the blue theme

---

## Logo File

The new logo image will need to be copied to:
- `src/assets/logo.jpg` (or `.png` if converted)
- `public/logo.jpg`
- `project-backup/src/assets/logo.jpg`
- `project-backup/public/logo.jpg`
