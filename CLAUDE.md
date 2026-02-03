# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## XOLACE APP Overview
The below description about Xolace is to help you suggest improvement or ideas when we building ui/features in the context of what Xolace is about.

What Xolace Is (at its core)

Xolace is a hybrid social + mental-wellness platform built around the idea of a digital campfire — a place where people can show up honestly without performing.
It is not therapy, and it does not replace professionals.
Instead, Xolace exists before, between, and outside of therapy — especially for people who don’t know what they need yet.

Xolace targets:
Emotional expression without pressure
Anonymous or low-identity sharing
Gentle reflection and grounding
Peer resonance, not viral performance
The platform is intentionally anti-performative.

Audience Reality (design for this person)
The dominant user mindset:
“I don’t know what I need, but something feels off.”
Users are often:
Emotionally tired
Burned out
Over-stimulated by traditional social media
Not ready for therapy
Afraid of being judged

Design should feel:
Calm
Spacious
Human
Unrushed


Business Reality (important constraints)
Early-stage startup
Engagement is currently fragile
The system must deliver value even when communities are quiet
AI costs must be controlled
Trust is more important than growth speed
Monetization is still evolving (subscription / credits), so avoid hard assumptions.

Summary for an AI Designer
If you are designing for Xolace:
You are not designing a social network.
You are not designing a productivity tool.
You are not designing a therapy app.

You are designing a place to sit with yourself — together.
When in doubt, choose:
Softer over louder
Slower over faster
Safer over stickier
Honest over impressive

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
