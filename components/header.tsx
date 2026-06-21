'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

const TELEGRAM_BOT = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || 'KaayyooKoof_bot'

interface HeaderProps {
  isLoggedIn: boolean
}

export default function Header({ isLoggedIn }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b border-border">
      <nav className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo and Brand */}
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-foreground font-bold text-lg">
            K
          </div>
          <div>
            <div className="font-bold text-foreground text-lg">Kayyoo</div>
            <div className="text-xs text-muted-foreground -mt-1">Koof</div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-8 items-center">
          <Link href="/#about" className="text-foreground hover:text-primary transition font-medium">
            About
          </Link>
          <Link href="/#services" className="text-foreground hover:text-primary transition font-medium">
            Services
          </Link>
          <Link href="/#events" className="text-foreground hover:text-primary transition font-medium">
            Events
          </Link>
          <Link href="/announcements" className="text-foreground hover:text-primary transition font-medium">
            News
          </Link>
          <Link href="/#contact" className="text-foreground hover:text-primary transition font-medium">
            Contact
          </Link>
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex gap-4 items-center">
          {isLoggedIn ? (
            <Link href="/member" className="px-6 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition font-semibold">
              Dashboard
            </Link>
          ) : (
            <>
              <Link href={`https://t.me/${TELEGRAM_BOT}`} className="px-6 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition font-semibold">
                Join Now
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-foreground text-2xl"
          aria-label="Toggle menu"
        >
          ☰
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border">
          <div className="max-w-6xl mx-auto px-4 py-4 space-y-4">
            <Link href="/#about" className="block text-foreground hover:text-primary transition font-medium">
              About
            </Link>
            <Link href="/#services" className="block text-foreground hover:text-primary transition font-medium">
              Services
            </Link>
            <Link href="/#events" className="block text-foreground hover:text-primary transition font-medium">
              Events
            </Link>
            <Link href="/announcements" className="block text-foreground hover:text-primary transition font-medium">
              News
            </Link>
            <Link href="/#contact" className="block text-foreground hover:text-primary transition font-medium">
              Contact
            </Link>
            <div className="pt-4 border-t border-border space-y-3">
              {isLoggedIn ? (
                <Link href="/member" className="block px-4 py-2 rounded-lg bg-primary text-primary-foreground text-center font-semibold">
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link href="/sign-in" className="block px-4 py-2 rounded-lg border border-primary text-primary text-center font-semibold">
                    Sign In
                  </Link>
                  <Link href="/sign-up" className="block px-4 py-2 rounded-lg bg-primary text-primary-foreground text-center font-semibold">
                    Join Now
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
