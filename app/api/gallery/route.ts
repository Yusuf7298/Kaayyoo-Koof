import { NextRequest, NextResponse } from 'next/server'
import { DatabaseOperations } from '@/lib/db/operations'

// GET /api/gallery
// Return list of all public gallery albums
export async function GET(request: NextRequest) {
  try {
    const albums = await DatabaseOperations.getAllGalleryAlbums()

    return NextResponse.json(
      {
        success: true,
        data: albums,
        count: albums.length,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[v0] Error in GET /api/gallery:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch gallery albums',
      },
      { status: 500 }
    )
  }
}
