import Link from 'next/link'
import { headers } from 'next/headers'
import { GalleryGrid } from '@/components/gallery-grid'
import { StatCounter } from '@/components/stat-counter'
import HomeClient from '@/components/home-client'
import Header from '@/components/header'
import Footer from '@/components/footer'
import ServicesSection from '@/components/services-section'
import AchievementsSection from '@/components/achievements-section'
import ImpactSection from '@/components/impact-section'
import MembershipSection from '@/components/membership-section'
import ContactSection from '@/components/contact-section'
import { BannerCarousel } from '@/components/banner-carousel'
import WhatMembersSay from '@/components/what-members-say'
import { UpcomingEventsSection } from '@/components/upcoming-events'
import Typewriter from '@/components/typewriter'
import { fallbackEvents } from '@/lib/events'

export const dynamic = 'force-dynamic'

const upcomingEvents = [
  {
    id: 1,
    title: 'Summer Camp 2026',
    description:
      'An immersive multi-day outdoor camp designed to build resilience, teamwork, and leadership in young community members through hands-on activities, workshops, and nature challenges.',
    image: '/comm/kayy1.jpg',
    date: new Date('2026-07-08'),
    time: '8:00 AM – 5:00 PM',
    location: 'Forest Retreat Center, Outskirts',
    maxAttendees: 80,
    currentAttendees: 62,
    tag: 'Summery Camp',
  },
  {
    id: 2,
    title: 'Mentoring Program',
    description:
      'A structured 8-week mentoring program pairing experienced professionals with young aspiring leaders. Gain guidance, build networks, and fast-track your personal and career growth.',
    image: '/comm/kayy2.jpg',
    date: new Date('2026-07-08'),
    time: '10:00 AM – 12:00 PM',
    location: 'Kaayyoo Koof Community Hall',
    maxAttendees: 50,
    currentAttendees: 27,
    tag: 'Mentoring and Traninig',
  },
  {
    id: 3,
    title: 'Live Sessions',
    description:
      'Monthly live interactive sessions featuring guest speakers, open Q&A panels, skill-building workshops, and community discussions on topics that matter most to our members.',
    image: '/comm/kayy3.jpg',
    date: new Date('2026-07-08'),
    time: '6:00 PM – 8:30 PM',
    location: 'Online & Community Center',
    maxAttendees: 150,
    currentAttendees: 89,
    tag: 'Telegram Live',
  },
]
const testimonials = [
  {
    name: 'Yusuf Mohammed',
    role: 'Youth Volunteer | Active Members',
    image: '/we/kayyoo3.jpg',
    content:
      'Kayyoo Koof changed my perspective on community involvement. I came in with just an idea, but the support and mentorship I received helped me launch a successful community initiative. Now I mentor other youth members!',
  },
  {
    name: 'Duressa Shigido',
    role: 'Active Member & Coordinator',
    image: '/we/kayyoo2.jpg',
    content:
      'What impressed me most is the genuine care and commitment. Every member genuinely wants to see each other succeed. The networking opportunities and skill-sharing sessions have been invaluable for my personal and professional growth.',
  },
  {
    name: 'Hikma Denbel',
    role: 'Student Member',
    image: '/we/kayyoo5.jpg',
    content:
      'As a student, I was overwhelmed with life decisions. Kayyoo Koof provided guidance, internship opportunities, and a supportive network. The leadership programs prepared me for real-world challenges. Highly recommend!',
  },
]

const galleryItems = [
  { id: 1, src: 'we/kayyoo1.jpg', alt: 'Kaayyoo Koof community event', title: 'Community Gathering' },
  { id: 2, src: 'we/kayyoo2.jpg', alt: 'Kaayyoo Koof members', title: 'Our Members' },
  { id: 3, src: 'we/kayyoo3.jpg', alt: 'Kaayyoo Koof activity', title: 'Community Activity' },
  { id: 4, src: 'we/kayyoo4.jpg', alt: 'Kaayyoo Koof event', title: 'Association Event' },
  { id: 5, src: 'we/kayyoo5.jpg', alt: 'Kaayyoo Koof initiative', title: 'Community Initiative' },
  { id: 6, src: 'we/kayyoo6.jpg', alt: 'Kaayyoo Koof initiative', title: 'Community Initiative' },
]

export default async function HomePage() {
  let isLoggedIn = false

  try {
    const { auth } = await import('@/lib/auth')
    const session = await auth.api.getSession({ headers: await headers() })
    isLoggedIn = !!session?.user
  } catch {
    // auth failure is non-critical on public page
  }

  return (
    <>
      <Header isLoggedIn={isLoggedIn} />
      <main className="min-h-screen bg-background">

        {/* Hero */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-primary/10 to-background">
          <div className="max-w-6xl mx-auto px-4 py-20 text-center relative z-10">
            <div className="animate-fade-in-up mb-6">
              <div className="inline-flex items-center gap-3 mb-8 bg-white/50 backdrop-blur rounded-full px-6 py-3">
                <span className="text-foreground font-semibold">
                  <Typewriter text="Welcome to Kaayyoo Koof" speed={50} delay={300} />
                </span>
              </div>
            </div>
            <h1 className="text-6xl md:text-7xl font-bold text-foreground mb-6 animate-fade-in-up stagger-1 text-balance">
              Building Community Through Connection &amp; Impact
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto animate-fade-in-up stagger-2 leading-relaxed">
              Join Kaayyoo Koof to support your community, develop your skills, and make meaningful impact alongside passionate individuals
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up stagger-3">
              <HomeClient isLoggedIn={isLoggedIn} />
              <Link
                href="/events"
                className="px-8 py-4 rounded-lg border-2 border-primary text-primary hover:bg-primary/10 transition font-bold text-lg"
              >
                Explore Events
              </Link>
            </div>
          </div>
          <div className="absolute top-10 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl opacity-50 animate-float" />
          <div className="absolute bottom-0 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-50" />
        </section>

        {/* Banner */}
        <section className="py-8 md:py-12 bg-background">
          <div className="max-w-6xl mx-auto px-4">
            <BannerCarousel />
          </div>
        </section>

        {/* Stats */}
        <section className="py-20 bg-muted">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-16 animate-fade-in-up">
              <h2 className="text-4xl font-bold text-foreground mb-4">Our Collective Impact</h2>
              <p className="text-lg text-muted-foreground">Together, we&apos;re making a real difference in our community</p>
            </div>
            <div className="grid md:grid-cols-4 gap-8">
              <StatCounter targetValue={1250} label="Active Members" suffix="+" />
              <StatCounter targetValue={48} label="Events Hosted" />
              <StatCounter targetValue={3500} label="Community Hours" suffix="+" />
              <StatCounter targetValue={2500000} label="Funds Raised" prefix="$" divideBy={1000000} suffix="M" />
            </div>
          </div>
        </section>

        {/* About */}
        <section id="about" className="py-20 bg-background">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="animate-slide-in-left">
                <h2 className="text-4xl font-bold text-foreground mb-6">Who We Are</h2>
                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                  Kaayyoo Koof Association is a grassroots community organization dedicated to fostering personal development, social responsibility, and collective growth.
                </p>
                <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                  Our mission is to empower individuals, strengthen community bonds, and create opportunities for meaningful contribution and leadership development.
                </p>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <div className="text-primary font-bold text-2xl mb-1">Inclusive</div>
                    <p className="text-muted-foreground text-sm">Open to all community members</p>
                  </div>
                  <div className="flex-1">
                    <div className="text-primary font-bold text-2xl mb-1">Transparent</div>
                    <p className="text-muted-foreground text-sm">Accountable in all actions</p>
                  </div>
                  <div className="flex-1">
                    <div className="text-primary font-bold text-2xl mb-1">Impactful</div>
                    <p className="text-muted-foreground text-sm">Creating real change</p>
                  </div>
                </div>
              </div>
              <div className="animate-slide-in-right">
                <GalleryGrid items={galleryItems} />
              </div>
            </div>
          </div>
        </section>

        <ServicesSection />
        <AchievementsSection />
        <ImpactSection />

        {/* Upcoming Events — real events with local images */}
        <UpcomingEventsSection />

        <MembershipSection />

        {/* What Members Say — real member testimonials */}
        <WhatMembersSay />

        {/* Join Today CTA */}
        <section className="relative py-28 overflow-hidden bg-foreground text-background">
          <div className="absolute top-0 left-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 pointer-events-none" />
          <div className="relative max-w-5xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 bg-primary/20 border border-primary/30 text-primary px-5 py-2 rounded-full text-sm font-semibold mb-8 animate-fade-in-up">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              Now Accepting New Members
            </div>
            <h2 className="text-6xl md:text-7xl font-bold mb-6 animate-fade-in-up stagger-1 leading-tight">
              Become Part of<br />
              <span className="text-primary">Something Real</span>
            </h2>
            <p className="text-xl text-background/70 max-w-2xl mx-auto mb-14 animate-fade-in-up stagger-2 leading-relaxed">
              Join Kaayyoo Koof and connect with a community that uplifts, empowers, and creates lasting change together.
            </p>
            <div className="grid grid-cols-3 gap-6 max-w-xl mx-auto mb-14">
              <div className="bg-white/5 border border-white/10 rounded-xl py-4 px-2">
                <p className="text-2xl font-bold text-primary">1,250+</p>
                <p className="text-xs text-background/50 mt-1">Members</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl py-4 px-2">
                <p className="text-2xl font-bold text-primary">48</p>
                <p className="text-xs text-background/50 mt-1">Events Hosted</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl py-4 px-2">
                <p className="text-2xl font-bold text-primary">3,500+</p>
                <p className="text-xs text-background/50 mt-1">Volunteer Hours</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up stagger-3">
              <HomeClient isLoggedIn={isLoggedIn} />
            </div>
            <p className="mt-8 text-sm text-background/40">Free to join · No hidden fees · Cancel anytime</p>
          </div>
        </section>

        {/* Contact */}
        <section id="contact">
          <ContactSection />
        </section>

      </main>
      <Footer />
    </>
  )
}
