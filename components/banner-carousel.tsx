'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface BannerSlide {
  id: number
  title: string
  subtitle: string
  image: string
  tag: string
  color: string
}

export function BannerCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlay, setIsAutoPlay] = useState(true)

  const slides: BannerSlide[] = [
    {
      id: 1,
      title: 'Join Our Volunteers',
      subtitle: 'Make a real impact in your community',
      image: 'banners/ban1.jpg',
      tag: 'VOLUNTEERS',
      color: 'from-yellow-600 to-yellow-400',
    },
    {
      id: 2,
      title: 'Community Celebrations',
      subtitle: 'Celebrate milestones together',
      image: 'banners/ban2.jpg',
      tag: 'CELEBRATIONS',
      color: 'from-amber-600 to-amber-400',
    },
    {
      id: 3,
      title: 'Together We Thrive',
      subtitle: 'Building a stronger community',
      image: 'banners/ban3.jpg',
      tag: 'COMMUNITY',
      color: 'from-orange-600 to-orange-400',
    },
    {
      id: 4,
      title: 'Youth Leadership',
      subtitle: 'Empowering the next generation',
      image: 'banners/ban4.jpg',
      tag: 'LEADERSHIP',
      color: 'from-orange-600 to-orange-400',
    },
    {
      id: 5,
      title: 'Making an Impact',
      subtitle: 'Every action counts',
      image: 'banners/ban5.jpg',
      tag: 'IMPACT',
      color: 'from-orange-600 to-orange-400',
    },
  ]

  useEffect(() => {
    if (!isAutoPlay) return

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [isAutoPlay, slides.length])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    setIsAutoPlay(false)
  }

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length)
    setIsAutoPlay(false)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length)
    setIsAutoPlay(false)
  }

  const slide = slides[currentIndex]

  return (
    <div
      className="relative w-full h-96 md:h-[450px] overflow-hidden rounded-xl shadow-xl"
      onMouseEnter={() => setIsAutoPlay(false)}
      onMouseLeave={() => setIsAutoPlay(true)}
    >
      {/* Banner Image and Overlay */}
      {slides.map((s, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${idx === currentIndex ? 'opacity-100' : 'opacity-0'
            }`}
        >
          <Image
            src={s.image}
            alt={s.title}
            fill
            className="object-cover"
            priority={idx === 0}
          />
          {/* Dark overlay gradient */}
          <div className={`absolute inset-0 bg-gradient-to-r ${s.color} opacity-40`}></div>
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center items-start px-6 md:px-12">
        <div className="animate-fade-in-up">
          <div className="inline-block bg-white/20 backdrop-blur-md px-4 py-2 rounded-full mb-4">
            <span className="text-white text-sm font-bold tracking-widest">{slide.tag}</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-3 text-balance">
            {slide.title}
          </h2>
          <p className="text-lg md:text-xl text-white/90 max-w-md">{slide.subtitle}</p>
        </div>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 backdrop-blur-md p-2 rounded-full transition-all duration-300 text-white"
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 backdrop-blur-md p-2 rounded-full transition-all duration-300 text-white"
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </button>

      {/* Dot Navigation */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goToSlide(idx)}
            className={`transition-all duration-300 rounded-full ${idx === currentIndex
              ? 'bg-white w-8 h-3'
              : 'bg-white/50 hover:bg-white/75 w-3 h-3'
              }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
