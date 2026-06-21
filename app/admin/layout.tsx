import Link from 'next/link'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

const NAV = [
    { href: '/admin', label: 'Dashboard', icon: '🏠', exact: true },
    { href: '/admin/members', label: 'Members', icon: '👥' },
    { href: '/admin/events', label: 'Events', icon: '📅' },
    { href: '/admin/contributions', label: 'Contributions', icon: '💰' },
    { href: '/admin/announcements', label: 'Announcements', icon: '📢' },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) redirect('/sign-in')

    const adminEmails = process.env.ADMIN_EMAILS?.split(',').map(e => e.trim().toLowerCase()) ?? []
    const isAdmin = adminEmails.length === 0 || adminEmails.includes(session.user.email.toLowerCase())

    if (!isAdmin) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="bg-red-50 border border-red-200 text-red-700 p-8 rounded-xl max-w-md text-center">
                    <div className="text-4xl mb-4">🚫</div>
                    <h2 className="text-xl font-bold mb-2">Access Denied</h2>
                    <p className="text-sm mb-4">You don&apos;t have admin privileges.</p>
                    <Link href="/" className="text-red-600 hover:underline text-sm">← Return to Home</Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-muted/30 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-background border-r border-border flex flex-col fixed h-full z-10">
                {/* Brand */}
                <div className="p-6 border-b border-border">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-sm">K</div>
                        <div>
                            <p className="font-bold text-foreground text-sm">Kaayyoo Koof</p>
                            <p className="text-xs text-muted-foreground">Admin Panel</p>
                        </div>
                    </Link>
                </div>

                {/* Nav */}
                <nav className="flex-1 p-4 space-y-1">
                    {NAV.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-muted hover:text-primary transition-colors"
                        >
                            <span className="text-base">{item.icon}</span>
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {/* User + signout */}
                <div className="p-4 border-t border-border">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-xs">
                            {session.user.email[0].toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-foreground truncate">{session.user.name || 'Admin'}</p>
                            <p className="text-xs text-muted-foreground truncate">{session.user.email}</p>
                        </div>
                    </div>
                    <form action={async () => {
                        'use server'
                        await auth.api.signOut({ headers: await headers() })
                        redirect('/')
                    }}>
                        <button
                            type="submit"
                            className="w-full text-xs px-3 py-2 rounded-lg border border-border hover:bg-muted transition text-foreground"
                        >
                            Sign Out
                        </button>
                    </form>
                </div>
            </aside>

            {/* Main content */}
            <main className="flex-1 ml-64 min-h-screen">
                {children}
            </main>
        </div>
    )
}
