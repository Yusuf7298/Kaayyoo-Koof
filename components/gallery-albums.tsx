'use client'

import Image from 'next/image'
import Link from 'next/link'

interface GalleryAlbum {
  id: number
  name: string
  description?: string
  category: string
  cover_image?: string
  created_at: string | Date
}

export function GalleryAlbumCard({ album }: { album: GalleryAlbum }) {
  return (
    <Link href={`/gallery/${album.id}`}>
      <div className="relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer h-56">
        {album.cover_image ? (
          <Image
            src={album.cover_image}
            alt={album.name}
            fill
            className="object-cover hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-yellow-300 to-yellow-500 flex items-center justify-center">
            <span className="text-5xl">📸</span>
          </div>
        )}

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity flex flex-col justify-end p-4 text-white">
          <h3 className="text-lg font-bold mb-1">{album.name}</h3>
          <p className="text-sm">{album.category}</p>
        </div>
      </div>
    </Link>
  )
}

interface GalleryAlbumsGridProps {
  albums?: GalleryAlbum[]
  isLoading?: boolean
  columns?: 2 | 3 | 4
}

export function GalleryAlbumsGrid({
  albums = [],
  isLoading = false,
  columns = 3,
}: GalleryAlbumsGridProps) {
  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }

  if (isLoading) {
    return (
      <div className={`grid ${gridCols[columns]} gap-6`}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-gray-200 rounded-lg h-56 animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className={`grid ${gridCols[columns]} gap-6`}>
      {albums.map((album) => (
        <GalleryAlbumCard key={album.id} album={album} />
      ))}
    </div>
  )
}
