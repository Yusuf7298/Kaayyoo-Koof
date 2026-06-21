import Link from 'next/link'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { getMemberProfile, getMemberContributions, getContributionStats } from '@/app/actions/members'

export const dynamic = 'force-dynamic'

export default async function MemberDashboard() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/sign-in')

  const [member, contributions, stats] = await Promise.all([
    getMemberProfile(),
    getMemberContributions(),
    getContributionStats(),
  ])

  if (!member) {
    return (
      <main className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <p className="text-muted-foreground">Member profile not found. Please contact support.</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Welcome, {member.first_name}!</h1>
            <p className="text-muted-foreground mt-1">Member since {new Date(member.joined_date).toLocaleDateString()}</p>
          </div>
          <div className="flex gap-2">
            <Link href="/member/profile" className="px-4 py-2 rounded-lg border border-border hover:bg-muted transition">
              Edit Profile
            </Link>
            <form
              action={async () => {
                'use server'
                await auth.api.signOut({ headers: await headers() })
                redirect('/')
              }}
              className="inline"
            >
              <button type="submit" className="px-4 py-2 rounded-lg border border-border hover:bg-muted transition">
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-muted p-6 rounded-lg">
            <p className="text-muted-foreground text-sm mb-2">Total Contributions</p>
            <p className="text-3xl font-bold text-foreground">${stats.total.toFixed(2)}</p>
          </div>
          <div className="bg-muted p-6 rounded-lg">
            <p className="text-muted-foreground text-sm mb-2">Number of Contributions</p>
            <p className="text-3xl font-bold text-foreground">{stats.count}</p>
          </div>
          <div className="bg-muted p-6 rounded-lg">
            <p className="text-muted-foreground text-sm mb-2">Member Status</p>
            <p className="text-3xl font-bold text-foreground capitalize">{member.member_status}</p>
          </div>
        </div>

        {/* Contributions */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Contribution History</h2>
          {contributions.length === 0 ? (
            <div className="bg-muted p-8 rounded-lg text-center">
              <p className="text-muted-foreground">No contributions recorded yet.</p>
            </div>
          ) : (
            <div className="border border-border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted border-b border-border">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Date</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Type</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Amount</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Description</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {contributions.map((contribution) => (
                    <tr key={contribution.id} className="border-b border-border hover:bg-muted/50 transition">
                      <td className="px-6 py-4 text-sm text-foreground">
                        {new Date(contribution.contribution_date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground capitalize">{contribution.contribution_type}</td>
                      <td className="px-6 py-4 text-sm text-foreground font-semibold">
                        ${parseFloat(contribution.amount as any).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{contribution.description || '-'}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold capitalize">
                          {contribution.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="grid md:grid-cols-2 gap-6">
          <Link
            href="/events"
            className="p-6 bg-muted rounded-lg hover:shadow-md transition"
          >
            <h3 className="text-lg font-semibold text-foreground mb-2">📅 Upcoming Events</h3>
            <p className="text-muted-foreground">View and register for community events</p>
          </Link>
          <Link
            href="/announcements"
            className="p-6 bg-muted rounded-lg hover:shadow-md transition"
          >
            <h3 className="text-lg font-semibold text-foreground mb-2">📢 Announcements</h3>
            <p className="text-muted-foreground">Stay updated with latest news and updates</p>
          </Link>
        </div>
      </div>
    </main>
  )
}
