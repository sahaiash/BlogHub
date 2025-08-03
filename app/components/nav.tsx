'use client'
import { UserButton, OrganizationSwitcher } from "@clerk/nextjs";
import { useOrganization } from "@clerk/nextjs";
import Link from "next/link";
import * as React from "react";

const Nav: React.FC = () => {
    const { organization } = useOrganization();

    return (
        <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center space-x-4">
                        <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </div>
                            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                BlogHub
                            </h1>
                        </Link>
                        {organization && (
                            <>
                                <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
                                    <span>•</span>
                                    <span className="font-medium text-gray-900">{organization.name}</span>
                                </div>
                                <div className="hidden md:flex items-center space-x-1">
                                    <Link 
                                        href={`/org/${organization.slug}`}
                                        className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        Create Post
                                    </Link>
                                    <Link 
                                        href={`/org/${organization.slug}/blogs`}
                                        className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        View Posts
                                    </Link>
                                </div>
                            </>
                        )}
                    </div>
                    
                    <div className="flex items-center space-x-4">
                        <div className="hidden sm:block">
                            <OrganizationSwitcher 
                                afterSelectOrganizationUrl="/org/:slug"
                                appearance={{
                                    elements: {
                                        organizationSwitcherTrigger: "bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                                    }
                                }}
                            />
                        </div>
                        <UserButton 
                            appearance={{
                                elements: {
                                    userButtonAvatarBox: "w-8 h-8"
                                }
                            }}
                        />
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Nav;