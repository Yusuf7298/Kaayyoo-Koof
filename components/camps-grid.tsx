'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface Camp {
  id: number
  title: string
  description: string
  category: string
  start_date: string | Date
  end_date: string | Date
  location: string
  max_participants: number
  camp_image?: string
  status: string
  current_attendees?: number
}

export function CampCard({ camp }: { camp: Camp }) {
  const startDate = new Date(camp.start_date)
  const endDate = new Date(camp.end_date)

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      leadership: 'bg-blue-100 text-blue-800',
      skill: 'bg-green-100 text-green-800',
      mentoring: 'bg-purple-100 text-purple-800',
      community: 'bg-yellow-100 text-yellow-800',
    }
    return colors[category] || 'bg-gray-100 text-gray-800'
  }

  return (
    <Link href={`/camps/${camp.id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
        {camp.camp_image && (
          <div className="relative h-48 w-full">
            <Image
              src={camp.camp_image}
              alt={camp.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        <div className="p-4">
          <div className="flex gap-2 mb-2">
            <span
              className={`text-xs font-bold px-3 py-1 rounded-full ${getCategoryColor(camp.category)}`}
            >
              {camp.category}
            </span>
          </div>

          <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
            {camp.title}
          </h3>

          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {camp.description}
          </p>

          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span>📍</span>
              <span>{camp.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>📅</span>
              <span>
                {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span>👥</span>
              <span>
                {camp.current_attendees || 0} / {camp.max_participants}{' '}
                participants
              </span>
            </div>
          </div>

          <button className="w-full mt-4 bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded transition-colors">
            Learn More
          </button>
        </div>
      </div>
    </Link>
  )
}

interface CampsGridProps {
  camps?: Camp[]
  isLoading?: boolean
  columns?: 1 | 2 | 3 | 4
}

export function CampsGrid({
  camps = [],
  isLoading = false,
  columns = 3,
}: CampsGridProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }

  if (isLoading) {
    return (
      <div className={`grid ${gridCols[columns]} gap-6`}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-200 rounded-lg h-80 animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className={`grid ${gridCols[columns]} gap-6`}>
      {camps.map((camp) => (
        <CampCard key={camp.id} camp={camp} />
      ))}
    </div>
  )
}
