import { blogTable } from '@/db/schema';
import { clerkClient } from '@clerk/nextjs/server';
import { db } from '@/db';
import { eq } from 'drizzle-orm';

interface Params{
      subdomain:string
} 
export default async function({params}:{params:Promise<{subdomain:string}>}) {
    const {subdomain} = await params;
    const client=await clerkClient()
    const org=await client.organizations.getOrganization({slug:subdomain})
    const orgId=org.id
    db.select().from(blogTable).where(eq(blogTable.orgId,orgId))
    console.log({params})
    return <div>
        {blogs.map(blog=> <div>
            <h3>{blog.title}</h3>
            <p>{blog.body}</p>
        </div>)}
    </div>
}

