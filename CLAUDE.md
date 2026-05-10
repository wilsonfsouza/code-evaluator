# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**DevRoast** — a terminal-aesthetic web app where users paste code and receive an AI-powered "roast" (brutally honest code review). Scores are tracked on a shame leaderboard.

## Commands

Always activate Node 25 before running any pnpm/node/next command:

```bash
source ~/.nvm/nvm.sh && nvm use 25
```

| Task | Command |
|------|---------|
| Dev server | `pnpm dev` |
| Build | `pnpm build` |
| Lint | `pnpm lint` (Biome check) |
| Format | `pnpm format` (Biome format --write) |

No test suite is configured yet.

## Architecture

**Stack:** Next.js 16 App Router · React 19 · Tailwind CSS v4 · Biome 2.4 · TypeScript strict · pnpm

**Source layout:**

```
src/
  app/          # App Router — pages, layouts, route-specific client components
  components/
    ui/         # Reusable UI primitives (see src/components/ui/CLAUDE.md for patterns)
```

- `app/globals.css` is the single source of truth for `@theme` color tokens.
- Pages are Server Components; interactive islands are `"use client"` files co-located in `app/`.
- Async RSCs that use **shiki** for syntax highlighting cannot be used inside client components.

## Key Conventions

- **Exports:** Named exports everywhere. `export default` only for Next.js page/layout files.
- **Styling:** Colors come from `@theme` tokens in `globals.css` (`bg-accent-green`, `text-text-primary`, etc.). Use canonical class names, not arbitrary `bg-(--color-*)` syntax. SVG attributes are the only exception — use `var(--color-*)` there.
- **Class merging:** `tv()` (tailwind-variants) for components with variants; `twMerge()` for everything else. Never string interpolation.
- **Component props:** Extend `ComponentProps<"element">` from React, not hand-rolled prop interfaces for HTML attrs.
- **Complex components:** Use composition (sub-components exported from the same file) when a component has 2+ distinct content regions — see `AnalysisCard` / `AnalysisCardHeader` as the canonical example.
- **Fonts:** Only `font-sans` (Geist) and `font-mono` (JetBrains Mono). No custom font classes.
- **Buttons:** Use `enabled:hover:` / `enabled:active:` prefixes so hover styles don't apply when `disabled`.
