'use client'

import { useEffect, useState } from 'react'
import { getAllAnnouncements, createAdminAnnouncement, updateAnnouncement, deleteAnnouncement } from '@/app/actions/admin'
import { Plus, Pencil, Trash2, Megaphone } from 'lucide-react'

const EMPTY = { title: '', content: '' }

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { fetchAnnouncements() }, [])

  const fetchAnnouncements = async () => {
    setLoading(true)
    try { setAnnouncements(await getAllAnnouncements()) }
    catch (e: any) { setError(e.message) }
    finally { setLoading(false) }
  }

  const openCreate = () => {
    setEditingId(null)
    setFormData(EMPTY)
    setShowForm(true)
  }

  const openEdit = (a: any) => {
    setEditingId(a.id)
    setFormData({ title: a.title, content: a.content })
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      if (editingId) {
        await updateAnnouncement(editingId, formData)
        setAnnouncements(prev => prev.map(a => a.id === editingId ? { ...a, ...formData } : a))
      } else {
        const created = await createAdminAnnouncement(formData)
        setAnnouncements(prev => [created, ...prev])
      }
      setShowForm(false)
      setEditingId(null)
      setFormData(EMPTY)
    } catch (e: any) { setError(e.message) }
    finally { setSaving(false) }
  }

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return
    try {
      await deleteAnnouncement(id)
      setAnnouncements(prev => prev.filter(a => a.id !== id))
    } catch (e: any) { setError(e.message) }
  }

  const input = 'w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40'

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Announcements</h1>
          <p className="text-muted-foreground mt-1">Publish news and updates to your community</p>
        </div>
        <button onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold text-sm hover:bg-primary/90 transition">
          <Plus size={16} /> New Announcement
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex justify-between">
          {error}<button onClick={() => setError('')} className="font-bold">×</button>
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="bg-background border border-border rounded-xl p-6 mb-8">
          <h2 className="text-lg font-bold text-foreground mb-5">
            {editingId ? 'Edit Announcement' : 'New Announcement'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Title *</label>
              <input type="text" required value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })} className={input} />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Content *</label>
              <textarea required rows={5} value={formData.content}
                onChange={e => setFormData({ ...formData, content: e.target.value })}
                className={input} placeholder="Write your announcement here..." />
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={saving}
                className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold text-sm hover:bg-primary/90 disabled:opacity-50 transition">
                {saving ? 'Saving...' : editingId ? 'Save Changes' : 'Publish'}
              </button>
              <button type="button" onClick={() => { setShowForm(false); setEditingId(null) }}
                className="px-6 py-2.5 border border-border rounded-lg text-sm hover:bg-muted transition">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="text-center py-16 text-muted-foreground">Loading...</div>
      ) : announcements.length === 0 ? (
        <div className="text-center py-16">
          <Megaphone size={40} className="mx-auto text-muted-foreground/30 mb-3" />
          <p className="text-muted-foreground">No announcements yet. Publish your first one!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map(a => (
            <div key={a.id} className="bg-background border border-border rounded-xl p-6 hover:shadow-sm transition">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1">
                  <h3 className="font-bold text-foreground text-lg">{a.title}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Published {a.published_at ? new Date(a.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'recently'}
                  </p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => openEdit(a)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border border-border hover:bg-muted transition">
                    <Pencil size={12} /> Edit
                  </button>
                  <button onClick={() => handleDelete(a.id, a.title)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition">
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </div>
              <p className="text-foreground leading-relaxed text-sm whitespace-pre-wrap">{a.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
