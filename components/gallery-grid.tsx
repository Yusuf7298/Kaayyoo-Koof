'use client'

import { useState } from 'react'
import Image from 'next/image'
import { X } from 'lucide-react'

interface GalleryItem {
  id: number
  src: string
  alt: string
  title?: string
}

interface GalleryGridProps {
  items: GalleryItem[]
}

export function GalleryGrid({ items }: GalleryGridProps) {
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const selected = items.find((item) => item.id === selectedId)

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item, index) => (
          <div
            key={`gallery-${index}`}
            onClick={() => setSelectedId(item.id)}
            className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group hover-scale animate-fade-in-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <Image
              src={item.src}
              alt={item.alt}
              fill
              className="object-cover group-hover:scale-110 transition duration-300"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition flex items-center justify-center">
              <div className="text-white opacity-0 group-hover:opacity-100 transition">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7"
                  />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 animate-fade-in"
          onClick={() => setSelectedId(null)}
        >
          <div className="relative max-w-2xl w-full animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setSelectedId(null)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 transition"
              aria-label="Close"
            >
              <X size={32} />
            </button>
            <Image
              src={selected.src}
              alt={selected.alt}
              width={800}
              height={600}
              className="rounded-lg w-full h-auto"
            />
            {selected.title && (
              <p className="text-white text-center mt-4 text-lg">{selected.title}</p>
            )}
          </div>
        </div>
      )}
    </>
  )
}
