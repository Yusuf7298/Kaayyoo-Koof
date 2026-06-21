import { NextRequest, NextResponse } from 'next/server'
import { DatabaseOperations } from '@/lib/db/operations'

// GET /api/services
// Return list of all active services
export async function GET(request: NextRequest) {
  try {
    const services = await DatabaseOperations.getAllServices()

    return NextResponse.json(
      {
        success: true,
        data: services,
        count: services.length,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[v0] Error in GET /api/services:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch services',
      },
      { status: 500 }
    )
  }
}
