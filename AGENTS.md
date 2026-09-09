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
  (app)/          # Authenticated app routes (today, practice, reflect, support, learn, chat, profile)
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

Every CRUD route handler must enforce row ownership, not just authentication. `checkSession()` proves _who_ the caller is; each query must also prove the rows _belong to them_:

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
    isActive && "bg-accent/10 border border-accent/20",
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
| `card-tall`   | 500px  | Cards with both a form and a scrollable list          |

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

## Motion and transitions

Use brief, purposeful transitions when UI elements are inserted, removed, expanded, or collapsed so users retain spatial context and layout changes do not feel abrupt.

- For CSS transitions, use the shared motion tokens: `--motion-fast` for hover and micro-interactions, `--motion-row` for inserting or removing individual items, and `--motion-section` for expanding or collapsing larger panels.
- For CSS transitions, use the corresponding Tailwind utilities `duration-fast`, `duration-row`, and `duration-section`; do not introduce arbitrary transition durations when one of these tokens applies.
- For CSS transitions, prefer `ease-out` for entry and `ease-in` for removal.
- Animate opacity and layout or transform properties only.
- Do not animate initial page rendering or routine data updates without a clear UX benefit.
- Preserve existing CSS support for `prefers-reduced-motion`; do not introduce per-component reduced-motion hooks or conditional Motion animation values.

### Motion implementation

When creating or changing interactive UI, include purposeful animations for user-triggered state changes as part of the implementation.

Use `app/components/practice/prepare/fear-hierarchy/extraction-preview/fear-editor/SafetyBehavioursEditor.tsx` as the reference for editable lists and switching between populated and empty states. Use `app/components/practice/prepare/fear-hierarchy/extraction-preview/fear-editor/ThemeSelector.tsx` as the reference for selectable chips and collapsible panels. Consistency means shared timing defaults and state-change behaviour; choose movement appropriate to the control rather than applying the same animation to every element. Follow the rules below even where a reference does not yet implement them.

- Use Motion from `motion/react` for enter/exit and layout animations. Use CSS transitions for simple hover and focus feedback and icon state changes such as chevron rotation. Apply `transition-transform` with a shared duration utility directly to the icon; do not add a Motion wrapper just to rotate an icon.
- Wrap conditionally rendered animated elements in `AnimatePresence` so removal animations finish before the elements unmount.
- Keep keyed animated rows directly inside a shared `AnimatePresence`; do not wrap each mapped row in its own presence boundary.
- Use stable data IDs for keys, never array indices or IDs generated during rendering.
- Use `layout` when adding, removing, or resizing content should smoothly reposition surrounding elements. Use `layout="position"` when only their position should animate.
- For selectable chips, combine opacity with a small scale change (`0.8` to `1`) and use `layout` with `AnimatePresence mode="popLayout"` to reposition remaining chips. Give the containing element `position: relative` when using `popLayout`.
- For editable input rows, animate opacity and height between `0` and `"auto"` when adding or removing rows within a populated list. Keep spacing inside the animated wrapper so it collapses with the row; avoid scaling inputs and their text.
- For collapsible sections, animate height between `0` and `"auto"` with `overflow-hidden`, alongside opacity.
- Use `overflow-hidden` only where height animation needs clipping. Leave enough inner padding for input borders and focus rings so they are not cut off; opacity-only wrappers do not need clipping.
- Switching between an empty state and the first or last item must use an opacity crossfade, with no sliding, height collapse, or delayed reveal of the empty text. For form lists, use an outer `AnimatePresence initial={false} mode="popLayout"` around keyed empty/list wrappers and a separate presence boundary for rows within the list.
- Match empty-state height to the control it replaces: input height for editable lists and chip height for theme selections. Use muted, left-aligned text without a decorative visible border.
- Use `initial={false}` on `AnimatePresence` to avoid animating initial rendering. Also use it on nested chip or row lists so opening a panel does not replay entrance animations for every item. Subsequent user-triggered additions, removals, and expansion should still animate.
- Use Motion’s default timing and easing for Motion animations. Omit explicit `transition` durations and easing unless a specific interaction requires custom timing; CSS duration tokens do not need to be applied to Motion.
- Do not import or use `useReducedMotion`. Use the same Motion animation values for all users, without `shouldReduceMotion` branches. Do not add a `MotionConfig` reduced-motion override as a substitute.
- Check adding, removing, expanding, collapsing, and empty-state transitions when relevant to the UI being changed.

## Component conventions

### Never define components inside other component files

Every component must live in its own file. Defining a component function inside another component's file is an anti-pattern — extract it to its own file and import it.

### Inline forms vs. modal forms

Card forms follow the weight of the entry:

- **Quick capture (1–3 fields)** — render the form inline at the top of the card, above the scrollable list (Trigger Log, Fear Hierarchy, Safety Behaviours).
- **Structured entry (4+ fields)** — keep the card list-only with an action button in the card header, and put the form inside `<Modal>` from `app/components/common/Modal.tsx` (ERP Tracker). An inline form that large crowds out the list, which is the part with actual value.

`Modal` handles focus trapping, Escape-to-close, backdrop click, body scroll lock, and renders through a portal. Give modal form fields real `<label>` elements rather than placeholder-only labelling.

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
