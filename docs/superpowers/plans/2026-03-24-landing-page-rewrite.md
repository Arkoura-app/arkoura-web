# Arkoura Landing Page Rewrite — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rewrite `src/app/page.tsx` as a full-scroll premium marketing landing page with 7 sections + nav + footer, Manrope/Inter typography, sage/forest design system, Framer Motion scroll animations, CSS-only hero animations, and a stubbed waitlist API.

**Architecture:** Single client component page (`'use client'` + `export const runtime = 'edge'`) importing local section sub-components. All icons are inline SVG line art. WaitlistForm is one shared component used in the CTA section only. All scroll animations use `whileInView` + `once: true`.

**Tech Stack:** Next.js 15 App Router, Tailwind CSS v4, Framer Motion, next/font (Manrope + Inter), TypeScript, Cloudflare Pages (edge runtime)

---

## File Map

| File | Action | Responsibility |
|------|--------|----------------|
| `src/app/layout.tsx` | Modify | Replace Playfair Display → Manrope; expose `--font-manrope` |
| `src/app/globals.css` | Modify | Hero CSS keyframes (fade, pop, float) + hero animation classes |
| `src/app/page.tsx` | Full rewrite | All sections, icons, WaitlistForm, Nav, Page export |
| `src/app/api/waitlist/route.ts` | Modify | Add email format validation (regex) |

---

### Task 1: Update layout.tsx — swap Playfair for Manrope

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] Replace `Playfair_Display` import with `Manrope`
- [ ] Set `weight: ['600', '700', '800']`, `variable: '--font-manrope'`
- [ ] Add `manrope.variable` to `<html>` className
- [ ] Remove `playfair.variable` from `<html>` className

---

### Task 2: Update globals.css — hero keyframes

**Files:**
- Modify: `src/app/globals.css`

- [ ] Add `@keyframes arkoura-fade` (opacity 0→1)
- [ ] Add `@keyframes arkoura-pop` (opacity 0→1 + scale 0.92→1)
- [ ] Add `@keyframes arkoura-float` (translateY 0 ↔ -10px, infinite)
- [ ] Add hero CSS helper classes: `.hero-badge`, `.hero-headline`, `.hero-sub`, `.hero-ctas`, `.hero-card`, `.hero-card-float`

---

### Task 3: Update api/waitlist/route.ts — email validation

**Files:**
- Modify: `src/app/api/waitlist/route.ts`

- [ ] Add basic email regex validation: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- [ ] Return `{ error: 'validation_failed' }` with 400 if name empty or email invalid
- [ ] Keep `console.log` + `{ ok: true }` on success
- [ ] Keep `export const runtime = 'edge'`

---

### Task 4: Rewrite page.tsx — scaffold + shared primitives

**Files:**
- Create: `src/app/page.tsx` (full rewrite)

- [ ] `'use client'` + `export const runtime = 'edge'`
- [ ] Imports: `Image`, `useState`, `motion` from framer-motion
- [ ] Define Framer Motion variants: `fadeUp`, `scaleUp`, `fadeIn`, `stagger()`
- [ ] `const vp = { once: true, amount: 0.2 }` viewport config
- [ ] Define `LeafDecor` SVG component (large organic leaf silhouette, `currentColor` fill)
- [ ] Define `LogoMark` SVG (heart outline + inner QR grid + leaf accent, 32×32 viewBox)
- [ ] Define all icon SVG components: `IconBicycle`, `IconAirplane`, `IconElderly`, `IconNotebook`, `IconQR`, `IconGlobe`, `IconShield`, `IconLock`, `IconLightning`, `IconDatabase`, `IconKey`, `IconCheckShield`, `IconPhone`, `IconCheck`

---

### Task 5: WaitlistForm component

**Files:**
- Modify: `src/app/page.tsx`

- [ ] State: `'idle' | 'loading' | 'ok' | 'err'`
- [ ] On success render: large checkmark SVG (48px sage) + "You're on the list." + sub-copy
- [ ] On idle/err render: name input + email input + submit button
- [ ] POST to `/api/waitlist`, set state accordingly
- [ ] Error message below button on `'err'` state
- [ ] Trust chips row below form (Free emergency access · Encrypted & private · 20 languages)

---

### Task 6: Nav component

**Files:**
- Modify: `src/app/page.tsx`

- [ ] Sticky top, `bg-[rgba(250,250,248,0.85)]`, `backdrop-blur-md`
- [ ] `border-b border-[rgba(122,158,126,0.1)]`
- [ ] Left: `LogoMark` (32px) + "Arkoura" in Manrope font-semibold text-[#1C2B1E]
- [ ] Right: "Sign in" ghost text-sm text-gray-500 + "Access Vault" pill bg-[#7A9E7E] text-white rounded-full px-5 py-2 hover:bg-[#4A7A50]

---

### Task 7: HeroSection + EmergencyCard

**Files:**
- Modify: `src/app/page.tsx`

- [ ] Section `bg-[#F5F5F0]` min-h-screen, relative overflow-hidden
- [ ] `LeafDecor` absolute top-right 300px opacity-[0.05] text-[#7A9E7E]
- [ ] Two-col grid on lg: text left + card right; single col centered on mobile
- [ ] LEFT: pill badge + h1 Manrope extrabold + sub Inter + two CTA buttons + 3 trust chips — all CSS-animated (hero classes)
- [ ] CTA buttons: primary bg-[#7A9E7E], secondary border border-[#A8C5A0]; `href="#waitlist"` and `href="#how-it-works"`
- [ ] Trust chips: tiny sage checkmark SVG + text for each of 3 items
- [ ] RIGHT: `EmergencyCard` component — CSS float animation
  - Card: bg-white rounded-3xl shadow-2xl p-6 max-w-xs
  - Header: avatar (JD initials, #E8F2E6 bg) + name/location + "Emergency Profile" badge
  - Language bar: 3 pills (EN active sage, ES/FR ghost) + "+17 more"
  - Quick-glance: 3 icon+label pills (Cardiac / Diabetes / Critical Med)
  - Health rows: 3 rows with colored pills (red Anaphylactic / amber Time Critical / sage Condition)
  - Two buttons: red "🚨 This is an emergency" + outline "Dismiss"
- [ ] Stats row at bottom: border-t border-[#E8F2E6] pt-16 — 3 stats centered

---

### Task 8: ProblemSection

**Files:**
- Modify: `src/app/page.tsx`

- [ ] Section `bg-white`, section label "WHY ARKOURA EXISTS"
- [ ] `LeafDecor` absolute bottom-left 250px opacity-[0.04] text-[#7A9E7E]
- [ ] Headline + 3-col card grid with Framer staggered `fadeUp`
- [ ] Each card: `bg-[#F0F2EE]` rounded-2xl p-8, icon in 48px white circle, title, body, sage tag
- [ ] Icons: `IconBicycle`, `IconAirplane`, `IconElderly`

---

### Task 9: HowItWorksSection

**Files:**
- Modify: `src/app/page.tsx`

- [ ] `id="how-it-works"` on section, `bg-[#F0F2EE]`
- [ ] Section label "HOW IT WORKS" + centered headline
- [ ] 3 step cards bg-white rounded-2xl p-8 relative, Framer staggered `fadeUp` 0.15s
- [ ] Decorative number "01"/"02"/"03" absolute top-4 right-6 text-[#E8F2E6] text-6xl font-black
- [ ] Dashed connector: hidden on mobile, border-t-2 border-dashed border-[#D4E8D0] between cards on lg
- [ ] Icons: `IconNotebook`, `IconQR`, `IconGlobe` in 48px circle bg-[#E8F2E6]

---

### Task 10: ZeroFrictionSection (dark)

**Files:**
- Modify: `src/app/page.tsx`

- [ ] Section `bg-[#1C2B1E]`, relative overflow-hidden
- [ ] `LeafDecor` absolute top-right 400px opacity-[0.03] text-white
- [ ] Two-col layout desktop: large display text left + 3 fact blocks right
- [ ] Left: "Zero tracking.\nZero installs.\n100% yours." Manrope font-black text-6xl white + sub text-[#A8C5A0]
- [ ] Right: 3 fact blocks, each with 3px sage left accent bar + label + body
- [ ] Labels: "NO APP STORE REQUIRED" / "AES-256 ENCRYPTION" / "FREE EMERGENCY MODE. FOREVER."
- [ ] Framer `fadeUp` on each block, staggered

---

### Task 11: DifferentiatorsSection

**Files:**
- Modify: `src/app/page.tsx`

- [ ] Section `bg-white`, section label "THE ARKOURA ADVANTAGE"
- [ ] 2×2 grid of cards `bg-[#FAFAF8]` rounded-2xl p-8
- [ ] Framer `scaleUp` staggered 0.1s on each card
- [ ] Icons in 52px circle bg-[#E8F2E6]: `IconShield`, `IconGlobe`, `IconLock`, `IconLightning`
- [ ] Title Manrope font-semibold text-lg + body Inter text-sm text-gray-600

---

### Task 12: TrustSection

**Files:**
- Modify: `src/app/page.tsx`

- [ ] Section `bg-[#F0F2EE]`, section label "TRUSTED INFRASTRUCTURE"
- [ ] 4 badge pills centered, wrapping: bg-white rounded-xl px-6 py-4 shadow-sm
- [ ] Icons: `IconDatabase`, `IconKey`, `IconCheckShield`, `IconPhone` (repurpose for SOC2)
- [ ] Italic quote below mt-12, centered, max-w-xl, text-gray-500

---

### Task 13: CTASection

**Files:**
- Modify: `src/app/page.tsx`

- [ ] `id="waitlist"` on section, `bg-[#F5F5F0]` (bookends hero)
- [ ] `LeafDecor` centered absolute 350px opacity-[0.05] text-[#7A9E7E]
- [ ] Small `LogoMark` centered mb-6 (40px)
- [ ] Headline "Be ready before\nyou need it." Manrope extrabold text-5xl
- [ ] Sub-copy Inter text-lg text-gray-600 mt-4
- [ ] `<WaitlistForm />` max-w-sm mx-auto mt-10
- [ ] Below-button micro copy "Free forever for emergency access. No credit card required."
- [ ] Framer `fadeUp` on all elements staggered

---

### Task 14: Footer

**Files:**
- Modify: `src/app/page.tsx`

- [ ] Section `bg-[#1C2B1E]`
- [ ] Top row: `LogoMark` (32px) + "Arkoura" left; Privacy / Terms / Cookies / hello@arkoura.com right
- [ ] Divider: `border-t border-white/[0.08] my-6`
- [ ] Bottom: legal disclaimer centered text-xs text-gray-500 + copyright line

---

### Task 15: Page export + final lint/build

**Files:**
- Modify: `src/app/page.tsx`

- [ ] Default export `Page` assembles `<Nav>` + all sections in order
- [ ] Run `npm run lint` — must pass with zero warnings
- [ ] Run `npm run build` — must succeed

---

## Design Token Quick Reference

```
bg page:     #FAFAF8   surface:    #FFFFFF
section A:   #F0F2EE   section B:  #F5F5F0
sage:        #7A9E7E   sage-md:    #A8C5A0
sage-pastel: #D4E8D0   sage-tint:  #E8F2E6
sage-text:   #4A7A50   forest:     #1C2B1E
body:        #374151   muted:      #6B7280
red:         #DC2626   amber:      #D97706

Card shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.03)
Font vars:   --font-inter   --font-manrope
Headline:    font-[var(--font-manrope)] tracking-tight leading-none
Section lbl: text-xs font-medium text-[#7A9E7E] uppercase tracking-widest mb-3
```
