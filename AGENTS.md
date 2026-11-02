<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Shongjog

Frontend-only events platform landing site: Next.js 16 App Router (Turbopack), React 19, Tailwind v4, HeroUI v3. No API routes, data layer, tests, or CI yet.

## Commands

- `npm run dev` — dev server at http://localhost:3000.
- `npm run lint` — ESLint 9 flat config. `next lint` was removed in Next 16; use this script or `npx eslint <path>` for one file.
- `npx tsc --noEmit` — there is no typecheck script. Also runs during `next build`.
- `npm run build` — production build and prerender check. `next build` no longer lints.
- Verification order: `npm run lint`, then `npx tsc --noEmit` (or `npm run build` for both plus prerendering).
- No test runner is configured.

## Structure

- All routes live in `app/`; `app/layout.tsx` is the root shell and `app/page.tsx` is `/`.
- Route prop types are generated globals: `LayoutProps<'/'>`, `PageProps<'/path/[id]'>`. Do not import them.
- `@/*` maps to the repo root (there is no `src/`): e.g. `@/components/Home/Hero`.
- The root layout owns the Navbar, the `Providers` wrapper, and the `<main className="container mx-auto my-8">` container; pages render inside it.
- Feature components live in `components/<Feature>/` (`Navbar/Navbar.tsx`, `Home/Hero.tsx`); shared client widgets sit at `components/` top level.

## Styling

- Tailwind v4 is configured in CSS only (`app/globals.css`: `@import "tailwindcss"`, `@theme inline`, `@layer base`) and loaded through the `@tailwindcss/turbopack` rule in `next.config.ts`. Do not add `tailwind.config.*` or `postcss.config.*`.
- HeroUI v3 (not v2): components need no provider. Import from `@heroui/react` and use React Aria props such as `onPress`. Check installed types in `node_modules/@heroui/react/dist` rather than v2 docs.
- Prefer HeroUI's `button button--primary|secondary|outline|ghost` classes and semantic tokens (`text-accent`, `bg-background`, `border-border`) over raw colors.
- `app/globals.css` contains a full custom HeroUI palette for light and dark; update both blocks when changing a token. Headings are styled globally in `@layer base` (`h1`/`h2` use Playfair Display and `text-accent`).
- Dark mode uses next-themes with `attribute="class"` (`app/providers.tsx`), so `.dark` selectors apply. Keep `suppressHydrationWarning` on `<html>` and the mount guard in `ThemeToggle`, or expect hydration/theme flashes.
- Fonts are loaded with `next/font/google` in `app/layout.tsx` as `--font-inter` and `--font-playfair-display`; `font-display` maps to the latter.

## Gotchas

- `cacheComponents` and `partialPrefetching` are explicitly disabled in `next.config.ts`; do not use `"use cache"`/`cacheLife` or assume Partial Prefetching behavior without changing config first.
- Next 16's React hooks lint rules are strict: setting state synchronously inside an effect is an error (for example, `ThemeToggle`'s `mounted` guard). Preserve hydration-safe behavior when addressing it.
- `next dev` regenerates the managed block at the top of this file; leave it intact and commit it with your changes.
- `.vercel/` holds linked deployment metadata and is gitignored; do not edit or commit it.
