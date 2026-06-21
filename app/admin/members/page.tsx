'use client'

import { useEffect, useState } from 'react'
import { getAllMembers, updateMemberStatus, deleteMember } from '@/app/actions/admin'
import { Search, Users, CheckCircle, Clock, Ban } from 'lucide-react'

const STATUS_STYLES: Record<string, string> = {
  active: 'bg-green-50 text-green-700 border-green-200',
  inactive: 'bg-gray-50 text-gray-600 border-gray-200',
  pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  suspended: 'bg-red-50 text-red-700 border-red-200',
}

export default function AdminMembersPage() {
  const [members, setMembers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [tierFilter, setTierFilter] = useState('all')
  const [error, setError] = useState('')

  useEffect(() => { fetchMembers() }, [])

  const fetchMembers = async () => {
    setLoading(true)
    try {
      setMembers(await getAllMembers())
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await updateMemberStatus(id, status)
      setMembers(prev => prev.map(m => m.id === id ? { ...m, member_status: status } : m))
    } catch (e: any) { setError(e.message) }
  }

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Delete member "${name}"? This cannot be undone.`)) return
    try {
      await deleteMember(id)
      setMembers(prev => prev.filter(m => m.id !== id))
    } catch (e: any) { setError(e.message) }
  }

  const filtered = members.filter(m => {
    const fullName = `${m.first_name} ${m.last_name}`.toLowerCase()
    const matchSearch = !search || fullName.includes(search.toLowerCase()) || m.email.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || m.member_status === statusFilter
    const matchTier = tierFilter === 'all' || m.member_tier === tierFilter
    return matchSearch && matchStatus && matchTier
  })

  const counts = {
    all: members.length,
    active: members.filter(m => m.member_status === 'active').length,
    pending: members.filter(m => m.member_status === 'pending').length,
    inactive: members.filter(m => m.member_status === 'inactive').length,
    suspended: members.filter(m => m.member_status === 'suspended').length,
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Members</h1>
        <p className="text-muted-foreground mt-1">Manage all registered community members</p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex justify-between">
          {error}
          <button onClick={() => setError('')} className="font-bold">×</button>
        </div>
      )}

      {/* Stat pills */}
      <div className="flex flex-wrap gap-3 mb-6">
        {Object.entries(counts).map(([s, n]) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${statusFilter === s ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-border text-foreground hover:bg-muted'
              }`}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)} <span className="ml-1 opacity-70">({n})</span>
          </button>
        ))}
      </div>

      {/* Search + tier filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
        <select
          value={tierFilter}
          onChange={e => setTierFilter(e.target.value)}
          className="px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none"
        >
          <option value="all">All Tiers</option>
          <option value="individual">Individual</option>
          <option value="student">Student</option>
          <option value="corporate">Corporate</option>
          <option value="benefactor">Benefactor</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-16 text-muted-foreground">Loading members...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <Users size={40} className="mx-auto text-muted-foreground/30 mb-3" />
          <p className="text-muted-foreground">No members found</p>
        </div>
      ) : (
        <div className="bg-background border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="px-5 py-3 text-left font-semibold text-foreground">Member</th>
                <th className="px-5 py-3 text-left font-semibold text-foreground">Contact</th>
                <th className="px-5 py-3 text-left font-semibold text-foreground">Tier</th>
                <th className="px-5 py-3 text-left font-semibold text-foreground">Status</th>
                <th className="px-5 py-3 text-left font-semibold text-foreground">Joined</th>
                <th className="px-5 py-3 text-left font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(m => (
                <tr key={m.id} className="border-b border-border hover:bg-muted/40 transition-colors">
                  <td className="px-5 py-4">
                    <div className="font-semibold text-foreground">{m.first_name} {m.last_name}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">ID #{m.id}</div>
                  </td>
                  <td className="px-5 py-4">
                    <div className="text-foreground">{m.email}</div>
                    <div className="text-xs text-muted-foreground">{m.phone || 'No phone'}</div>
                  </td>
                  <td className="px-5 py-4 capitalize text-foreground">{m.member_tier}</td>
                  <td className="px-5 py-4">
                    <select
                      value={m.member_status}
                      onChange={e => handleStatusChange(m.id, e.target.value)}
                      className={`px-2 py-1 rounded-lg border text-xs font-semibold focus:outline-none ${STATUS_STYLES[m.member_status] || STATUS_STYLES.inactive}`}
                    >
                      <option value="active">Active</option>
                      <option value="pending">Pending</option>
                      <option value="inactive">Inactive</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">
                    {new Date(m.joined_date).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => handleDelete(m.id, `${m.first_name} ${m.last_name}`)}
                      className="px-3 py-1 text-xs rounded-lg bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-5 py-3 bg-muted/30 text-xs text-muted-foreground border-t border-border">
            Showing {filtered.length} of {members.length} members
          </div>
        </div>
      )}
    </div>
  )
}
