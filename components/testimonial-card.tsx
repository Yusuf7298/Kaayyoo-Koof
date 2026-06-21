'use client'

import Image from 'next/image'
import { Star } from 'lucide-react'

interface TestimonialCardProps {
  name: string
  role: string
  quote: string
  image?: string
  delay?: number
}

export function TestimonialCard({ name, role, quote, image, delay = 0 }: TestimonialCardProps) {
  return (
    <div
      className="bg-white rounded-lg p-6 shadow-md border border-border animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center gap-4 mb-5">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-muted ring-2 ring-primary/20">
          <Image
            src={image ?? '/placeholder-user.jpg'}
            alt={name}
            fill
            sizes="64px"
            className="object-cover"
          />
        </div>
        <div>
          <p className="font-semibold text-foreground">{name}</p>
          <p className="text-sm text-muted-foreground">{role}</p>
        </div>
      </div>

      <div className="flex gap-1 mb-4" aria-label="5 out of 5 rating">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={16} className="fill-primary text-primary" />
        ))}
      </div>

      <p className="text-foreground mb-4 leading-relaxed italic">"{quote}"</p>
    </div>
  )
}
