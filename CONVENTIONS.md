# Project Conventions

The rules this codebase follows. New code should match them; a reviewer can grade
any file against this list. Kept short on purpose — every rule here is actually
enforced in the code today.

## Architecture — layers and what may call what

Data flows in one direction. A layer may only call the layer below it.

```
UI (Server/Client Components)  →  Server Actions / API Route Handlers  →  Data-access layer  →  Drizzle / Postgres
```

| Layer | Location | Responsibility | May NOT do |
|---|---|---|---|
| Presentation | `app/**/*.tsx`, `app/components/**` | Render, hold UI state | Import `db` or `blogTable`; contain SQL |
| Server actions | `app/(root)/org/[slug]/action.ts` | Auth, validate, orchestrate a write | Build queries inline |
| API route handlers | `app/api/**/route.ts` | Auth, parse request, shape response | Build queries inline |
| Data-access | `db/queries/*.ts` | **All** DB reads/writes | Read auth/session, return raw entities |
| Persistence | `db/`, `db/schema.ts` | Connection + schema | — |

**Hard rule:** only files in `db/queries/**` import `@/db` or `blogTable`. Everything
else calls a query function. (Grep check: `db.select`/`db.insert` must not appear
outside `db/queries/`.)

## Multi-tenancy — the tenant comes from the session, never the client

- `orgId` is always read from the Clerk session via `await auth()` on the server.
- It is **never** accepted from a query string, body, or route param.
- Every data-access function takes `orgId` as its first argument and scopes the
  query to it (`where orgId = ...`) — including updates and deletes, so one org
  can never read or mutate another's rows even with a valid id.

## Data shapes — never leak entities

- API/route responses return **view models**, not ORM entities. Internal columns
  (e.g. `orgId`) are omitted. See `BlogListItem` in `db/queries/blogs.ts`.
- Client code imports client-facing types from `lib/api/*` (e.g. `BlogView`,
  `BlogPage`) — never from `db/`.

## Validation — at the trust boundary

- Validate on the **server**, in the server action, using the pure helpers in
  `lib/validation.ts`. UI-side checks are for UX only and are not trusted.

## Data fetching

- **Public, read-only pages** (subdomain) fetch server-side by calling the
  data-access layer directly in a Server Component.
- **Authenticated management views** fetch through the API via `lib/api/blogs.ts`
  (`fetchOrgBlogs`). Do not call `fetch('/api/...')` ad hoc from components.

## Pagination

- List endpoints return an envelope: `{ items, total, page, limit, totalPages }`.
- Parsing/among-bounds logic lives in `lib/pagination.ts` (pure, tested). Default
  page size 9 (management), 6 (public); hard max 50.

## Pure logic is extracted and tested

- Framework-free logic (validation, pagination math) lives in `lib/*.ts` with a
  co-located `*.test.ts` using Node's built-in runner. Run: `npm test`.
- Test files are excluded from the build (`tsconfig.json` → `exclude`).

## Naming & files

- Components `PascalCase`; functions/vars `camelCase`; DB columns as defined in
  `db/schema.ts`.
- Route groups: `(root)` = authenticated app, `(subdomain)` = public blogs.
- A client form paired with a server page lives beside it (e.g.
  `blogs/[id]/edit/page.tsx` + `edit-form.tsx`).

## UX states

- Every async route provides `loading.tsx`; the app provides an `error.tsx`
  boundary. Empty states are explicit, not blank screens.

## Secrets & config

- Never commit secrets. `.env*` and `.pg_service.conf` are git-ignored.
- SSL to the DB is enabled in production or when `DB_SSL=true` (see `db/index.ts`).
