'use client'

import { useState } from 'react'
import Link from 'next/link'
import { X } from 'lucide-react'

interface RegisterModalProps {
  isOpen: boolean
  onClose: () => void
}

export function RegisterModal({ isOpen, onClose }: RegisterModalProps) {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      onClose()
      setEmail('')
      setSubmitted(false)
    }, 2000)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full animate-scale-in">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-2xl font-bold text-foreground">Join Us</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          {submitted ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">✓</div>
              <p className="text-foreground font-semibold mb-2">Welcome to Kayyoo Koof!</p>
              <p className="text-muted-foreground text-sm">
                Check your email for next steps
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-4 mb-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Register on Website</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Create an account to access the member portal and manage your contributions
                  </p>
                  <Link
                    href="/sign-up"
                    className="inline-block w-full text-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-semibold"
                  >
                    Sign Up Now
                  </Link>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-muted-foreground">or</span>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-2">Join via Telegram</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Quick registration through our Telegram bot
                  </p>
                  <a
                    href="https://t.me/kayyoo_koof_bot"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block w-full text-center px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition font-semibold"
                  >
                    Open Telegram
                  </a>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
