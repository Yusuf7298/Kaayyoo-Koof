import { NextRequest, NextResponse } from 'next/server'
import { DatabaseOperations } from '@/lib/db/operations'

// GET /api/testimonials
// Return list of featured testimonials
export async function GET(request: NextRequest) {
  try {
    const testimonials = await DatabaseOperations.getFeaturedTestimonials()

    return NextResponse.json(
      {
        success: true,
        data: testimonials,
        count: testimonials.length,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[v0] Error in GET /api/testimonials:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch testimonials',
      },
      { status: 500 }
    )
  }
}
