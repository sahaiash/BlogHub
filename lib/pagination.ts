// Pure pagination helpers — no framework/DB coupling, so they are trivially
// unit-testable and shared by the API route and any other paginated endpoint.

export interface Pagination {
  page: number;
  limit: number;
  offset: number;
}

export function parsePagination(
  input: { page?: string | null; limit?: string | null },
  opts: { defaultLimit?: number; maxLimit?: number } = {}
): Pagination {
  const defaultLimit = opts.defaultLimit ?? 9;
  const maxLimit = opts.maxLimit ?? 50;

  const page = Math.max(1, Number(input.page) || 1);
  const limit = Math.min(
    maxLimit,
    Math.max(1, Number(input.limit) || defaultLimit)
  );

  return { page, limit, offset: (page - 1) * limit };
}

export function totalPages(total: number, limit: number): number {
  if (limit <= 0) return 1;
  return Math.max(1, Math.ceil(total / limit));
}
