# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
bun run dev                    # Start Next.js dev server
bun run start                  # Start production server

# Code Quality
bun run lint                   # Check code with Biome
bun run lint:safe-fix          # Auto-fix lint issues
bun run format                 # Format code with Biome
bun run type-check             # TypeScript type checking

# Testing
bun test                       # Run all tests
bun test <path>                # Run single test file
bun test:watch                 # Run tests in watch mode

# Supabase
bun run supabase:start         # Start local Supabase
bun run supabase:restart       # Restart local Supabase
bun run supabase:generate-types    # Regenerate DB types from schema
bun run supabase:generate-migration # Create new migration from diff

# API Client Generation
bun run sync-api               # Regenerate src/api-client.ts from OpenAPI spec (requires dev server running)

# UI Components
bun run add-component          # Add shadcn components (bunx shadcn@latest add)
```

## Architecture

**Stack:** Next.js 16 (App Router) + Hono.js API + Supabase (PostgreSQL + Auth) + Tailwind CSS v4

### Directory Structure

```
backend/                    # Hono API layer
├── routes/                 # API route handlers (/api/v1/*)
│   └── v1/                 # Versioned routes (public.router.ts, auth.router.ts)
├── authz/                  # Authorization logic
├── middlewares/            # API middlewares
└── types.ts                # AppBindings for Hono context

src/
├── app/                    # Next.js App Router
│   ├── (auth-pages)/       # Public auth routes
│   ├── (protected)/        # Authenticated routes
│   └── api/[[...router]]/  # Hono catch-all route handler
├── features/               # Feature modules (auth, composer, feed, campfires, etc.)
├── components/
│   ├── ui/                 # Base shadcn components
│   ├── builders/           # Extended shadcn components
│   ├── animate-ui/         # Animated component variants
│   ├── shared/             # Modals, dialogs, reusable UI
│   └── [molecule-ui, spectrumui, kibo-ui]  # Additional registries
├── actions/                # Next.js server actions
├── hooks/                  # Custom React hooks
├── api-client.ts           # Generated API client (do not edit manually)
├── lib/
│   ├── supabase/           # Supabase clients (server.ts, admin.ts, middleware.ts)
│   └── utils.ts            # cn() helper, utilities
├── providers/              # React context providers
├── validation/             # Zod schemas
└── types/                  # TypeScript definitions
```

### Key Patterns

**State Management:** React Context API + TanStack React Query (no Redux/Zustand)
- See `src/features/composer/composer-context.tsx` for context pattern example
- Query provider configured with 5-min stale time, 20-min refetch interval

**Data Fetching:**
- Client components: Use generated hooks from `src/api-client.ts` (Orval-generated React Query hooks)
- Mutations: Use Next.js server actions in `src/actions/`
- API routes: Hono handlers in `backend/routes/`
- Never fetch data at page level (page-container); fetch in feature components

**API Layer:**
- Hono mounted at `/api/` with versioned routes (`/api/v1/public/*`, `/api/v1/auth/*`)
- OpenAPI spec available at `/api/doc`
- Run `bun run sync-api` after adding/modifying API routes to regenerate client

**Authentication:** Supabase Auth (email/password + anonymous)
- Server-side sessions via middleware
- Auth validation in `src/lib/supabase/middleware.ts`

**Database:** Direct Supabase queries (no ORM)
- Types auto-generated in `src/lib/supabase/types_db.d.ts`
- Regenerate after schema changes with `bun run supabase:generate-types`

## Code Conventions

**TypeScript:**
- Use type inference over explicit types
- Avoid `any`, `unknown` unless justified
- Path aliases: `@/*` → `./src/*`, `@backend/*` → `./backend/*`

**Naming:**
- Components/files: kebab-case (`post-composer.tsx`)
- Functions/variables: camelCase
- Constants: UPPER_SNAKE_CASE
- Types/Classes: PascalCase

**Styling:**
- Tailwind CSS exclusively via `cn()` utility from `@/lib/utils`
- Use design tokens (`bg-background`, `text-muted-foreground`) not hardcoded colors
- No inline styles

**Hooks:**
- Check shadcn hooks before creating custom ones: [shadcn.io/hooks](https://www.shadcn.io/hooks)

**Components:**
- Server Components by default
- Add `"use client"` for interactive components
- Multiple shadcn registries available: animate-ui, spectrumui, moleculeui, kibo-ui, magicui
