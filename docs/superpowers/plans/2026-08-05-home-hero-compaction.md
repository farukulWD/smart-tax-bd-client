# Home Hero Compaction & Above-the-Fold Tax Types Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the tax type tile grid visible without scrolling on desktop by compacting the hero (padding, font sizes, QR card), plus smooth in-page scrolling, mobile hero tightening, and semantic-token consistency across home sections.

**Architecture:** ClassName-only compaction of `hero-banner.tsx` (no structural changes), asymmetric padding cut on the `TaxesTypes` section, CSS `scroll-behavior: smooth` with reduced-motion guard, and a mechanical slate/red→semantic-token sweep over the four lower home sections with the repeated eyebrow pill extracted to a tiny shared component.

**Tech Stack:** Next.js 16 App Router, Tailwind v4 semantic tokens (globals.css), next-intl, no animation libraries.

## Context

Measured at 1440x900: navbar bottom 81 + ticker → hero occupies 117–702 (585px, driven by `min-h-[65vh]` and a 443px QR card); tax heading at ~798, first tile row 862–1015 — only ~38px of tiles visible. At 375x800 the stacked hero ends at ~998 and tiles finish at 1.63 screens. User chose: shrink hero paddings/fonts/QR rather than new hero components. Target: hero bottom ≈ ~497 desktop → heading + full first tile row above the fold; mobile tiles done by ~1.2 screens.

## Global Constraints

- No test runner exists; verification = `pnpm lint`, `pnpm build`, Playwright measurements on the running dev server (localhost:3001).
- No i18n key changes; no rows deleted from the QR card.
- QR quiet-zone frame keeps literal `bg-white` (scannability), and brand-green literals (gradient, step circles, `text-green-700` accents) stay literal — no semantic green token exists.
- `TaxesTypes` is shared with `/return`; the padding change hits both (assessed as improvement there, verify visually).

---

### Task 1: Compact + tokenize hero

**Files:**
- Modify: `components/hero-section/hero-banner.tsx` (className-only)

**Interfaces:**
- Consumes: nothing new.
- Produces: nothing consumed by later tasks.

- [ ] **Step 1: Apply class changes** (before → after)

| Line | Before | After |
|---|---|---|
| 10 section | `relative w-full min-h-[65vh] bg-linear-to-b from-green-100 to-green-200 overflow-hidden` | drop `min-h-[65vh]`: `relative w-full bg-linear-to-b from-green-100 to-green-200 overflow-hidden` |
| 51 container | `py-10 lg:py-14` | `py-6 lg:py-8` |
| 52 grid | `min-h-90 md:min-h-105 grid items-center gap-10 lg:grid-cols-2` | `grid items-center gap-6 lg:grid-cols-2 lg:gap-10` |
| 55 h1 | `text-4xl font-extrabold tracking-tight lg:text-5xl text-slate-900` | `text-3xl font-extrabold tracking-tight lg:text-4xl text-foreground` |
| 58 subtitle | `text-lg text-slate-700 font-medium max-w-xl mx-auto lg:mx-0` | `text-base text-muted-foreground font-medium max-w-xl mx-auto lg:mx-0` |
| 61 CTA row | `flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-3` | `flex flex-row flex-wrap items-center justify-center lg:justify-start gap-3 pt-2` |
| 64 primary CTA | `bg-red-600 px-6 py-3 ... text-white ... hover:bg-red-700` | `bg-primary px-5 py-2.5 ... text-primary-foreground ... hover:bg-primary/90` |
| 70 outline CTA | `border-red-600/50 bg-white/80 px-6 py-3 ... text-red-700 ... hover:bg-white` | `border-primary/50 bg-background/80 px-5 py-2.5 ... text-primary ... hover:bg-background` |
| 79 QR card | `max-w-sm rounded-3xl ... bg-white/80 p-6 ... sm:p-8` | `max-w-xs rounded-2xl ... bg-card/80 p-4 ... sm:p-5` |
| 87 card subtitle | `mt-2 text-base font-medium text-slate-800` | `mt-1 text-sm font-medium text-card-foreground` |
| 92 QR wrapper | `mt-6` | `mt-4` |
| 93–96 brackets | `h-6 w-6 ... border-red-500` (x4) | `h-5 w-5 ... border-primary` |
| 97 QR frame | `rounded-xl bg-white p-3` | `rounded-lg bg-white p-2` (keep literal white) |
| 103 QR image | `h-44 w-44 ... sm:h-48 sm:w-48` | `h-32 w-32 ... sm:h-36 sm:w-36` |
| 109 scan line | `mt-5 ... text-sm text-slate-600` | `mt-3 ... text-xs text-muted-foreground` |
| 114 footer | `mt-4 border-t border-slate-200 pt-3 ... text-xs ... text-slate-500` | `mt-2 ... text-[11px] ... text-muted-foreground` (drop divider, keep both strings) |

- [ ] **Step 2: Lint** — `pnpm lint`; hero file clean (repo baseline 3 errors elsewhere pre-exists).

- [ ] **Step 3: Commit**

```bash
git add components/hero-section/hero-banner.tsx
git commit -m "feat(hero): compact hero so tax types surface above the fold"
```

### Task 2: TaxesTypes top padding

**Files:**
- Modify: `components/taxes/taxes-types.tsx:23`

- [ ] **Step 1:** `scroll-mt-24 px-4 py-14 md:py-20` → `scroll-mt-24 px-4 pt-8 pb-14 md:pt-10 md:pb-16` (asymmetric: only the fold-relevant top pad shrinks).

- [ ] **Step 2: Commit**

```bash
git add components/taxes/taxes-types.tsx
git commit -m "feat(taxes): tighten section top padding for above-the-fold visibility"
```

### Task 3: Smooth scrolling

**Files:**
- Modify: `app/globals.css` (inside `@layer base`)
- Modify: `app/[locale]/layout.tsx` (`<html>` tag)

- [ ] **Step 1:** Add to `@layer base` in globals.css:

```css
@media (prefers-reduced-motion: no-preference) {
  html {
    scroll-behavior: smooth;
  }
}
```

- [ ] **Step 2:** `<html lang={locale}>` → `<html lang={locale} data-scroll-behavior="smooth">` — Next 16 keeps router scroll-to-top instant on route navigation and silences its warning.

- [ ] **Step 3: Commit**

```bash
git add app/globals.css "app/[locale]/layout.tsx"
git commit -m "feat(ux): smooth in-page anchor scrolling with reduced-motion guard"
```

### Task 4: Token consistency + eyebrow extraction

**Files:**
- Create: `components/shared/section-eyebrow.tsx`
- Modify: `components/how-it-works/how-it-works-section.tsx`, `components/blog/home-blog-section.tsx`, `components/reviews/testimonials-section.tsx`, `components/faq/faq-section.tsx`

- [ ] **Step 1: Create the eyebrow component** (hook-free, server-compatible; keeps green literals — no semantic green token exists):

```tsx
import { FC, ReactNode } from "react";

const SectionEyebrow: FC<{ children: ReactNode }> = ({ children }) => (
  <span className="inline-flex rounded-full border border-green-200 bg-green-100 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-green-700">
    {children}
  </span>
);

export default SectionEyebrow;
```

Swap the byte-identical inline pill in all four sections (`how-it-works-section.tsx:53`, `home-blog-section.tsx:27`, `testimonials-section.tsx:28`, `faq-section.tsx:25`) for `<SectionEyebrow>…</SectionEyebrow>`.

- [ ] **Step 2: Mechanical token sweep** in the four sections:

| Literal | Token |
|---|---|
| `text-slate-900` | `text-foreground` |
| `text-slate-600` / `-700` / `-500` | `text-muted-foreground` |
| `text-slate-400` | `text-muted-foreground/80` |
| `border-slate-200(/60)` / `-100` | `border-border(/60)` |
| `bg-white` (cards/skeletons) | `bg-card` |
| `bg-slate-100` | `bg-muted` |
| `bg-red-600` / `hover:bg-red-700` | `bg-primary` / `hover:bg-primary/90` |
| `text-red-600/-700`, `border-red-600(/50)` | `text-primary`, `border-primary(/50)` |
| `hover:bg-red-50` | `hover:bg-primary/5` |
| `bg-green-50/50` (testimonials band) | `bg-secondary/50` |
| gradient greens, `bg-green-600` circles, `text-green-700` accents | keep literal |

`components/reviews/testimonial-card.tsx` has the same literals — optional follow-up, out of scope here.

- [ ] **Step 3: Lint + build** — `pnpm lint`, `pnpm build`.

- [ ] **Step 4: Commit**

```bash
git add components/shared/section-eyebrow.tsx components/how-it-works components/blog components/reviews/testimonials-section.tsx components/faq
git commit -m "refactor(home): align home sections to semantic tokens, extract SectionEyebrow"
```

### Task 5: Verification (Playwright on localhost:3001)

- [ ] 1440x900, `/en` + `/bn`: hero section bottom ≤ ~510; `#tax-categories` h2 fully visible; first tile row bottom ≤ 900. Screenshot.
- [ ] 1280x720: heading fully visible, ≥⅔ of first tile row visible. Fallback knobs if short: hero container `py-5 lg:py-6`, QR `h-28 sm:h-32`.
- [ ] 375x800: first tile row bottom ≤ 1200 (~1.5 screens); CTA pills side-by-side without bad wrap (check bn).
- [ ] Click "View Tax Categories" → smooth glide, heading clears sticky navbar; emulate `prefers-reduced-motion: reduce` → instant jump.
- [ ] Route change (home → /blog → back) scrolls to top instantly, no console warning.
- [ ] `/en/return` at both sizes: reduced top padding looks intentional.
- [ ] Spot-check contrast: `muted-foreground` subtitle on green-100 gradient; token sweep didn't visibly regress the four lower sections.

## Risks / tradeoffs

- QR shrinks 176/192→128/144px and loses dominance — deliberate; still scannable (~3.8cm at sm).
- No store URL exists in the repo (only `/qrcode.jpeg` encodes it) — mobile keeps compact QR card; adding a tap-through link would need new data.
- `slate-600/700 → muted-foreground` lightens body copy a shade — matches taxes-types subtitle already.
- Hero height now content-driven; longer translations grow it (self-correcting).
- Bengali renders taller lines but shorter strings — verify no `items-center` oddness.
