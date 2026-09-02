import Nav from "@/app/components/nav";
import { auth } from "@clerk/nextjs/server";
import { getBlogById } from "@/db/queries/blogs";
import { notFound } from "next/navigation";
import EditBlogForm from "./edit-form";

export default async function EditBlogPage({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}) {
  const { slug, id } = await params;

  // Tenant is derived from the session; the query is scoped to it, so a post
  // belonging to another org resolves to "not found".
  const { orgId } = await auth();
  if (!orgId) notFound();

  const blog = await getBlogById(orgId, id);
  if (!blog) notFound();

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Nav />
      <EditBlogForm
        slug={slug}
        id={blog.id}
        initialTitle={blog.title}
        initialBody={blog.body}
      />
    </main>
  );
}
