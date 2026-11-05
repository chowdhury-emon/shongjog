<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Shongjog

Community-events platform. This repo is the Next.js 16 frontend (App Router, Turbopack, React 19, Tailwind v4, HeroUI v3). Only auth is implemented in-repo; events CRUD lives in the separate Express + MongoDB backend at `http://localhost:5000` (`../../backend/shongjog-backend`, wired through the gitignored `shongjog.code-workspace`). No tests or CI.

## Commands

- `npm run dev` — dev server at http://localhost:3000. `next dev` also rewrites the managed block at the top of this file.
- `npm run lint` — ESLint 9 flat config (`eslint.config.mjs`); `next lint` was removed in Next 16 and `next build` no longer lints. Use `npx eslint <path>` for one file.
- `npx tsc --noEmit` — there is no typecheck script; it also runs during `next build`.
- `npm run build` — production build and prerender check.
- Verify with `npm run lint` then `npx tsc --noEmit` (or `npm run build` for both plus prerendering).
- Known baseline: lint currently fails on 3 pre-existing errors — `react/no-unescaped-entities` in `app/(auth)/sign-in/page.tsx` and `app/events/create/page.tsx`, and `react-hooks/set-state-in-effect` in `components/ThemeToggle.tsx`. Don't attribute these to your change.
- No test runner is configured.

## Architecture

- `app/layout.tsx` is the root shell: fonts + global CSS, `Providers` (next-themes), sticky Navbar header, `<main className="container mx-auto">` (pages add their own padding), empty footer, HeroUI `ToastProvider` (required for `toast.*`).
- Routes: `app/page.tsx` (`/`), `app/(auth)/sign-in`, `app/(auth)/sign-up`, `app/events/create`. Navbar/Hero link to `/events/manage`, `/events/joined`, `/upcoming-events`, and `/create-event`, which don't exist yet — the real create route is `/events/create`.
- Auth: Better Auth + MongoDB. Server instance in `lib/auth.ts` (hardcoded DB `shongjog`); handler in `app/api/auth/[...all]/route.ts`; client helpers in `lib/auth-client.ts` (`signIn`, `signUp`, `signOut`, `useSession`). `.env` is gitignored and needs `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `MONGODB_URI`, `GOOGLE_CLIENT_ID/SECRET`, `GITHUB_CLIENT_ID/SECRET`.
- `app/events/create` POSTs JSON to `http://localhost:5000/events/create`; that backend must be running (`npm run dev` in the sibling repo). Don't replace it with a local API route unless asked.
- Route prop types are generated globals: `LayoutProps<'/'>`, `PageProps<'/path/[id]'>`, `RouteContext<'/api/...'>`. Do not import them; `params`/`searchParams` are promises.
- `@/*` maps to the repo root (there is no `src/`): e.g. `@/components/Home/Hero`.
- Components: feature folders under `components/<Feature>/` (Navbar, Home); shared client widgets sit at `components/` top level (`ThemeToggle`).

## Styling

- Tailwind v4 is configured in CSS only (`app/globals.css`: `@import "tailwindcss"`, `@import "@heroui/styles"`, `@theme inline`, `@layer base`) plus the `@tailwindcss/turbopack` rule in `next.config.ts`. Do not add `tailwind.config.*` or `postcss.config.*`.
- HeroUI v3 (installed 3.2.7), not v2: no provider needed. Import from `@heroui/react`, use React Aria props (`onPress`, `isDisabled`, `variant`), and check installed types in `node_modules/@heroui/react/dist` rather than v2 docs.
- Prefer HeroUI's `button button--primary|secondary|outline|ghost` classes and semantic tokens (`bg-background`, `bg-surface`, `text-accent`, `text-muted`, `border-border`) over raw colors.
- `app/globals.css` has a full custom HeroUI palette for light and dark; update both blocks when changing a token. `h1`/`h2` are styled globally with Playfair Display and `text-accent`.
- Forms: follow the auth pages — HeroUI `Form` + `validate` + `<FieldError />` (errors only render through `FieldError`). `app/events/create` is the one plain `<form>`.
- Dark mode uses next-themes with `attribute="class"` (`app/providers.tsx`); keep `suppressHydrationWarning` on `<html>` and the `ThemeToggle` mount guard, or expect hydration/theme flashes.
- Fonts are loaded with `next/font/google` in `app/layout.tsx` as `--font-inter` and `--font-playfair-display`; `font-display` maps to the latter.
- `next/image` can load any HTTPS host because `images.remotePatterns` is a `**` wildcard in `next.config.ts`.

## Gotchas

- `cacheComponents` and `partialPrefetching` are explicitly disabled in `next.config.ts`; do not use `"use cache"`/`cacheLife` or assume Partial Prefetching behavior without changing config first.
- Next 16's React hooks lint rules are strict: `react-hooks/set-state-in-effect` is an error, and `ThemeToggle`'s `mounted` guard is the existing violation. Preserve hydration-safe behavior when addressing it.
- `next dev` regenerates the managed block at the top of this file; leave it intact and commit it with your changes.
