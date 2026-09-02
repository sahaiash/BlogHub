'use server';

import { auth } from '@clerk/nextjs/server';
import {
  insertBlog,
  updateBlog as updateBlogQuery,
  deleteBlog as deleteBlogQuery,
} from '@/db/queries/blogs';
import { validateBlogInput } from '@/lib/validation';

/**
 * Server actions for blog mutations.
 *
 * The tenant (orgId) is always taken from the authenticated Clerk session,
 * never from the caller, and input is validated here at the trust boundary —
 * not only in the UI. Updates and deletes are scoped to the caller's org in the
 * data layer, so one org can never mutate another's posts.
 */

async function requireOrg(): Promise<string> {
  const { userId, orgId } = await auth();
  if (!userId) {
    throw new Error('You must be signed in.');
  }
  if (!orgId) {
    throw new Error('Select an organization first.');
  }
  return orgId;
}

export const createBlog = async (input: { title: string; body: string }) => {
  const orgId = await requireOrg();
  const { title, body } = validateBlogInput(input);
  return insertBlog({ orgId, title, body });
};

export const updateBlog = async (input: {
  id: string;
  title: string;
  body: string;
}) => {
  const orgId = await requireOrg();
  const { title, body } = validateBlogInput(input);
  const ok = await updateBlogQuery(orgId, input.id, { title, body });
  if (!ok) {
    throw new Error('Post not found.');
  }
};

export const deleteBlog = async (input: { id: string }) => {
  const orgId = await requireOrg();
  const ok = await deleteBlogQuery(orgId, input.id);
  if (!ok) {
    throw new Error('Post not found.');
  }
};
