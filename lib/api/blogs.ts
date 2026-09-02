// Client-side access to the blogs API.
//
// The tenant is derived server-side from the Clerk session, so the client
// sends no orgId — it just asks for "my org's blogs".

// Shape of a blog as returned by GET /api/blogs. Dates arrive as ISO strings.
export interface BlogView {
  id: string;
  title: string;
  body: string;
  createdAt: string;
}

// Paginated envelope returned by GET /api/blogs.
export interface BlogPage {
  items: BlogView[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export async function fetchOrgBlogs(
  params: { page?: number; limit?: number } = {}
): Promise<BlogPage> {
  const search = new URLSearchParams();
  if (params.page) search.set('page', String(params.page));
  if (params.limit) search.set('limit', String(params.limit));
  const qs = search.toString();

  const response = await fetch(`/api/blogs${qs ? `?${qs}` : ''}`);
  if (!response.ok) {
    throw new Error('Failed to fetch blogs');
  }
  return response.json();
}
