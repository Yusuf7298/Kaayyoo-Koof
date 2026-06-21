'use client'

import Link from 'next/link'
import Image from 'next/image'

interface Announcement {
  id: number
  title: string
  content: string
  announcement_image?: string
  is_pinned: boolean
  is_featured: boolean
  category_id?: number
  published_at: string | Date
  view_count: number
}

export function AnnouncementCard({ announcement }: { announcement: Announcement }) {
  const publishDate = new Date(announcement.published_at)

  return (
    <Link href={`/announcements/${announcement.id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
        {announcement.announcement_image && (
          <div className="relative h-40 w-full">
            <Image
              src={announcement.announcement_image}
              alt={announcement.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        <div className="p-4">
          {announcement.is_pinned && (
            <div className="inline-block bg-red-100 text-red-800 text-xs font-bold px-2 py-1 rounded mb-2">
              📌 Pinned
            </div>
          )}

          <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
            {announcement.title}
          </h3>

          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {announcement.content}
          </p>

          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{publishDate.toLocaleDateString()}</span>
            <span>👁️ {announcement.view_count}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

interface AnnouncementsGridProps {
  announcements?: Announcement[]
  isLoading?: boolean
  columns?: 1 | 2 | 3 | 4
}

export function AnnouncementsGrid({
  announcements = [],
  isLoading = false,
  columns = 3,
}: AnnouncementsGridProps) {
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
          <div key={i} className="bg-gray-200 rounded-lg h-64 animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className={`grid ${gridCols[columns]} gap-6`}>
      {announcements.map((announcement) => (
        <AnnouncementCard key={announcement.id} announcement={announcement} />
      ))}
    </div>
  )
}

// Featured announcement for sidebar/hero
export function FeaturedAnnouncement({
  announcement,
}: {
  announcement: Announcement
}) {
  const publishDate = new Date(announcement.published_at)

  return (
    <Link href={`/announcements/${announcement.id}`}>
      <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-2 border-yellow-400 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer">
        {announcement.is_pinned && <div className="text-2xl mb-2">📌</div>}

        <h3 className="text-xl font-bold text-gray-800 mb-2">
          {announcement.title}
        </h3>

        <p className="text-gray-700 mb-4 line-clamp-3">
          {announcement.content}
        </p>

        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>{publishDate.toLocaleDateString()}</span>
          <span className="text-yellow-600 font-bold">Read More →</span>
        </div>
      </div>
    </Link>
  )
}
