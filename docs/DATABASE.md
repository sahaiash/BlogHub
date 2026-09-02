# Database

Postgres accessed through Drizzle ORM. All queries live in `db/queries/**`; the
schema is `db/schema.ts`.

## Schema

```
blogs (
  id         uuid        primary key default gen_random_uuid(),
  title      varchar(80) not null,
  body       text        not null,
  orgId      text        not null,   -- Clerk organization id (the tenant)
  createdAt  timestamp   not null default now()
)
```

Identity and organizations are owned by Clerk; this DB stores only content, keyed
to a tenant by `orgId`.

## Query patterns

There is essentially one read shape, used by the API, the dashboard, and the
public pages:

```sql
SELECT id, title, body, "createdAt"
FROM blogs
WHERE "orgId" = $1
ORDER BY "createdAt" DESC
[LIMIT $2 OFFSET $3];
```

Plus by-id reads/updates/deletes, all additionally scoped by `orgId`.

## Indexes

```sql
-- serves the WHERE (orgId) filter AND the ORDER BY createdAt DESC in one scan
CREATE INDEX blogs_org_id_created_at_idx ON blogs ("orgId", "createdAt" DESC);
```

Defined in `db/schema.ts` as a composite index. Rationale:

- `orgId` is the tenant discriminator — every query filters by it.
- `createdAt DESC` matches the sort, so paginated "newest first" reads use the
  index for both filter and order (no separate sort step), and `LIMIT` lets the
  scan stop early.
- `title`/`body` are never filtered or sorted → not indexed.

On a tiny table Postgres may prefer a `Seq Scan` (correct — it's cheaper); the
index pays off as the table grows.

## Observing query plans

```sql
EXPLAIN ANALYZE
SELECT id, title, body, "createdAt"
FROM blogs WHERE "orgId" = 'org_x' ORDER BY "createdAt" DESC LIMIT 10;
```

Read the output for:
- `Index Scan using blogs_org_id_created_at_idx` (good) vs `Seq Scan` (no index).
- `Rows Removed by Filter: N` — a large number means a missing/unused index.
- A missing `Sort` node with the composite index = the ordering came from the index.

If plans look wrong after big data changes, refresh stats: `ANALYZE blogs;`

## Migrations (drizzle-kit `push` workflow)

This project uses `push` (diff schema → alter DB), not migration files.

Local (Docker Postgres from `docker-compose.yml`):

```bash
docker compose up -d db
npm run db:push          # or: node_modules/.bin/drizzle-kit push
```

Cloud (Render — requires SSL; URL kept in `.env.backup`):

```bash
DATABASE_URL="$(grep '^DATABASE_URL=' .env.backup | cut -d= -f2-)" DB_SSL=true \
  node_modules/.bin/drizzle-kit push
```

Schema changes are additive where possible (add column with a default, add index)
so they apply without downtime or data loss.
