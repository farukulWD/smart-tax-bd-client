# Tax Types Tile Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the web client's large marketing-style tax-type cards with the mobile app's compact tile grid.

**Architecture:** Two files change. `components/taxes/helper/ui-data.ts` gains a `getInitials` helper ported from the app's `TaxCard.tsx`. `components/taxes/taxes-types.tsx` is rewritten as a dense grid of small tiles — icon chip plus 3-line title, no descriptions — and loses its 22-entry `lucide-react` icon map. The RTK Query hook, `readLocalized`, the link target, and both call sites are untouched.

**Tech Stack:** Next.js App Router, React 19, TypeScript (strict), Tailwind v4 with shadcn tokens, `next-intl`, RTK Query, `next/image`.

## Global Constraints

- Spec: `docs/superpowers/specs/2026-08-05-tax-types-tile-redesign-design.md`.
- **There is no test runner in this project.** `package.json` scripts are `dev`, `build`, `start`, `lint` only, and there are no `jest`/`vitest`/testing-library dependencies. Verification for every task is `pnpm lint`, `pnpm build`, and a visual check in `pnpm dev` — do not scaffold a test framework as part of this work.
- Reuse the existing `taxTypes` i18n namespace in `messages/en.json` and `messages/bn.json`. Add no keys, rename no keys, delete no keys. `badge` and `exploreDetails` become unused and stay in place.
- Tile geometry copied from the app verbatim: `min-h-[104px]`, `rounded-2xl`, `p-2`, `gap-2`, icon chip `h-10 w-10 rounded-lg`, title `text-xs font-semibold` clamped to 3 lines.
- Use shadcn semantic tokens (`border-border`, `bg-card`, `bg-secondary`, `text-secondary-foreground`, `text-foreground`, `text-muted-foreground`) — not raw `slate-*`/`green-*` utilities.
- Chip background is solid `bg-secondary`, **not** `bg-secondary/10`. The app writes `/10`, but the app defines none of its `--color-*` variables, so that class renders as nothing there; at 10% opacity on the client's real `--secondary: oklch(0.96 0.02 149)` the chip would be invisible.
- Initials are derived from the **English** title so they do not change with locale.
- Work on a branch — the client repo is currently on `main`.

---

### Task 1: Port the initials helper

**Files:**
- Modify: `components/taxes/helper/ui-data.ts` (append after the existing `isIconUrl` export)

**Interfaces:**
- Consumes: nothing.
- Produces: `getInitials(raw: string): string` — exported from `components/taxes/helper/ui-data.ts`, used by Task 2.

- [ ] **Step 1: Create the working branch**

```bash
cd /Users/farukul/Developer.noindex/projects/smart-tax/smart-tax-bd-client
git checkout -b redesign/tax-types-tiles
```

- [ ] **Step 2: Append the helper to `components/taxes/helper/ui-data.ts`**

Leave the existing `TaxType` interface and `isIconUrl` export exactly as they are. Add below them:

```ts
const STOPWORDS = new Set([
  "from",
  "the",
  "of",
  "and",
  "for",
  "to",
  "a",
  "an",
  "tax",
  "return",
]);

/**
 * Fallback avatar text for tax types whose `icon` is not an uploaded image URL.
 * Mirrors the mobile app's `TaxCard` so both surfaces show the same initials.
 */
export const getInitials = (raw: string): string => {
  const words = raw
    .replace(/[^A-Za-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((word) => word && !STOPWORDS.has(word.toLowerCase()));

  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return raw.trim().slice(0, 2).toUpperCase();
};
```

Expected outputs for the real data in this project: `"Income Tax"` → `IN`, `"Income Tax (Government)"` → `IG`, `"Value Added Tax"` → `VA`, `"Housewife Tax Return"` → `HO`, `"Non Resident Bangladeshis"` → `NR`, `""` → `""`.

- [ ] **Step 3: Verify it compiles and lints**

Run: `pnpm lint`
Expected: no errors for `components/taxes/helper/ui-data.ts`. `getInitials` is unused until Task 2 — an unused-export warning is fine here; an unused-*variable* error is not.

- [ ] **Step 4: Commit**

```bash
git add components/taxes/helper/ui-data.ts
git commit -m "feat(taxes): add getInitials fallback helper for tax type tiles"
```

---

### Task 2: Rewrite the section as a tile grid

**Files:**
- Modify: `components/taxes/taxes-types.tsx` (full rewrite, 182 lines → ~85)

**Interfaces:**
- Consumes: `getInitials` and `isIconUrl` from `./helper/ui-data` (Task 1); `readLocalized` from `@/lib/localize`; `useGetTaxTypesQuery` from `@/redux/api/order/orderApi`.
- Produces: default export `TaxesTypes` — a props-less `FC`, unchanged signature, so `app/[locale]/(public)/page.tsx` and `app/[locale]/(public)/return/page.tsx` keep working without edits.

- [ ] **Step 1: Replace the whole file**

Write `components/taxes/taxes-types.tsx` as:

```tsx
"use client";

import { FC } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { Skeleton } from "../ui/skeleton";
import { useGetTaxTypesQuery } from "@/redux/api/order/orderApi";
import { readLocalized } from "@/lib/localize";
import { getInitials, isIconUrl } from "./helper/ui-data";

const TaxesTypes: FC = () => {
  const t = useTranslations("taxTypes");
  const locale = useLocale();
  const { data: taxTypes, isLoading } = useGetTaxTypesQuery(undefined, {
    selectFromResult: (result) => ({
      data: result.data?.data,
      isLoading: result.isLoading,
    }),
  });

  return (
    <section id="tax-categories" className="scroll-mt-24 px-4 py-14 md:py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-3">
          <h2 className="text-2xl font-bold text-foreground">
            {t("title")} {t("titleSuffix")}
          </h2>
          <p className="text-sm text-muted-foreground">{t("description")}</p>
        </div>

        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-6">
          {isLoading &&
            Array.from({ length: 12 }).map((_, index) => (
              <Skeleton
                key={`tax-skeleton-${index}`}
                className="min-h-[104px] rounded-2xl"
              />
            ))}

          {!isLoading &&
            taxTypes?.map((taxType) => (
              <Link
                key={taxType.value}
                href={`/profile/orders/create?taxType=${taxType.value}`}
                className="flex min-h-[104px] flex-col items-center justify-center rounded-2xl border border-border bg-card p-2 shadow-sm transition-colors hover:bg-accent/40"
              >
                <div className="relative mb-2 flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg bg-secondary">
                  {isIconUrl(taxType.icon) ? (
                    <Image
                      src={taxType.icon!}
                      alt=""
                      fill
                      sizes="40px"
                      className="object-contain p-2"
                    />
                  ) : (
                    <span className="text-xs font-bold text-secondary-foreground">
                      {getInitials(readLocalized(taxType.title, "en"))}
                    </span>
                  )}
                </div>

                <span className="line-clamp-3 text-center text-xs font-semibold text-foreground">
                  {readLocalized(taxType.title, locale)}
                </span>
              </Link>
            ))}
        </div>

        {!isLoading && (!taxTypes || taxTypes.length === 0) && (
          <div className="py-10 text-center">
            <p className="text-sm font-semibold text-foreground">
              {t("noCategories")}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("noCategoriesDesc")}
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default TaxesTypes;
```

What this deliberately drops, relative to the old file: every `lucide-react` import, the `iconMap` constant, the `ShieldCheck` badge chip, the `text-4xl md:text-5xl` heading with the red `&`, the two blurred decorative `div`s, the `bg-slate-50/30` section wash, the shadcn `Card`/`CardHeader`/`CardContent`/`CardDescription`/`CardTitle` wrappers, the oversized watermark icon, the `line-clamp-3` description, and the commented-out "Explore Details" block.

What stays identical: `"use client"`, the `id="tax-categories"` anchor and `scroll-mt-24`, the `useGetTaxTypesQuery` call including its `selectFromResult`, the `href` shape `/profile/orders/create?taxType=${taxType.value}`, and the `taxTypes` translation keys used.

- [ ] **Step 2: Confirm nothing else referenced the deleted symbols**

Run: `grep -rn "iconMap\|lucide-react" components/taxes/`
Expected: no `iconMap` hits anywhere; `lucide-react` hits, if any, only in other files under `components/taxes/` that were never part of this change.

- [ ] **Step 3: Lint**

Run: `pnpm lint`
Expected: clean — in particular no `no-unused-vars` for removed imports (`Card*`, `ArrowRight`, `ShieldCheck`, …). If `getInitials` or `isIconUrl` shows as unused, the import in Step 1 was mistyped.

- [ ] **Step 4: Build**

Run: `pnpm build`
Expected: success. A TypeScript error on `taxType.icon!` means `TaxType.icon` in `helper/ui-data.ts` was changed — it must stay `icon?: string`.

- [ ] **Step 5: Commit**

```bash
git add components/taxes/taxes-types.tsx
git commit -m "feat(taxes): redesign tax types section as compact tile grid"
```

---

### Task 3: Visual verification and spec commit

**Files:**
- Modify: none (verification only)
- Commit: `docs/superpowers/specs/2026-08-05-tax-types-tile-redesign-design.md`, `docs/superpowers/plans/2026-08-05-tax-types-tile-redesign.md`

**Interfaces:**
- Consumes: the finished component from Task 2.
- Produces: nothing consumed by later tasks.

- [ ] **Step 1: Run the dev server**

Run: `pnpm dev`
Open `http://localhost:3000/en` and scroll to the tax categories section; also check `http://localhost:3000/en/return`.

- [ ] **Step 2: Walk the success criteria**

Confirm each, and report any that fail rather than silently adjusting the design:

1. Tiles form a dense grid — 3 columns on a narrow window, 4 at `sm`, 6 at `lg` — with no horizontal page scroll at 320px width.
2. Tax types with an uploaded image `icon` render the image inside the chip; ones without render two-letter initials.
3. Every tile is the same height, and long titles wrap to at most 3 lines with an ellipsis.
4. Switching to `http://localhost:3000/bn` translates the heading, subtitle, and tile titles — but the initials stay in Latin letters.
5. Clicking a tile navigates to `/profile/orders/create?taxType=<value>` with the right value.
6. During load, 12 rounded skeleton tiles appear in the same grid.

- [ ] **Step 3: Check dark mode**

Toggle the site's dark theme (or set `prefers-color-scheme: dark` in devtools). The tile border, card background, and chip must all stay visible — the client defines dark values for `--card`, `--border`, and `--secondary`, so no tile should read as a flat black rectangle.

- [ ] **Step 4: Commit the design docs**

```bash
git add docs/superpowers/specs/2026-08-05-tax-types-tile-redesign-design.md docs/superpowers/plans/2026-08-05-tax-types-tile-redesign.md
git commit -m "docs: add tax types tile redesign spec and plan"
```

---

## Follow-up noted, not in scope

The mobile app's `tailwind.config.js` maps every color to `rgb(var(--color-*) / <alpha-value>)`, but no `--color-*` variable is defined anywhere in `smart-tax-bd-app` — no `global.css` rule, no runtime `setProperty`. So `bg-card`, `border-border`, `bg-secondary/10`, and `text-mutedForeground` all resolve to invalid colors and fall back to platform defaults across the app, not just in `TaxCard`. Worth a separate ticket against the app repo; this plan changes nothing there.
