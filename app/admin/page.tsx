import Link from 'next/link'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { getMemberStats, getAdminDashboardStats } from '@/app/actions/admin'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  const session = await auth.api.getSession({ headers: await headers() })

  let stats = {
    totalMembers: 0,
    activeMembers: 0,
    pendingMembers: 0,
    totalContributions: 0,
    totalEvents: 0,
    upcomingEvents: 0,
    totalAnnouncements: 0,
  }

  try {
    stats = await getAdminDashboardStats()
  } catch {
    // DB not ready yet
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back, {session?.user?.name || session?.user?.email}
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Total Members', value: stats.totalMembers, icon: '👥', color: 'bg-blue-50 text-blue-700' },
          { label: 'Active Members', value: stats.activeMembers, icon: '✅', color: 'bg-green-50 text-green-700' },
          { label: 'Pending Members', value: stats.pendingMembers, icon: '⏳', color: 'bg-yellow-50 text-yellow-700' },
          { label: 'Total Contributions', value: `$${stats.totalContributions.toFixed(0)}`, icon: '💰', color: 'bg-purple-50 text-purple-700' },
          { label: 'Total Events', value: stats.totalEvents, icon: '📅', color: 'bg-orange-50 text-orange-700' },
          { label: 'Upcoming Events', value: stats.upcomingEvents, icon: '🗓️', color: 'bg-cyan-50 text-cyan-700' },
          { label: 'Announcements', value: stats.totalAnnouncements, icon: '📢', color: 'bg-pink-50 text-pink-700' },
        ].map((stat) => (
          <div key={stat.label} className="bg-background border border-border rounded-xl p-5">
            <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg text-lg mb-3 ${stat.color}`}>
              {stat.icon}
            </div>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <h2 className="text-lg font-bold text-foreground mb-4">Quick Actions</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { href: '/admin/members', icon: '👥', title: 'Manage Members', desc: 'View, filter and update member status' },
          { href: '/admin/events', icon: '📅', title: 'Manage Events', desc: 'Create, edit and delete events' },
          { href: '/admin/contributions', icon: '💰', title: 'Contributions', desc: 'Track and add member contributions' },
          { href: '/admin/announcements', icon: '📢', title: 'Announcements', desc: 'Publish community announcements' },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="bg-background border border-border rounded-xl p-5 hover:border-primary/50 hover:shadow-md transition-all group"
          >
            <div className="text-2xl mb-3">{item.icon}</div>
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{item.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
