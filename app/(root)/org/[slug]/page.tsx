"use client"
import Nav from "@/app/components/nav";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import * as React from "react";
import { createBlog } from "./action";
import { useOrganization } from "@clerk/nextjs";
import Link from "next/link";

export default function OrgLandingPage() {
    const [blogContent, setBlogContent] = React.useState('');
    const [blogTitle, setBlogTitle] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);
    const [isSuccess, setIsSuccess] = React.useState(false);
    const [error, setError] = React.useState('');

    const selectedOrg = useOrganization();

    const handleCreateBlog = async () => {
        if (!selectedOrg.organization?.id) return;
        
        if (!blogTitle.trim() || !blogContent.trim()) {
            setError('Please fill in both title and content');
            return;
        }

        setIsLoading(true);
        setIsSuccess(false);
        setError('');
        
        try {
            await createBlog({
                body: blogContent.trim(),
                orgId: selectedOrg.organization?.id,
                title: blogTitle.trim(),
            });
            setIsSuccess(true);
            // Reset form after successful creation
            setBlogContent('');
            setBlogTitle('');
            
            // Show success message for 3 seconds
            setTimeout(() => setIsSuccess(false), 3000);
        } catch (error) {
            console.error('Error creating blog:', error);
            setError('Failed to create blog. Please try again.');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
            <Nav />
            
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Create New Blog Post
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Share your thoughts and insights with your organization. Your blog will be published to your organization&apos;s public page.
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <div className="flex items-center">
                                <svg className="h-5 w-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="text-red-800">{error}</span>
                            </div>
                        </div>
                    )}

                    {isSuccess && (
                        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                            <div className="flex items-center">
                                <svg className="h-5 w-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span className="text-green-800">Blog post created successfully!</span>
                            </div>
                        </div>
                    )}

                    <div className="space-y-6">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                                Blog Title
                            </label>
                            <Input
                                id="title"
                                placeholder="Enter a compelling title for your blog post..."
                                value={blogTitle}
                                onChange={(e) => setBlogTitle(e.target.value)}
                                className="text-lg"
                                maxLength={80}
                            />
                            <div className="mt-1 text-sm text-gray-500 text-right">
                                {blogTitle.length}/80 characters
                            </div>
                        </div>

                        <div>
                            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                                Blog Content
                            </label>
                            <div className="relative">
                                <Textarea 
                                    id="content"
                                    placeholder="Write your blog content here... Share your insights, experiences, or thoughts with your audience."
                                    value={blogContent}
                                    onChange={(e) => setBlogContent(e.target.value)}
                                    className="min-h-[300px] text-base leading-relaxed resize-none"
                                />
                                {isLoading && (
                                    <div className="absolute right-4 top-4">
                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                                    </div>
                                )}
                            </div>
                            <div className="mt-1 text-sm text-gray-500 text-right">
                                {blogContent.length} characters
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                            <div className="text-sm text-gray-600">
                                <span className="font-medium">Organization:</span> {selectedOrg.organization?.name}
                            </div>
                            <Button 
                                onClick={handleCreateBlog} 
                                disabled={isLoading || !blogTitle.trim() || !blogContent.trim()}
                                className="px-8 py-3 text-base font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                {isLoading ? (
                                    <div className="flex items-center">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Creating...
                                    </div>
                                ) : (
                                    <div className="flex items-center">
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                        Publish Blog Post
                                    </div>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>

                {selectedOrg.organization?.slug && (
                    <div className="mt-8 grid md:grid-cols-2 gap-6">
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Your Public Blog</h3>
                            <p className="text-gray-600 mb-4">
                                Your organization&apos;s public blog is available at:
                            </p>
                            <a 
                                href={`https://${selectedOrg.organization.slug}.localhost:3000`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                                View Public Blog
                            </a>
                        </div>
                        
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Manage Your Posts</h3>
                            <p className="text-gray-600 mb-4">
                                View and manage all your organization&apos;s blog posts:
                            </p>
                            <Link 
                                href={`/org/${selectedOrg.organization.slug}/blogs`}
                                className="inline-flex items-center px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg font-medium transition-colors"
                            >
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                </svg>
                                View All Posts
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
