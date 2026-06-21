'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function EventsClient({ 
  event, 
  isRegistered, 
  isLoggedIn,
  registerAction,
  cancelAction
}: {
  event: any
  isRegistered: boolean
  isLoggedIn: boolean
  registerAction: (eventId: number) => Promise<void>
  cancelAction: (eventId: number) => Promise<void>
}) {
  const [isLoading, setIsLoading] = useState(false)

  const handleRegister = async () => {
    setIsLoading(true)
    try {
      await registerAction(event.id)
    } catch (error) {
      console.error('Error registering for event:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = async () => {
    setIsLoading(true)
    try {
      await cancelAction(event.id)
    } catch (error) {
      console.error('Error canceling registration:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="border border-border rounded-lg p-6 hover:shadow-md transition flex flex-col">
      <h2 className="text-2xl font-bold text-foreground mb-2">{event.title}</h2>
      <p className="text-muted-foreground mb-4">{event.description}</p>
      
      <div className="space-y-2 mb-6 flex-grow">
        <div className="flex items-start gap-2">
          <span className="text-muted-foreground min-w-fit">📅 Date:</span>
          <span className="text-foreground">
            {new Date(event.event_date).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
        {event.location && (
          <div className="flex items-start gap-2">
            <span className="text-muted-foreground min-w-fit">📍 Location:</span>
            <span className="text-foreground">{event.location}</span>
          </div>
        )}
        {event.max_attendees && (
          <div className="flex items-start gap-2">
            <span className="text-muted-foreground min-w-fit">👥 Capacity:</span>
            <span className="text-foreground">{event.max_attendees} attendees</span>
          </div>
        )}
      </div>

      {isLoggedIn ? (
        <button
          onClick={() => isRegistered ? handleCancel() : handleRegister()}
          disabled={isLoading}
          className={`w-full px-4 py-2 rounded-lg transition font-semibold disabled:opacity-50 ${
            isRegistered
              ? 'bg-muted text-muted-foreground hover:bg-muted/80'
              : 'bg-primary text-primary-foreground hover:bg-primary/90'
          }`}
        >
          {isLoading 
            ? 'Processing...' 
            : isRegistered 
              ? 'Cancel Registration' 
              : 'Register'
          }
        </button>
      ) : (
        <Link
          href="/sign-up"
          className="w-full px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition font-semibold text-center"
        >
          Sign Up to Register
        </Link>
      )}
    </div>
  )
}
