import { clerkClient } from '@clerk/nextjs/server';
import { getBlogById } from '@/db/queries/blogs';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function PublicPostPage({
  params,
}: {
  params: Promise<{ subdomain: string; id: string }>;
}) {
  const { subdomain, id } = await params;

  try {
    const client = await clerkClient();
    const org = await client.organizations.getOrganization({ slug: subdomain });

    const blog = await getBlogById(org.id, id);
    if (!blog) notFound();

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-3xl mx-auto px-4 py-12">
          <Link href="/" className="text-sm text-blue-600 hover:underline">
            ← {org.name}
          </Link>

          <article className="bg-white rounded-2xl shadow-sm border border-gray-200 mt-6 p-8 md:p-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {blog.title}
            </h1>
            <div className="flex items-center text-sm text-gray-500 mb-8 pb-8 border-b border-gray-100">
              <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {new Date(blog.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {blog.body}
              </p>
            </div>
          </article>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching organization or post:', error);
    notFound();
  }
}
