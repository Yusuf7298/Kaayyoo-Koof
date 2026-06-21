'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Calendar, Clock, MapPin, Users, ArrowRight } from 'lucide-react'

export interface EventCardProps {
  id: number
  title: string
  description: string
  image: string
  date: string | Date
  time: string
  location: string
  maxAttendees: number
  currentAttendees?: number
  tag?: string
  delay?: number
}

export function EventCard({
  id,
  title,
  description,
  image,
  date,
  time,
  location,
  maxAttendees,
  currentAttendees = 0,
  tag,
  delay = 0,
}: EventCardProps) {
  // Handle plain strings like "Ongoing", "Coming Soon", "Weekly Sunday Night"
  const isStringDate = typeof date === 'string' && isNaN(Date.parse(date))
  const eventDate = isStringDate ? null : new Date(date)
  const day = eventDate
    ? eventDate.toLocaleDateString('en-US', { weekday: 'long' })
    : (date as string)
  const formattedDate = eventDate
    ? eventDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : (date as string)
  const spotsLeft = maxAttendees - currentAttendees
  const fillPct = Math.min((currentAttendees / maxAttendees) * 100, 100)
  const almostFull = spotsLeft <= maxAttendees * 0.2

  return (
    <div
      className="group flex flex-col bg-card rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden bg-muted">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Tag */}
        {tag && (
          <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            {tag}
          </span>
        )}

        {/* Day pill on image bottom */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/50 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-full">
          <Calendar size={12} />
          {day}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-5">
        <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-1">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
          {description}
        </p>

        {/* Meta row */}
        <div className="space-y-2 mb-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
              <Calendar size={13} />
            </div>
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
              <Clock size={13} />
            </div>
            <span>{time}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
              <MapPin size={13} />
            </div>
            <span className="line-clamp-1">{location}</span>
          </div>
        </div>

        {/* Participants bar */}
        <div className="mb-5">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Users size={12} />
              <span>{currentAttendees} / {maxAttendees} participants</span>
            </div>
            {almostFull ? (
              <span className="text-orange-500 font-semibold">Almost full!</span>
            ) : (
              <span className="text-muted-foreground">{spotsLeft} spots left</span>
            )}
          </div>
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${almostFull ? 'bg-orange-400' : 'bg-primary'
                }`}
              style={{ width: `${fillPct}%` }}
            />
          </div>
        </div>

        {/* CTA */}
        <div className="mt-auto">
          <Link
            href={`/events/${id}`}
            className="inline-flex items-center gap-2 w-full justify-center py-2.5 rounded-xl bg-primary/10 text-primary font-semibold text-sm hover:bg-primary hover:text-primary-foreground transition-all duration-200"
          >
            View Details
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  )
}
