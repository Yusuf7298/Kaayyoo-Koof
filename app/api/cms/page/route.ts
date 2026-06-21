import { NextRequest, NextResponse } from 'next/server'
import { DatabaseOperations } from '@/lib/db/operations'

// GET /api/cms/page?pageType=home
// Return page blocks for a specific page
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const pageType = searchParams.get('pageType') || 'home'

    const blocks = await DatabaseOperations.getPageBlocks(pageType)

    return NextResponse.json(
      {
        success: true,
        data: blocks,
        count: blocks.length,
        pageType,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[v0] Error in GET /api/cms/page:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch page blocks',
      },
      { status: 500 }
    )
  }
}
