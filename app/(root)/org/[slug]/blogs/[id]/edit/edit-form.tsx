"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import Link from "next/link";
import * as React from "react";
import { deleteBlog, updateBlog } from "../../../action";

interface EditBlogFormProps {
  slug: string;
  id: string;
  initialTitle: string;
  initialBody: string;
}

export default function EditBlogForm({
  slug,
  id,
  initialTitle,
  initialBody,
}: EditBlogFormProps) {
  const router = useRouter();
  const [title, setTitle] = React.useState(initialTitle);
  const [body, setBody] = React.useState(initialBody);
  const [isSaving, setIsSaving] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [error, setError] = React.useState('');

  const listHref = `/org/${slug}/blogs`;
  const isBusy = isSaving || isDeleting;

  const handleSave = async () => {
    if (!title.trim() || !body.trim()) {
      setError('Please fill in both title and content');
      return;
    }
    setIsSaving(true);
    setError('');
    try {
      await updateBlog({ id, title: title.trim(), body: body.trim() });
      router.push(listHref);
      router.refresh();
    } catch (err) {
      console.error('Error updating blog:', err);
      setError('Failed to save changes. Please try again.');
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this post? This cannot be undone.')) return;
    setIsDeleting(true);
    setError('');
    try {
      await deleteBlog({ id });
      router.push(listHref);
      router.refresh();
    } catch (err) {
      console.error('Error deleting blog:', err);
      setError('Failed to delete post. Please try again.');
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Link href={listHref} className="text-sm text-blue-600 hover:underline">
          ← Back to posts
        </Link>
        <h1 className="text-4xl font-bold text-gray-900 mt-4">Edit Blog Post</h1>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <span className="text-red-800">{error}</span>
          </div>
        )}

        <div className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Blog Title
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-lg"
              maxLength={80}
            />
            <div className="mt-1 text-sm text-gray-500 text-right">
              {title.length}/80 characters
            </div>
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              Blog Content
            </label>
            <Textarea
              id="content"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="min-h-[300px] text-base leading-relaxed resize-none"
            />
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <Button
              variant="ghost"
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleDelete}
              disabled={isBusy}
            >
              {isDeleting ? 'Deleting…' : 'Delete Post'}
            </Button>
            <div className="flex items-center gap-3">
              <Link href={listHref}>
                <Button variant="outline" disabled={isBusy}>Cancel</Button>
              </Link>
              <Button
                onClick={handleSave}
                disabled={isBusy || !title.trim() || !body.trim()}
                className="px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                {isSaving ? 'Saving…' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
