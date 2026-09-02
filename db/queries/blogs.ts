import { db } from '@/db';
import { blogTable, type SelectBlogType } from '@/db/schema';
import { and, desc, eq, sql } from 'drizzle-orm';

/**
 * Data-access layer for blogs.
 *
 * Every blog query lives here. Routes, server actions and Server Components
 * call these functions — they never touch `db` or `blogTable` directly. This
 * is the single seam where persistence can change (ORM, caching, etc.) without
 * touching callers.
 *
 * Every read and write is scoped by `orgId` (the tenant), so a caller can never
 * reach another organization's data even with a valid post id.
 */

// View model returned to callers — intentionally omits internal columns
// (e.g. orgId) so we never leak the entity shape out of this layer.
export type BlogListItem = Pick<SelectBlogType, 'id' | 'title' | 'body' | 'createdAt'>;

const listColumns = {
  id: blogTable.id,
  title: blogTable.title,
  body: blogTable.body,
  createdAt: blogTable.createdAt,
};

// A malformed id would make Postgres throw on a uuid comparison; guard instead.
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function getBlogsByOrg(
  orgId: string,
  { limit = 9, offset = 0 }: { limit?: number; offset?: number } = {}
): Promise<BlogListItem[]> {
  return db
    .select(listColumns)
    .from(blogTable)
    .where(eq(blogTable.orgId, orgId))
    .orderBy(desc(blogTable.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function countBlogsByOrg(orgId: string): Promise<number> {
  const [row] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(blogTable)
    .where(eq(blogTable.orgId, orgId));
  return row?.count ?? 0;
}

export async function getBlogById(
  orgId: string,
  id: string
): Promise<BlogListItem | null> {
  if (!UUID_RE.test(id)) return null;
  const [row] = await db
    .select(listColumns)
    .from(blogTable)
    .where(and(eq(blogTable.orgId, orgId), eq(blogTable.id, id)))
    .limit(1);
  return row ?? null;
}

export async function insertBlog(input: {
  orgId: string;
  title: string;
  body: string;
}): Promise<string> {
  const [row] = await db
    .insert(blogTable)
    .values(input)
    .returning({ id: blogTable.id });
  return row.id;
}

export async function updateBlog(
  orgId: string,
  id: string,
  input: { title: string; body: string }
): Promise<boolean> {
  if (!UUID_RE.test(id)) return false;
  const rows = await db
    .update(blogTable)
    .set({ title: input.title, body: input.body })
    .where(and(eq(blogTable.orgId, orgId), eq(blogTable.id, id)))
    .returning({ id: blogTable.id });
  return rows.length > 0;
}

export async function deleteBlog(orgId: string, id: string): Promise<boolean> {
  if (!UUID_RE.test(id)) return false;
  const rows = await db
    .delete(blogTable)
    .where(and(eq(blogTable.orgId, orgId), eq(blogTable.id, id)))
    .returning({ id: blogTable.id });
  return rows.length > 0;
}
