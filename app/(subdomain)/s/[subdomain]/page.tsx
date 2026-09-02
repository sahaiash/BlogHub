import { clerkClient } from '@clerk/nextjs/server';
import { countBlogsByOrg, getBlogsByOrg } from '@/db/queries/blogs';
import { notFound } from 'next/navigation';
import Link from 'next/link';

const PAGE_SIZE = 6;

export default async function SubdomainPage({
  params,
  searchParams,
}: {
  params: Promise<{ subdomain: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { subdomain } = await params;
  const { page: pageParam } = await searchParams;

  try {
    const client = await clerkClient();
    const org = await client.organizations.getOrganization({ slug: subdomain });
    const orgId = org.id;

    const total = await countBlogsByOrg(orgId);
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    const page = Math.min(Math.max(1, Number(pageParam) || 1), totalPages);
    const blogs = await getBlogsByOrg(orgId, {
      limit: PAGE_SIZE,
      offset: (page - 1) * PAGE_SIZE,
    });

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <header className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{org.name}</h1>
            <p className="text-lg text-gray-600">Blog &amp; Insights</p>
          </header>

          {blogs.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No posts yet</h3>
              <p className="text-gray-600">Check back soon for new content!</p>
            </div>
          ) : (
            <>
              <div className="space-y-8">
                {blogs.map((blog) => (
                  <article key={blog.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300">
                    <div className="p-8">
                      <Link href={`/${blog.id}`}>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4 leading-tight hover:text-blue-600 transition-colors">
                          {blog.title}
                        </h2>
                      </Link>
                      <p className="text-gray-700 leading-relaxed line-clamp-3">
                        {blog.body}
                      </p>
                      <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-500">
                          <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {new Date(blog.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </div>
                        <Link href={`/${blog.id}`} className="text-sm font-medium text-blue-600 hover:underline">
                          Read more →
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-12">
                  {page > 1 ? (
                    <Link
                      href={page - 1 === 1 ? '/' : `/?page=${page - 1}`}
                      className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      ← Previous
                    </Link>
                  ) : (
                    <span className="px-4 py-2 rounded-lg bg-white/50 border border-gray-200 text-gray-400 cursor-not-allowed">
                      ← Previous
                    </span>
                  )}
                  <span className="text-sm text-gray-600">
                    Page {page} of {totalPages}
                  </span>
                  {page < totalPages ? (
                    <Link
                      href={`/?page=${page + 1}`}
                      className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Next →
                    </Link>
                  ) : (
                    <span className="px-4 py-2 rounded-lg bg-white/50 border border-gray-200 text-gray-400 cursor-not-allowed">
                      Next →
                    </span>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching organization or blogs:', error);
    notFound();
  }
}
