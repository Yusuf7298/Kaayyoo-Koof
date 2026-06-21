import Link from 'next/link'
import { getAnnouncementsAction } from '@/app/actions/phase2'

export const dynamic = 'force-dynamic'

export default async function AnnouncementsPage() {
  let announcements: any[] = []
  let error: string | null = null

  try {
    announcements = await getAnnouncementsAction()
  } catch (err) {
    console.error('[v0] Failed to fetch announcements:', err)
    error = 'Failed to load announcements'
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <Link href="/" className="text-primary hover:underline mb-4 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-4xl font-bold text-foreground">Announcements</h1>
          <p className="text-muted-foreground mt-2">Latest news and updates from Kayyoo Koof Association</p>
        </div>
      </div>

      {/* Announcements List */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-amber-50 text-amber-800 text-sm">
            {error}
          </div>
        )}
        {announcements.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No announcements yet. Check back soon!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {announcements.map((announcement) => (
              <article key={announcement.id} className="border border-border rounded-lg p-6 hover:shadow-md transition">
                <h2 className="text-2xl font-bold text-foreground mb-2">{announcement.title}</h2>
                <p className="text-sm text-muted-foreground mb-4">
                  Published {announcement.published_at ? new Date(announcement.published_at).toLocaleDateString() : 'Recently'}
                </p>
                <p className="text-foreground leading-relaxed">{announcement.content}</p>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
