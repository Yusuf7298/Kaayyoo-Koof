import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.BETTER_AUTH_URL ?? 'http://localhost:3000'
  ),
  title: 'Kaayyoo Koof',
  description: 'Empowering youth through leadership, education, entrepreneurship, and community engagement to create positive change and sustainable development.',
  icons: {
    icon: [
      {
        url: '/logo.png',
        type: 'image/png',
        sizes: 'any',
      },
    ],
    apple: '/logo.png',
    shortcut: '/logo.png',
  },
  openGraph: {
    title: 'Kaayyoo Koof',
    description: 'Empowering youth through leadership, education, entrepreneurship, and community engagement.',
    images: [{ url: '/logo.png', width: 1024, height: 1024, alt: 'Kaayyoo Koof Logo' }],
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#F5C400',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
