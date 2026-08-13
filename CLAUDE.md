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
- User roles are stored on `user.role` and default to `"user"` (existing rows may still hold the old `"patient"` value; `"therapist"` is the other role)

### API route ownership checks

Every CRUD route handler must enforce row ownership, not just authentication. `checkSession()` proves *who* the caller is; each query must also prove the rows *belong to them*:

- **Reads (GET):** always include `eq(table.userId, session.user.id)` in the WHERE clause.
- **Creates (POST):** take `userId` from `session.user.id`, never from the request body.
- **Updates/deletes on `[id]` routes:** put ownership in the mutation itself — `where(and(eq(table.id, id), eq(table.userId, session.user.id)))` with `.returning()`, and return 404 when no row comes back. Never check ownership in a separate SELECT before mutating.
- **Client-supplied resource IDs** (e.g. `chatSessionId` in `POST /api/chat`): if the row exists but belongs to another user, return 403; only create it under the caller's own `userId`.
- **Bulk operations:** combine `inArray(...)` with the `userId` filter so guessed IDs belonging to other users are silently excluded.

When responding to lookups of resources the caller doesn't own, prefer the same response as "not found" (404 or an empty list) so valid IDs belonging to other users aren't discoverable.

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

<div
  className={cn(
    "base-class",
    isActive && "bg-accent/10 border border-accent/20"
  )}
/>;
```

### Dark mode

Dark mode is driven by the `.dark` class on `<html>` (toggled by next-themes). The `@variant dark` override in `globals.css` makes `dark:` Tailwind variants respond to this class instead of `prefers-color-scheme`. All design token variables automatically swap — no need for `dark:` variants on token-based classes.

## Card heights

All cards must use one of the three height tier classes defined in `globals.css`. Fixed heights prevent layout jumps between loading and loaded states — the skeleton always fills the same space as the real content.

| Class         | Height | When to use                                           |
| ------------- | ------ | ----------------------------------------------------- |
| `card-short`  | 280px  | Simple read-only cards with minimal or static content |
| `card-medium` | 420px  | Cards with a list or moderate scrollable content      |
| `card-tall`   | 560px  | Cards with both a form and a scrollable list          |

Always pair the height class with `flex flex-col` on the card root. When the card contains a scrollable region (list, feed, etc.), wrap it in a `div` with `flex-1 min-h-0 overflow-y-auto` so it fills the remaining space and scrolls rather than overflowing:

```tsx
<div className="bg-card border border-subtle rounded-xl p-4 flex flex-col gap-4 card-tall">
  {/* fixed header */}
  {/* fixed form */}
  <div className="flex-1 min-h-0 overflow-y-auto">
    {/* scrollable content */}
  </div>
</div>
```

## Loading states

Always show a loading indicator when UI depends on an async operation or API call:

- **Buttons/inline actions** — swap the button's icon or label for `<LoadingSpinner />` and `disabled` the button while the request is in flight. Do not add a separate spinner next to the button.
- **Page sections / lists / panels** — create a dedicated skeleton loader component in `app/components/loaders/` (e.g. `ChatSessionsSidebarLoader.tsx`) using the `<Skeleton />` primitive from `LoadingSkeleton.tsx`, then render it in place of the real UI until data arrives.

Use `null` (not `[]` or `""`) as the initial state sentinel to distinguish "still loading" from "loaded but empty".

## Component conventions

### Never define components inside other component files

Every component must live in its own file. Defining a component function inside another component's file is an anti-pattern — extract it to its own file and import it.

## TypeScript conventions

### Always use `type`, never `interface`

Use `type` for all type declarations. Never use `interface`.

```ts
// wrong
interface Props {
  id: string;
}

// correct
type Props = { id: string };
```

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

## Streak tracking

Call `updateStreak({ userId })` from `@/app/lib/streak/update-streak` in any POST/PATCH/DELETE route handler that represents a deliberate user action (mood log, todo completion, ERP session, etc.). Do not call it in GET handlers, auth routes, or background/system operations. Always call it after the main DB write succeeds, never before.

Before calling `updateStreak`, check `session.user.lastActivityDate` against today's date and skip if they match — this avoids a redundant DB write when the user has already been active today:

```ts
const today = new Date().toISOString().split("T")[0];
if (session.user.lastActivityDate !== today) {
  await updateStreak({ userId: session.user.id });
}
```

Note: `lastActivityDate` is only available on `session.user` if it is registered as an `additionalField` in `app/lib/auth/auth.ts`.

## Next.js version note

This project uses Next.js 16, which has breaking changes from earlier versions. Before writing any Next.js-specific code, check `node_modules/next/dist/docs/` for the authoritative API reference.
