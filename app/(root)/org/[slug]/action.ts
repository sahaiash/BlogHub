'use server';

import { CreateBlogType, blogTable } from "@/db/schema";
import { db } from "@/db";
export const createBlog = async (payload:CreateBlogType)=>{
    const [result] = await db.insert(blogTable).values(payload).returning({id:blogTable.id});  //destructuring the result to get the first value
    return result.id;
};
