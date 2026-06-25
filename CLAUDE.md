# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # Start dev server (Next.js, port 3000)
pnpm build        # Production build
pnpm lint         # ESLint

# Database (Drizzle Kit)
pnpm drizzle-kit generate   # Generate migrations from schema changes
pnpm drizzle-kit migrate    # Apply pending migrations
pnpm drizzle-kit studio     # Open Drizzle Studio (DB browser)
```

No test suite exists yet. There is no `pnpm test` command.

## Architecture

### Route groups

```
app/
  (app)/          # Authenticated app routes (chat, dashboard, profile)
  (auth)/         # Auth routes (login, signup) — no Header/shell
  api/            # API routes
```

The root `layout.tsx` renders `<Header>` and wraps everything in `<ThemeProvider>` (next-themes, class strategy) and `<Toaster>` (sonner).

### Auth — better-auth

- Server: `app/lib/auth/auth.ts` — the `auth` instance (Drizzle adapter, Google OAuth, passkey plugin)
- Server helper: `app/lib/auth/check-session.ts` — call `checkSession()` at the top of every API route handler that needs the user
- Client: `app/lib/auth/auth-client.ts` — `authClient` (better-auth React client + passkey plugin)
- Auth API is handled by `app/api/auth/[...all]/route.ts`
- User roles are stored on `user.role` and default to `"patient"`

### Database — Drizzle ORM + Neon PostgreSQL

Schema lives in `app/lib/db/schema.ts`. The db client is at `app/lib/db/index.ts`.

Key tables: `user`, `session`, `account`, `passkey`, `verification` (all managed by better-auth), plus app-owned `chat_sessions` and `messages`.

### AI chat — Vercel AI SDK + Groq

`POST /api/chat` handles all chat turns:
1. Validates the request with `ChatRequestSchema` (zod, `app/lib/zod/chat.ts`)
2. Creates a `chat_sessions` row on the first message, generating a title via `llama-3.1-8b-instant`
3. Persists the user message, then streams the assistant response using `openai/gpt-oss-120b` via Groq
4. Persists the assistant message in the `onFinish` callback

The client uses `useChat` from `@ai-sdk/react`. The `chatSessionId` is a `crypto.randomUUID()` generated client-side when navigating to `/chat/<uuid>`.

### Chat page data flow

The chat layout (`app/(app)/chat/layout.tsx`) is a client component that fetches the sessions list from `GET /api/chat/chat-sessions` on every `chatSessionId` route change, keeping the sidebar in sync after new sessions are created.

The chat page (`app/(app)/chat/[chatSessionId]/page.tsx`) is also a client component that fetches message history from `GET /api/chat/chat-sessions/[chatSessionId]/messages` on mount.

## Styling rules

### Always use design tokens, never raw Tailwind color scales

All colors come from CSS variables defined in `app/globals.css` and bridged into Tailwind via `@theme inline`. Never use raw Tailwind palette colors (e.g. `text-green-600`, `bg-gray-100`) — always use the token-based classes below.

**Backgrounds:** `bg-primary`, `bg-surface`, `bg-card`  
**Text:** `text-primary`, `text-muted`, `text-accent`, `text-on-accent`  
**Borders:** `border-subtle`, `border-accent`  
**Brand accent (Tailwind-generated):** `bg-accent`, `bg-accent/10`, `text-accent`, `border-accent`, `bg-accent-hover`  
**Semantic:** `bg-warning-bg`, `text-warning-text`, `border-warning-border`, `text-danger`, `bg-danger`, `text-success`, `bg-success`

**Reusable component classes** (defined in `@layer components`):  
- `btn-accent` — primary green action button  
- `icon-btn` — 32×32 square icon button  
- `input-base` — themed input/textarea  
- `skeleton` — shimmer loading placeholder

### Use `cn()` for all conditional class expressions

Import from `@/app/lib/cn/cn`. Never use template-literal ternaries for class names — always `cn(...)`.

```tsx
import { cn } from "@/app/lib/cn/cn";

<div className={cn("base-class", isActive && "bg-accent/10 border border-accent/20")} />
```

### Dark mode

Dark mode is driven by the `.dark` class on `<html>` (toggled by next-themes). The `@variant dark` override in `globals.css` makes `dark:` Tailwind variants respond to this class instead of `prefers-color-scheme`. All design token variables automatically swap — no need for `dark:` variants on token-based classes.

## TypeScript conventions

### Use named parameters for functions with more than one parameter

Any function or callback with two or more parameters must use a single destructured object argument, not positional parameters.

```ts
// wrong
function doSomething(id: string, title: string) {}

// correct
function doSomething({ id, title }: { id: string; title: string }) {}
```

This applies to callbacks passed as props too:

```tsx
// wrong
onTitleSaved={(id, title) => ...}

// correct
onTitleSaved={({ chatSessionId, title }) => ...}
```

## Environment variables

See `.env.example`. Required:
- `DATABASE_URL` — Neon PostgreSQL connection string
- `GROQ_API_KEY` — Groq API key
- `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL` — better-auth config
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` — Google OAuth
- `PASSKEY_CONTEXT_SECRET` — passkey plugin

## Next.js version note

This project uses Next.js 16, which has breaking changes from earlier versions. Before writing any Next.js-specific code, check `node_modules/next/dist/docs/` for the authoritative API reference.
