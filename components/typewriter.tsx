'use client'

import { useEffect, useState } from 'react'

interface TypewriterProps {
    text: string
    speed?: number       // ms per character
    delay?: number       // ms before starting
    className?: string
    cursor?: boolean
}

export default function Typewriter({
    text,
    speed = 55,
    delay = 400,
    className = '',
    cursor = true,
}: TypewriterProps) {
    const [displayed, setDisplayed] = useState('')
    const [done, setDone] = useState(false)

    useEffect(() => {
        let i = 0
        const timeout = setTimeout(() => {
            const interval = setInterval(() => {
                setDisplayed(text.slice(0, i + 1))
                i++
                if (i >= text.length) {
                    clearInterval(interval)
                    setDone(true)
                }
            }, speed)
            return () => clearInterval(interval)
        }, delay)
        return () => clearTimeout(timeout)
    }, [text, speed, delay])

    return (
        <span className={className}>
            {displayed}
            {cursor && (
                <span
                    className={`inline-block w-0.5 h-[1em] bg-current ml-0.5 align-middle ${done ? 'animate-pulse' : 'opacity-100'
                        }`}
                />
            )}
        </span>
    )
}
