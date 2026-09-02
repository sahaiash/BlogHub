// Pure, framework-free validation for blog input.
// Kept dependency-free so it can be unit-tested in isolation and reused by
// both the server action (write path) and any future client-side checks.

export const TITLE_MAX_LENGTH = 80;

export interface BlogInput {
  title: string;
  body: string;
}

export function validateBlogInput(input: {
  title?: string | null;
  body?: string | null;
}): BlogInput {
  const title = (input.title ?? '').trim();
  const body = (input.body ?? '').trim();

  if (!title || !body) {
    throw new Error('Title and content are required.');
  }
  if (title.length > TITLE_MAX_LENGTH) {
    throw new Error(`Title must be ${TITLE_MAX_LENGTH} characters or fewer.`);
  }

  return { title, body };
}
