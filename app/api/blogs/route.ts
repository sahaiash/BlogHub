import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { countBlogsByOrg, getBlogsByOrg } from '@/db/queries/blogs';
import { parsePagination, totalPages } from '@/lib/pagination';

const DEFAULT_LIMIT = 9;
const MAX_LIMIT = 50;

export async function GET(request: NextRequest) {
  try {
    // Tenant is derived from the authenticated Clerk session — never from the
    // client. `orgId` is the caller's *active* organization and cannot be forged.
    const { userId, orgId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!orgId) {
      return NextResponse.json(
        { error: 'No active organization selected' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const { page, limit, offset } = parsePagination(
      { page: searchParams.get('page'), limit: searchParams.get('limit') },
      { defaultLimit: DEFAULT_LIMIT, maxLimit: MAX_LIMIT }
    );

    const [items, total] = await Promise.all([
      getBlogsByOrg(orgId, { limit, offset }),
      countBlogsByOrg(orgId),
    ]);

    return NextResponse.json({
      items,
      total,
      page,
      limit,
      totalPages: totalPages(total, limit),
    });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blogs' },
      { status: 500 }
    );
  }
}
