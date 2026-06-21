'use client'

import { useEffect, useState } from 'react'
import { getAllContributions, getContributionReport, addContribution, deleteContribution, getAllMembers } from '@/app/actions/admin'
import { Plus, Trash2, DollarSign } from 'lucide-react'

const TYPES = ['membership_fee', 'donation', 'fundraising', 'event_fee', 'other']
const METHODS = ['cash', 'card', 'bank_transfer', 'telegram', 'other']
const EMPTY = { member_id: '', amount: '', contribution_type: 'donation', description: '', payment_method: 'cash' }

export default function AdminContributionsPage() {
  const [contributions, setContributions] = useState<any[]>([])
  const [members, setMembers] = useState<any[]>([])
  const [report, setReport] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [filter, setFilter] = useState('all')
  const [error, setError] = useState('')

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [c, r, m] = await Promise.all([getAllContributions(), getContributionReport(), getAllMembers()])
      setContributions(c)
      setReport(r)
      setMembers(m)
    } catch (e: any) { setError(e.message) }
    finally { setLoading(false) }
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.member_id || !formData.amount) return
    setSaving(true)
    setError('')
    try {
      const member = members.find(m => m.id === parseInt(formData.member_id))
      if (!member) throw new Error('Member not found')
      const created = await addContribution({
        member_id: parseInt(formData.member_id),
        user_id: member.userId,
        amount: formData.amount,
        contribution_type: formData.contribution_type,
        description: formData.description || undefined,
        payment_method: formData.payment_method,
      })
      setContributions(prev => [created, ...prev])
      setReport((prev: any) => ({
        ...prev,
        total: prev.total + parseFloat(formData.amount),
        count: prev.count + 1,
        average: (prev.total + parseFloat(formData.amount)) / (prev.count + 1),
      }))
      setFormData(EMPTY)
      setShowForm(false)
    } catch (e: any) { setError(e.message) }
    finally { setSaving(false) }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this contribution?')) return
    try {
      await deleteContribution(id)
      setContributions(prev => prev.filter(c => c.id !== id))
    } catch (e: any) { setError(e.message) }
  }

  const filtered = filter === 'all' ? contributions : contributions.filter(c => c.contribution_type === filter)
  const types = Array.from(new Set(contributions.map(c => c.contribution_type)))
  const input = 'w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40'

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Contributions</h1>
          <p className="text-muted-foreground mt-1">Track and record member contributions</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold text-sm hover:bg-primary/90 transition">
          <Plus size={16} /> Add Contribution
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex justify-between">
          {error}<button onClick={() => setError('')} className="font-bold">×</button>
        </div>
      )}

      {/* Summary cards */}
      {report && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-background border border-border rounded-xl p-5">
            <p className="text-xs text-muted-foreground mb-1">Total Raised</p>
            <p className="text-2xl font-bold text-foreground">${report.total.toFixed(2)}</p>
          </div>
          <div className="bg-background border border-border rounded-xl p-5">
            <p className="text-xs text-muted-foreground mb-1">Total Transactions</p>
            <p className="text-2xl font-bold text-foreground">{report.count}</p>
          </div>
          <div className="bg-background border border-border rounded-xl p-5">
            <p className="text-xs text-muted-foreground mb-1">Average</p>
            <p className="text-2xl font-bold text-foreground">${report.average.toFixed(2)}</p>
          </div>
          <div className="bg-background border border-border rounded-xl p-5">
            <p className="text-xs text-muted-foreground mb-2">By Type</p>
            <div className="space-y-1">
              {Object.entries(report.byType).map(([type, amt]: [string, any]) => (
                <div key={type} className="flex justify-between text-xs">
                  <span className="text-muted-foreground capitalize">{type.replace('_', ' ')}</span>
                  <span className="font-semibold text-foreground">${amt.toFixed(0)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add form */}
      {showForm && (
        <div className="bg-background border border-border rounded-xl p-6 mb-8">
          <h2 className="text-lg font-bold text-foreground mb-5">Record Contribution</h2>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Member *</label>
                <select required value={formData.member_id}
                  onChange={e => setFormData({ ...formData, member_id: e.target.value })} className={input}>
                  <option value="">Select a member...</option>
                  {members.map(m => (
                    <option key={m.id} value={m.id}>{m.first_name} {m.last_name} ({m.email})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Amount (USD) *</label>
                <input type="number" min="0.01" step="0.01" required value={formData.amount}
                  onChange={e => setFormData({ ...formData, amount: e.target.value })}
                  className={input} placeholder="0.00" />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Type</label>
                <select value={formData.contribution_type}
                  onChange={e => setFormData({ ...formData, contribution_type: e.target.value })} className={input}>
                  {TYPES.map(t => <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Payment Method</label>
                <select value={formData.payment_method}
                  onChange={e => setFormData({ ...formData, payment_method: e.target.value })} className={input}>
                  {METHODS.map(m => <option key={m} value={m}>{m.replace(/_/g, ' ')}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Description (optional)</label>
              <input type="text" value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                className={input} placeholder="e.g. January membership fee" />
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={saving}
                className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold text-sm hover:bg-primary/90 disabled:opacity-50 transition">
                {saving ? 'Saving...' : 'Record Contribution'}
              </button>
              <button type="button" onClick={() => setShowForm(false)}
                className="px-6 py-2.5 border border-border rounded-lg text-sm hover:bg-muted transition">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Type filter */}
      <div className="flex flex-wrap gap-2 mb-5">
        {['all', ...types].map(t => (
          <button key={t} onClick={() => setFilter(t)}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium capitalize border transition ${filter === t ? 'bg-primary text-primary-foreground border-primary' : 'bg-background border-border text-foreground hover:bg-muted'
              }`}>
            {t === 'all' ? `All (${contributions.length})` : `${t.replace(/_/g, ' ')} (${contributions.filter(c => c.contribution_type === t).length})`}
          </button>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-16 text-muted-foreground">Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <DollarSign size={40} className="mx-auto text-muted-foreground/30 mb-3" />
          <p className="text-muted-foreground">No contributions found</p>
        </div>
      ) : (
        <div className="bg-background border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted border-b border-border">
              <tr>
                <th className="px-5 py-3 text-left font-semibold text-foreground">Date</th>
                <th className="px-5 py-3 text-left font-semibold text-foreground">Type</th>
                <th className="px-5 py-3 text-left font-semibold text-foreground">Amount</th>
                <th className="px-5 py-3 text-left font-semibold text-foreground">Method</th>
                <th className="px-5 py-3 text-left font-semibold text-foreground">Description</th>
                <th className="px-5 py-3 text-left font-semibold text-foreground">Status</th>
                <th className="px-5 py-3 text-left font-semibold text-foreground"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id} className="border-b border-border hover:bg-muted/40 transition">
                  <td className="px-5 py-4 text-muted-foreground">{new Date(c.contribution_date).toLocaleDateString()}</td>
                  <td className="px-5 py-4 capitalize text-foreground">{c.contribution_type.replace(/_/g, ' ')}</td>
                  <td className="px-5 py-4 font-bold text-foreground">${parseFloat(c.amount).toFixed(2)}</td>
                  <td className="px-5 py-4 capitalize text-muted-foreground">{c.payment_method || '—'}</td>
                  <td className="px-5 py-4 text-muted-foreground">{c.description || '—'}</td>
                  <td className="px-5 py-4">
                    <span className="px-2.5 py-1 rounded-full bg-green-50 text-green-700 text-xs font-semibold border border-green-200 capitalize">
                      {c.status}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <button onClick={() => handleDelete(c.id)}
                      className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition">
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
