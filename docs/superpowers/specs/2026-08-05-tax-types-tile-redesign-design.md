# Tax Types Tile Redesign — Design

**Date:** 2026-08-05
**Scope:** `smart-tax-bd-client` — `components/taxes/taxes-types.tsx`, `components/taxes/helper/ui-data.ts`

## Goal

Make the public tax-types section on the web client match the mobile app's compact tile grid
(`smart-tax-bd-app/src/components/home/TaxTypeSection.tsx` + `TaxCard.tsx`). The current web
version is a marketing-style layout: badge chip, 5xl heading, three large cards per row with
descriptions and a hardcoded lucide icon map. The app version is a dense grid of small,
uniform tiles showing only an icon and a title.

This is a full port of the app design, not a partial style alignment.

## Reference — app behavior

`TaxTypeSection.tsx`:
- Heading `text-2xl font-bold text-foreground`, subtitle `text-sm text-mutedForeground`.
- 3-column `FlatList`, `gap-2`, trailing row padded with spacers so tiles stay aligned.
- Loading → spinner + label. Error → red message. Empty → muted "not found" text.

`TaxCard.tsx`:
- Tile: `min-h-[104px] items-center justify-center rounded-2xl border border-border bg-card p-2`
  plus a soft shadow.
- Icon chip: `h-10 w-10 rounded-lg bg-secondary/10 overflow-hidden`, image rendered at `h-6 w-6`
  with `contain`.
- Fallback when `icon` is not a URL: title initials, `text-xs font-bold text-secondary`.
- Title: `text-xs font-semibold text-center`, max 3 lines, ellipsized.
- Press → `CreateTaxOrder` with `taxType: item.value`.

## Target design — web

### Section shell

- Keep `id="tax-categories"` and `scroll-mt-24` (used by in-page anchors).
- Remove the two decorative blurred blobs and the `bg-slate-50/30` wash; use the plain section
  background like the app.
- Header block replaces badge + 4xl/5xl title + lead paragraph with:
  - `h2`: `text-2xl font-bold text-foreground` — `{t("title")} {t("titleSuffix")}`
  - `p`: `text-sm text-muted-foreground` — `t("description")`
- Keep the section's vertical padding and `max-w-7xl mx-auto` container.

### Grid

`grid gap-2 grid-cols-3 sm:grid-cols-4 lg:grid-cols-6`

The app uses 3 columns on a phone; the web keeps 3 as the mobile baseline and widens on larger
breakpoints so tiles stay small rather than stretching. No spacer padding is needed — CSS grid
aligns the trailing row on its own.

### Tile

A `Link` to `/profile/orders/create?taxType=${taxType.value}` wrapping:

```
min-h-[104px] flex flex-col items-center justify-center
rounded-2xl border border-border bg-card p-2 shadow-sm
transition-colors hover:bg-accent/40
```

Inside:
1. Icon chip — `mb-2 h-10 w-10 rounded-lg bg-secondary flex items-center justify-center
   overflow-hidden relative`.
   - `isIconUrl(taxType.icon)` → `next/image` with `fill`, `sizes="40px"`,
     `className="object-contain p-2"` (renders ~24px of art, matching the app's `h-6 w-6`).
   - Otherwise → initials, `text-xs font-bold text-secondary-foreground`.

   Note on the token: the app writes `bg-secondary/10` and `text-secondary`, but its
   `tailwind.config.js` maps every color to `rgb(var(--color-*))` and **no `--color-*` variable is
   defined anywhere in that project** — so those classes resolve to invalid colors and the app's
   chip actually renders with the default surface and text color. Copying `/10` literally onto the
   client's real token (`--secondary: oklch(0.96 0.02 149)`, an already-pale green) would make the
   chip invisible. Solid `bg-secondary` reproduces the intended look — a faint green chip behind
   the icon — on tokens that are actually defined.
2. Title — `text-center text-xs font-semibold text-foreground line-clamp-3`, value from
   `readLocalized(taxType.title, locale)`.

No description, no "Explore Details" row, no oversized watermark icon.

The shadcn `Card`/`CardHeader`/`CardContent`/`CardDescription` components are dropped here — the
tile is a single flex container and those wrappers add padding the tile design does not want.

### Icon fallback

- Delete the 22-entry `iconMap` and every `lucide-react` import from `taxes-types.tsx`.
- Port the app's initials logic into `components/taxes/helper/ui-data.ts`, beside the existing
  `isIconUrl`:
  - `STOPWORDS` = `from, the, of, and, for, to, a, an, tax, return`
  - `getInitials(raw)`: strip non-alphanumerics, split on whitespace, drop stopwords; two or more
    words → first letter of the first two, uppercased; one word → its first two characters; none
    → first two characters of the trimmed input.
- Initials are computed from the English title so they stay stable across locales:
  `getInitials(readLocalized(taxType.title, "en"))`.

### States

- **Loading:** 12 `Skeleton` tiles in the same grid, each `min-h-[104px] rounded-2xl`.
- **Empty:** centered muted block reusing `t("noCategories")` and `t("noCategoriesDesc")`,
  styled as plain text rather than the dashed-border card.
- **Error:** the RTK query hook's `selectFromResult` currently exposes only `data` and
  `isLoading`; a failed request lands in the empty state. Keep that behavior — no new error
  branch, matching what the section does today.

## i18n

Reuse the existing `taxTypes` namespace in `messages/en.json` and `messages/bn.json`. No key
additions or renames. `badge` and `exploreDetails` become unused but stay in the files.

## Out of scope

- The data layer: `useGetTaxTypesQuery`, `readLocalized`, and the `TaxType` interface are
  unchanged.
- Call sites `app/[locale]/(public)/page.tsx` and `app/[locale]/(public)/return/page.tsx` keep
  importing and rendering `<TaxesTypes />` with no prop changes.
- The mobile app itself is not touched.

## Success criteria

- Section renders a dense tile grid at every breakpoint, with no horizontal overflow.
- Tiles with an uploaded `icon` URL show the image; legacy/blank icons show initials.
- Titles switch language with the locale; initials do not.
- Tapping a tile lands on the create-order page with the correct `taxType` query param.
- No `lucide-react` imports and no `iconMap` remain in `taxes-types.tsx`.
- `pnpm lint` and `pnpm build` pass.
