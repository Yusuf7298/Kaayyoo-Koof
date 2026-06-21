'use client'

import React, { useState } from 'react'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'

// ─── Edit your links in .env.local ───────────────────────────────────────────
const SOCIAL = [
  {
    name: 'Facebook',
    href: "https://www.facebook.com/kaayyoo_koof",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
        <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
      </svg>
    ),
    color: 'hover:bg-[#1877F2] hover:border-[#1877F2]',
  },
  {
    name: 'Instagram',
    href: "https://www.instagram.com/kaayyoo741?igsh=bGJ1MzIydzdjMXB4",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
      </svg>
    ),
    color: 'hover:bg-[#E1306C] hover:border-[#E1306C]',
  },
  {
    name: 'YouTube',
    href: "https://youtube.com/@kaayyookoof",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
    color: 'hover:bg-[#FF0000] hover:border-[#FF0000]',
  },
  {
    name: 'TikTok',
    href: "http://tiktok.com/@kaayyoo_kof",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
      </svg>
    ),
    color: 'hover:bg-[#000000] hover:border-[#000000]',
  },
  {
    name: 'Telegram',
    href: "https://t.me/kaayyoo_koof",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
    ),
    color: 'hover:bg-[#229ED9] hover:border-[#229ED9]',
  }
]

const CONTACT_INFO = [
  {
    icon: <MapPin size={18} />,
    label: 'Address',
    value: process.env.NEXT_PUBLIC_CONTACT_ADDRESS ?? 'Community Center, Main Street, Your City',
    href: 'https://maps.app.goo.gl/3bH6xDUXhJQDSRYN7',
  },
  {
    icon: <Phone size={18} />,
    label: 'Phone',
    value: process.env.NEXT_PUBLIC_CONTACT_PHONE ?? '+234 (0) XXX XXXX XXX',
    href: `tel:${process.env.NEXT_PUBLIC_CONTACT_PHONE ?? ''}`,
  },
  {
    icon: <Mail size={18} />,
    label: 'Email',
    value: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? 'info@kaayyookoof.org',
    href: `mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? 'info@kaayyookoof.org'}`,
  },
]

export default function ContactSection() {
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
    setForm({ name: '', email: '', message: '' })
    setTimeout(() => setSent(false), 4000)
  }

  return (
    <section className="py-24 bg-background">
      <div className="max-w-6xl mx-auto px-4">

        {/* Heading */}
        <div className="text-center mb-16 animate-fade-in-up">
          <span className="inline-block bg-primary/10 text-primary text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            Contact Us
          </span>
          <h2 className="text-4xl font-bold text-foreground mb-4">Get In Touch</h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Have a question or want to learn more? We&apos;re always happy to hear from you.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">

          {/* ── Left column ──────────────────────────────────── */}
          <div className="space-y-5 animate-slide-in-left">

            {/* Contact info cards */}
            {CONTACT_INFO.map((item) => {
              const inner = (
                <div className="flex items-start gap-4 p-5 rounded-xl border border-border bg-muted/40 hover:border-primary/40 hover:bg-primary/5 transition-all duration-300 w-full text-left">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                      {item.label}
                    </p>
                    <p className="text-foreground font-medium">{item.value}</p>
                  </div>
                </div>
              )
              return item.href ? (
                <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer">{inner}</a>
              ) : (
                <div key={item.label}>{inner}</div>
              )
            })}

            {/* Office hours */}
            <div className="flex items-start gap-4 p-5 rounded-xl border border-border bg-muted/40">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <Clock size={18} />
              </div>
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Office Hours
                </p>
                <div className="space-y-1 text-sm text-foreground">
                  <p><span className="font-semibold">Mon – Fri:</span> 9:00 AM – 6:00 PM</p>
                  <p><span className="font-semibold">Saturday:</span> 10:00 AM – 4:00 PM</p>
                  <p><span className="font-semibold">Sunday:</span> Closed</p>
                </div>
              </div>
            </div>

            {/* Social media icons */}
            <div>
              <p className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
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
                    className={`w-11 h-11 rounded-xl border border-border bg-muted/40 text-foreground hover:text-white flex items-center justify-center transition-all duration-300 ${s.color}`}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right column — form ───────────────────────────── */}
          <div className="animate-slide-in-right">
            <form
              onSubmit={handleSubmit}
              className="bg-muted/30 border border-border rounded-2xl p-8 space-y-5"
            >
              <h3 className="text-xl font-bold text-foreground mb-2">Send a Message</h3>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Your Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Abebe Bikila"
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Email Address</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Message</label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="How can we help you?"
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-bold hover:bg-primary/90 hover:scale-[1.01] transform transition-all duration-200 shadow-md shadow-primary/20"
              >
                Send Message →
              </button>

              {sent && (
                <p className="text-center text-sm text-green-600 font-medium animate-fade-in">
                  ✓ Message sent! We&apos;ll get back to you soon.
                </p>
              )}
            </form>
          </div>

        </div>
      </div>
    </section>
  )
}
