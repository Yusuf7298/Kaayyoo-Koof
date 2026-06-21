'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

interface Event {
  id: number
  title: string
  description: string
  event_date: string | Date
  start_time: string
  end_time: string
  location: string
  capacity: number
  registered_count: number
  event_image?: string
  category: string
  status: 'upcoming' | 'live' | 'completed' | 'cancelled'
  speakers?: string[]
}

export function EventCard({ event }: { event: Event }) {
  const eventDate = new Date(event.event_date)
  const isUpcoming = eventDate > new Date()
  const capacityPercent = (event.registered_count / event.capacity) * 100

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { bg: string; text: string; emoji: string }> = {
      upcoming: { bg: 'bg-blue-100', text: 'text-blue-800', emoji: '📅' },
      live: { bg: 'bg-green-100', text: 'text-green-800', emoji: '🔴' },
      completed: { bg: 'bg-gray-100', text: 'text-gray-800', emoji: '✅' },
      cancelled: { bg: 'bg-red-100', text: 'text-red-800', emoji: '❌' },
    }
    const badge = badges[status]
    return (
      <span className={`text-xs font-bold px-3 py-1 rounded-full ${badge.bg} ${badge.text}`}>
        {badge.emoji} {status.toUpperCase()}
      </span>
    )
  }

  return (
    <Link href={`/events/${event.id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
        {event.event_image && (
          <div className="relative h-40 w-full">
            <Image
              src={event.event_image}
              alt={event.title}
              fill
              className="object-cover"
            />
            <div className="absolute top-2 right-2">{getStatusBadge(event.status)}</div>
          </div>
        )}

        <div className="p-4">
          <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
            {event.title}
          </h3>

          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {event.description}
          </p>

          <div className="space-y-2 text-sm text-gray-600 mb-4">
            <div className="flex items-center gap-2">
              <span>📅</span>
              <span>
                {eventDate.toLocaleDateString()} at {event.start_time}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span>📍</span>
              <span>{event.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>👥</span>
              <span>
                {event.registered_count} / {event.capacity} registered
              </span>
            </div>
          </div>

          {/* Capacity Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-xs mb-1">
              <span className="font-semibold">Capacity</span>
              <span>{Math.round(capacityPercent)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all ${capacityPercent > 80 ? 'bg-red-500' : 'bg-yellow-400'}`}
                style={{ width: `${Math.min(capacityPercent, 100)}%` }}
              />
            </div>
          </div>

          <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded transition-colors">
            View Details
          </button>
        </div>
      </div>
    </Link>
  )
}

interface EventsGridProps {
  events?: Event[]
  isLoading?: boolean
  columns?: 1 | 2 | 3 | 4
}

export function EventsGrid({
  events = [],
  isLoading = false,
  columns = 3,
}: EventsGridProps) {
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
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  )
}

// Upcoming Events Carousel
interface EventsCarouselProps {
  events?: Event[]
  isLoading?: boolean
}

export function EventsCarousel({
  events = [],
  isLoading = false,
}: EventsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextEvent = () => {
    setCurrentIndex((i) => (i + 1) % (events.length || 1))
  }

  const prevEvent = () => {
    setCurrentIndex((i) => (i - 1 + (events.length || 1)) % (events.length || 1))
  }

  if (isLoading || events.length === 0) {
    return (
      <div className="bg-gray-200 rounded-lg h-96 animate-pulse" />
    )
  }

  const event = events[currentIndex]

  return (
    <div className="relative bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Large featured image */}
      {event.event_image && (
        <div className="relative h-64 w-full">
          <Image
            src={event.event_image}
            alt={event.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      {/* Content overlay */}
      <div className="p-6">
        <div className="mb-2">{/* Status badge */}</div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          {event.title}
        </h2>
        <p className="text-gray-600 mb-4">{event.description}</p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm text-gray-500">Date & Time</p>
            <p className="font-semibold text-gray-800">
              {new Date(event.event_date).toLocaleDateString()} at{' '}
              {event.start_time}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Location</p>
            <p className="font-semibold text-gray-800">{event.location}</p>
          </div>
        </div>

        <Link href={`/events/${event.id}`}>
          <button className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold py-3 px-4 rounded transition-colors mb-4">
            Register Now
          </button>
        </Link>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={prevEvent}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded transition-colors"
          >
            ← Previous
          </button>
          <span className="text-gray-600">
            {currentIndex + 1} / {events.length}
          </span>
          <button
            onClick={nextEvent}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded transition-colors"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  )
}
