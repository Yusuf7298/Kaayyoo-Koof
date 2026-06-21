'use client'

import Link from 'next/link'

const SOCIAL = [
  {
    name: 'Facebook',
    href: 'https://www.facebook.com/kaayyoo_koof',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
        <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
      </svg>
    ),
    color: 'hover:bg-[#1877F2] hover:border-[#1877F2]',
  },
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/kaayyoo741?igsh=bGJ1MzIydzdjMXB4',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
      </svg>
    ),
    color: 'hover:bg-[#E1306C] hover:border-[#E1306C]',
  },
  {
    name: 'YouTube',
    href: 'https://youtube.com/@kaayyookoof',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
    color: 'hover:bg-[#FF0000] hover:border-[#FF0000]',
  },
  {
    name: 'TikTok',
    href: 'http://tiktok.com/@kaayyoo_kof',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
      </svg>
    ),
    color: 'hover:bg-[#000000] hover:border-[#000000]',
  },
  {
    name: 'Telegram',
    href: 'https://t.me/kaayyoo_koof',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
    ),
    color: 'hover:bg-[#229ED9] hover:border-[#229ED9]',
  },
]

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="animate-fade-in-up">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-foreground font-bold text-lg">
                K
              </div>
              <div>
                <div className="font-bold text-lg">Kayyoo</div>
                <div className="text-xs opacity-75 -mt-1">Koof</div>
              </div>
            </div>
            <p className="text-sm opacity-75 leading-relaxed">
              Building stronger communities through collaboration, support, and shared values.
            </p>
          </div>

          <div className="animate-fade-in-up stagger-1">
            <h3 className="font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-primary transition">Home</Link></li>
              <li><Link href="/#about" className="hover:text-primary transition">About Us</Link></li>
              <li><Link href="/#services" className="hover:text-primary transition">Services</Link></li>
              <li><Link href="/#events" className="hover:text-primary transition">Events</Link></li>
              <li><Link href="/announcements" className="hover:text-primary transition">Announcements</Link></li>
            </ul>
          </div>

          <div className="animate-fade-in-up stagger-2">
            <h3 className="font-bold mb-4">Community</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/member" className="hover:text-primary transition">Member Dashboard</Link></li>
              <li><Link href="/#membership" className="hover:text-primary transition">Join Us</Link></li>
              <li><Link href="/#contact" className="hover:text-primary transition">Contact</Link></li>
              <li><a href="#" className="hover:text-primary transition">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition">Terms of Service</a></li>
            </ul>
          </div>

          <div className="animate-fade-in-up stagger-3">
            <h3 className="font-bold mb-4">Contact Us</h3>
            <div className="space-y-3 text-sm">
              <p>
                <span className="opacity-75">Email:</span><br />
                <a href="mailto:info@kaayyookoof.org" className="hover:text-primary transition">
                  info@kaayyookoof.org
                </a>
              </p>
              <p>
                <span className="opacity-75">Telegram:</span><br />
                <a href="https://t.me/kaayyoo_koof" className="hover:text-primary transition">
                  Kaayyoo Koof
                </a>
              </p>

              <div className="pt-4 mt-4 border-t border-secondary-foreground/15">
                <p className="text-sm font-semibold uppercase tracking-wider opacity-75 mb-3">
                  Follow Us
                </p>
                <div className="flex flex-wrap gap-3">
                  {SOCIAL.map((s) => (
                    <a
                      key={s.name}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.name}
                      title={s.name}
                      className={`w-8 h-8 rounded-xl border border-secondary-foreground/20 bg-secondary-foreground/5 text-secondary-foreground hover:text-white flex items-center justify-center transition-all duration-300 ${s.color}`}
                    >
                      {s.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border/30 my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-sm opacity-75">
          <p>&copy; {currentYear} Kayyoo Koof Association. All rights reserved.</p>
          <p>Made with care for our community</p>
          <p>
            Developed by{' '}
            <Link
              className="font-bold text-white hover:underline font-serif"
              href="https://yusuf-mohammed.vercel.app/"
            >
              Yusuf Mohammed
            </Link>
          </p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-primary transition">Privacy</a>
            <a href="#" className="hover:text-primary transition">Terms</a>
            <a href="https://maps.app.goo.gl/3bH6xDUXhJQDSRYN7" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition">Site Map</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
