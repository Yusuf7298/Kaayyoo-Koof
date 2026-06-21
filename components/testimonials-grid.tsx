'use client'

import Image from 'next/image'

interface Testimonial {
  id: number
  title: string
  message: string
  rating: number
  member_role: string
  member_image?: string
}

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-400">
      <div className="flex items-start gap-4">
        {testimonial.member_image && (
          <div className="relative w-16 h-16 flex-shrink-0">
            <Image
              src={testimonial.member_image}
              alt={testimonial.title}
              fill
              className="rounded-full object-cover"
            />
          </div>
        )}

        <div className="flex-1">
          <div className="flex gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={i < (testimonial.rating || 5) ? 'text-yellow-400' : 'text-gray-300'}
              >
                ⭐
              </span>
            ))}
          </div>

          <h3 className="font-bold text-gray-800">{testimonial.title}</h3>
          <p className="text-sm text-gray-500 mb-3">{testimonial.member_role}</p>
          <p className="text-gray-700 italic">"{testimonial.message}"</p>
        </div>
      </div>
    </div>
  )
}

interface TestimonialsGridProps {
  testimonials?: Testimonial[]
  isLoading?: boolean
  columns?: 1 | 2 | 3
}

export function TestimonialsGrid({
  testimonials = [],
  isLoading = false,
  columns = 2,
}: TestimonialsGridProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  }

  if (isLoading) {
    return (
      <div className={`grid ${gridCols[columns]} gap-6`}>
        {[1, 2].map((i) => (
          <div key={i} className="bg-gray-200 rounded-lg h-48 animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className={`grid ${gridCols[columns]} gap-6`}>
      {testimonials.map((testimonial) => (
        <TestimonialCard key={testimonial.id} testimonial={testimonial} />
      ))}
    </div>
  )
}
