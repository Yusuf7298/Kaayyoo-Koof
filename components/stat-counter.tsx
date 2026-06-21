'use client'

import { useEffect, useState } from 'react'

interface StatCounterProps {
  label: string
  targetValue: number
  prefix?: string
  suffix?: string
  divideBy?: number
  delay?: number
}

export function StatCounter({ 
  label, 
  targetValue, 
  prefix = '',
  suffix = '', 
  divideBy = 1,
  delay = 0 
}: StatCounterProps) {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [ref, setRef] = useState<HTMLDivElement | null>(null)

  // Calculate the display value
  const displayValue = targetValue / divideBy

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (ref) {
      observer.observe(ref)
    }

    return () => {
      if (ref) observer.unobserve(ref)
    }
  }, [ref, isVisible])

  useEffect(() => {
    if (!isVisible) return

    setTimeout(() => {
      const duration = 2000
      const steps = 60
      const increment = displayValue / steps
      let current = 0

      const timer = setInterval(() => {
        current += increment
        if (current >= displayValue) {
          setCount(displayValue)
          clearInterval(timer)
        } else {
          setCount(Math.floor(current))
        }
      }, duration / steps)

      return () => clearInterval(timer)
    }, delay)
  }, [isVisible, displayValue, delay])

  return (
    <div
      ref={setRef}
      className="text-center animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
        {prefix}
        {count.toLocaleString()}
        {suffix}
      </div>
      <p className="text-muted-foreground text-sm md:text-base">{label}</p>
    </div>
  )
}
