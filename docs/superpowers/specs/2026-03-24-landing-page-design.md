# Arkoura Landing Page — Design Spec

**Date:** 2026-03-24
**Branch:** scaffold/nextjs-setup
**Status:** Approved

---

## Overview

Full-scroll marketing landing page for Arkoura, a personal health journal product. Built in `src/app/page.tsx` as a Next.js 15 App Router client component. Deploys to Cloudflare Pages (edge runtime). Framer Motion handles all scroll-triggered animations; the hero animation is CSS-only to protect LCP.

---

## Design Tokens

| Token | Value |
|-------|-------|
| Background (navy) | `#0F172A` |
| Accent (teal) | `#14B8A6` |
| Text (white) | `#FFFFFF` |
| Text (muted) | `rgba(255,255,255,0.6)` |
| Body font | Inter (already in `layout.tsx` as `--font-inter`) |
| Display font | Playfair Display (`--font-playfair`, added to `layout.tsx`) |

No gradients. Maximum 3 colors (navy, teal, white/muted-white). No stock photos.

---

## File Map

```
src/
  app/
    layout.tsx                  — add Playfair Display font var
    page.tsx                    — full landing page (client component)
    api/
      waitlist/
        route.ts                — POST stub: console.log + {ok:true}, edge runtime
  components/                   — (not created; all components are local to page.tsx)
```

---

## Components (all co-located in `page.tsx`)

### `WaitlistForm`

Shared between Hero and CTA sections. Local state machine:

```
idle → submitting → success
              └───→ error
```

- Fields: `name` (text), `email` (email)
- On submit: `POST /api/waitlist` with `{ name, email }`
- Success state: green checkmark SVG + "You are on the list."
- Error state: red inline message, form stays editable
- The component is self-contained; parent sections just render `<WaitlistForm />`

### `HeroSection`

- Full viewport height (`min-h-screen`), centered column layout
- App icon: `public/icon.png` via `next/image`, 200×200
  - CSS `@keyframes arkoura-icon-in` on the `<Image>` wrapper: opacity 0→1, scale 0.85→1, 800ms ease-out, fills forward
- Tagline `"The guardian who watches."`: Playfair Display, white, fades in with 400ms CSS animation delay
- Sub-tagline `"Your personal health journal — always with you."`: Inter, muted white
- `<WaitlistForm />`

> Note: spec references `icon.svg`; only `icon.png` exists in `public/`. Spec is honoured with `icon.png` until an SVG is provided.

### `ProblemSection`

3 scenario cards with Framer Motion `fadeInUp` staggered at 100ms intervals.

Card content:

1. Cyclist collapses, can't speak — responders have no health data.
2. Tourist has allergic reaction — local doctors don't speak their language.
3. Elderly parent with dementia — can't recall their medications.

Card styling: glass-morphism (`backdrop-blur`, semi-transparent navy background, 1px teal border), teal accent icon (inline SVG), white body text.

Animation: `variants` with `hidden: { opacity: 0, y: 24 }` → `visible: { opacity: 1, y: 0 }`, `transition: { duration: 0.5, ease: "easeOut" }`. Container uses `staggerChildren: 0.1`. `whileInView` with `viewport={{ once: true }}`.

### `HowItWorksSection`

3 numbered steps with a vertical connecting line.

Steps:
1. Build your health journal
2. Your QR code goes everywhere
3. Anyone scans → instant health profile + AI speaks for you

Layout: single column, steps connected by a CSS pseudo-element vertical line on the wrapper. Each step fades in via Framer Motion `whileInView` `fadeInUp`, staggered.

### `DifferentiatorsSection`

4 pill cards in a 2×2 grid:

1. Free for emergencies. Forever.
2. Your data. Your control.
3. Works in any language.
4. No app install for helpers.

Each card: minimal text, teal inline SVG icon, rounded-full pill border. `fadeIn` on scroll via Framer Motion `whileInView`.

### `CTASection` + `Footer`

- Repeat `<WaitlistForm />`
- Small app icon (64×64)
- Footer links: Terms, Privacy, Cookies (placeholder `href="#"`)
- Copyright: `© 2026 Arkoura. Built in Costa Rica.`

---

## API Route — `/api/waitlist/route.ts`

```
POST /api/waitlist
Body: { name: string, email: string }
Response: { ok: true }
```

- `export const runtime = 'edge'`
- Validates both fields are non-empty strings; returns `400` if not
- Logs `[waitlist] { name, email }` to console
- Returns `{ ok: true }` with status 200
- Resend integration deferred to next story

---

## Animation Strategy

| Location | Engine | Reason |
|----------|--------|--------|
| Hero icon + tagline | CSS `@keyframes` | CSS-only protects LCP; no JS on critical render path |
| All scroll sections | Framer Motion `whileInView` | Declarative, integrates cleanly with React |
| All scroll animations | `viewport={{ once: true }}` | Fire once → no re-render on scroll-back → better performance |

---

## Performance Targets

- Lighthouse Performance ≥ 95 on mobile
- No console errors
- `next/image` for icon with explicit `width` + `height`
- Playfair Display: `subsets: ['latin']`, `display: 'swap'`
- Framer Motion: lazy-import not required (Framer tree-shakes well with App Router)

---

## Dependencies to Install

```bash
npm install framer-motion
```

No other new dependencies. Tailwind v4, Inter, and TypeScript are already present.

---

## Layout.tsx Changes

Add `Playfair_Display` import and `--font-playfair` CSS variable alongside existing `Inter`.

---

## Out of Scope

- Real waitlist persistence (Resend / database) — next story
- Authentication, routing, or other pages
- Dark/light mode toggle
- Any page other than `/`
