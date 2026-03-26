# CLAUDE.md — Smart Tax BD Client

Instructions for AI agents working on this codebase.

---

## Project Summary

Smart Tax BD is a Next.js (App Router) web application for tax filing, document management, and payment processing in Bangladesh. Users go through a 3-step tax order workflow: fill personal/tax info → upload documents → pay.

**Package manager**: `pnpm` — always use `pnpm`, never `npm` or `yarn`.

---

## Tech Stack

| Concern | Tool |
|---|---|
| Framework | Next.js (App Router, v16) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS v4 (`@theme inline` in globals.css) |
| State / API | Redux Toolkit + RTK Query |
| Forms | React Hook Form + Zod |
| UI Primitives | Shadcn UI (`components/ui/`) |
| Icons | Lucide React |
| Tables | @tanstack/react-table |
| Real-time | Socket.io Client |
| Images | Cloudinary (configured in `next.config.ts`) |

---

## Commands

```bash
pnpm dev       # start dev server
pnpm build     # production build
pnpm start     # start production server
pnpm lint      # ESLint check
```

---

## Directory Structure

```
app/
  (public)/        # Unauthenticated routes (home, auth pages, news)
    (auth)/        # login, register, otp-verification, forgot/reset-password
  (private)/       # Auth-required routes (profile, orders, files, payments)
    (profile)/     # profile, my-files, orders/create, payments
components/
  ui/              # 55+ Shadcn UI base components — use these, don't add new primitives
  auth/            # Auth-specific form components
  layouts/         # ReduxProvider, MainLayout, DataProvider
  shared/          # Navbar, Footer, DataTable, NewsTicker
  profile/         # ProfileSidebar
  taxes/           # Tax type components
  payment/         # Payment status components
redux/
  store.ts         # configureStore with auth + baseApi reducers
  hooks.ts         # useAppDispatch, useAppSelector (always use these typed hooks)
  feature/auth.ts  # auth slice: setUser, logout actions
  api/
    baseApi.ts     # RTK Query base (tagTypes: files, orders, payments, news)
    authApi.ts     # Auth endpoints
    orderApi.ts    # Tax order 3-step workflow endpoints
    fileApi.ts     # File upload/management endpoints
    paymentApi.ts  # Payment endpoints
    newsApi.ts     # News endpoints
types/             # Global TypeScript interfaces
helpers/
  axios/           # axiosInstance + axiosBaseQuery for RTK Query
  globalErrorHandler.ts
hooks/
  use-socket.ts    # WebSocket hook
  use-mobile.ts    # Mobile breakpoint hook
lib/
  utils.ts         # cn() (clsx + tailwind-merge), isTokenExpired()
```

---

## Key Conventions

### Next.js App Router
- Mark components as `"use client"` only when needed (event handlers, hooks, browser APIs).
- Server Components are the default — keep them pure where possible.
- Use nested layouts (`layout.tsx`) for shared UI within route groups.
- Dynamic route params: `[taxId]`, `[fileId]`, `[id]`.

### Redux & RTK Query
- **Always** import `useAppDispatch` and `useAppSelector` from `redux/hooks.ts` — never the raw hooks from react-redux.
- Add new API endpoints by **injecting** into `baseApi` (see existing `orderApi.ts` pattern).
- Use tag invalidation (`providesTags` / `invalidatesTags`) to keep caches fresh. Existing tags: `files`, `orders`, `payments`, `news`.
- Auth state lives in `redux/feature/auth.ts`. Use `setUser` and `logout` actions.

### Forms
- Use **React Hook Form** with **Zod** schemas for all forms.
- Exclude fields like `confirmPassword` from API payloads (transform in `handleSubmit`).
- Login uses **mobile number** as primary identifier; email is optional on registration.

### Styling
- Use Tailwind CSS utility classes only. No inline styles, no CSS modules.
- Tailwind v4 is configured via `@theme inline` in `app/globals.css` — do not create a separate `tailwind.config.*` file.
- Use `cn()` from `lib/utils.ts` to merge conditional class names.
- Dark mode is supported via a custom dark variant defined in globals.css.

### Components
- Prefer editing existing components over creating new ones.
- Reuse Shadcn UI components from `components/ui/` — they are already installed.
- Shared/layout components go in `components/shared/` or `components/layouts/`.

### TypeScript
- Strict mode is on — no `any` unless unavoidable (add a comment explaining why).
- API responses are typed with `TResponse<T>` from `types/common.ts`.
- Path alias `@/*` maps to the project root.

### Environment
- `NEXT_PUBLIC_API_URL`: Backend API base URL. All RTK Query calls go through `axiosBaseQuery` which reads this variable.
- Do not hardcode API URLs anywhere.

---

## Auth Flow

1. Register (mobile number required, email optional) → OTP verification
2. Login with mobile number → JWT issued
3. JWT expiry checked with `isTokenExpired()` from `lib/utils.ts`
4. Protected routes rely on auth state in Redux (`auth.isLoggedIn`, `auth.user`)

---

## Tax Order Workflow (3 Steps)

| Step | Route | API Endpoint | Hook |
|---|---|---|---|
| 1 | `/profile/orders/create` | POST `/tax-orders/step-1` | `useCreateTaxStepOneMutation` |
| 1 edit | `/profile/orders/create/[taxId]` | PATCH `/tax-orders/{taxId}/step-1` | `useUpdateTaxStepOneMutation` |
| 2 | `/profile/orders/create/[taxId]` | PATCH `/tax-orders/{taxId}/step-2` | `useUploadTaxStepTwoDocumentsMutation` |
| 3 | `/profile/orders/create/[taxId]/payment` | POST `/tax-orders/{taxId}/step-3` | `useInitTaxStepThreePaymentMutation` |

---

## Image Uploads

- Use `useUploadFileMutation` (POST `/files/create-file`) with `multipart/form-data`.
- Images are hosted on Cloudinary. The domain is whitelisted in `next.config.ts`.

---

## What to Avoid

- Do not install a separate Tailwind config file — v4 config lives in `globals.css`.
- Do not use `npm` or `yarn` — only `pnpm`.
- Do not use raw `dispatch` or `useSelector` — use the typed wrappers in `redux/hooks.ts`.
- Do not add new UI primitives — check `components/ui/` first (55+ components already exist).
- Do not hardcode the API base URL.
- Do not put business logic in layout files.
