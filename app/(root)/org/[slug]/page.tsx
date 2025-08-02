"use client"
import Nav from "@/app/components/nav";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import *  as React from "react";
import { createBlog } from "./action";
import { useOrganization } from "@clerk/nextjs";

export default function OrgLandingPage(){
    const [blogContent, setBlogContent] = React.useState('');
    const [blogTitle, setBlogTitle] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);
    const [isSuccess, setIsSuccess] = React.useState(false);

    const selectedOrg=useOrganization();
    console.log({selectedOrg})
    
    const handleCreateBlog = async() => {
        if(!selectedOrg.organization?.id) return;
        
        setIsLoading(true);
        setIsSuccess(false);
        
        try {
            await createBlog({
                body:blogContent.trim(),
                orgId:selectedOrg.organization?.id,
                title:blogTitle,
            });
            setIsSuccess(true);
            // Reset form after successful creation
            setBlogContent('');
            setBlogTitle('');
        } catch (error) {
            console.error('Error creating blog:', error);
        } finally {
            setIsLoading(false);
        }
    }
    return(
        <main>
            <Nav/>
            <h1>Inside Org Page</h1>
            <div className="p-10">   
            <Input
            placeholder="Enter your blog title here"
            value={blogTitle}
            onChange={(e) => setBlogTitle(e.target.value)}
            />
            <div className="relative mt-2">
                <Textarea 
                placeholder="Enter your blog content here"
                value={blogContent}
                onChange={(e) => setBlogContent(e.target.value)}
                className="pr-10"
                />
                {isLoading && (
                    <div className="absolute right-3 top-3">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                    </div>
                )}
                {isSuccess && !isLoading && (
                    <div className="absolute right-3 top-3">
                        <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                )}
            </div>
            <Button 
                onClick={handleCreateBlog} 
                className="mt-2"
                disabled={isLoading}
            >
                {isLoading ? 'Creating...' : 'Create Blog'}
            </Button>
            </div>
        </main>
    );
}
