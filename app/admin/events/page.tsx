'use client'

import { useEffect, useState } from 'react'
import { getAllEvents, createEvent, updateEvent, deleteEvent } from '@/app/actions/admin'
import { CalendarDays, MapPin, Users, Plus, Pencil, Trash2 } from 'lucide-react'

const EMPTY = { title: '', description: '', event_date: '', location: '', max_attendees: '' }

const STATUS_COLORS: Record<string, string> = {
  upcoming: 'bg-blue-50 text-blue-700 border-blue-200',
  ongoing: 'bg-green-50 text-green-700 border-green-200',
  completed: 'bg-gray-50 text-gray-600 border-gray-200',
  cancelled: 'bg-red-50 text-red-600 border-red-200',
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formData, setFormData] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { fetchEvents() }, [])

  const fetchEvents = async () => {
    setLoading(true)
    try { setEvents(await getAllEvents()) } catch (e: any) { setError(e.message) }
    finally { setLoading(false) }
  }

  const openCreate = () => {
    setEditingId(null)
    setFormData(EMPTY)
    setShowForm(true)
  }

  const openEdit = (ev: any) => {
    setEditingId(ev.id)
    setFormData({
      title: ev.title,
      description: ev.description || '',
      event_date: new Date(ev.event_date).toISOString().slice(0, 16),
      location: ev.location || '',
      max_attendees: ev.max_attendees?.toString() || '',
    })
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      if (editingId) {
        await updateEvent(editingId, {
          title: formData.title,
          description: formData.description || undefined,
          event_date: formData.event_date,
          location: formData.location || undefined,
          max_attendees: formData.max_attendees ? parseInt(formData.max_attendees) : undefined,
        })
        setEvents(prev => prev.map(ev =>
          ev.id === editingId ? { ...ev, ...formData, event_date: new Date(formData.event_date), max_attendees: formData.max_attendees ? parseInt(formData.max_attendees) : null } : ev
        ))
      } else {
        const created = await createEvent({
          title: formData.title,
          description: formData.description || undefined,
          event_date: formData.event_date,
          location: formData.location || undefined,
          max_attendees: formData.max_attendees ? parseInt(formData.max_attendees) : undefined,
        })
        setEvents(prev => [created, ...prev])
      }
      setShowForm(false)
      setFormData(EMPTY)
      setEditingId(null)
    } catch (e: any) { setError(e.message) }
    finally { setSaving(false) }
  }

  const handleDelete = async (id: number, title: string) => {
    if (!confirm(`Delete event "${title}"?`)) return
    try {
      await deleteEvent(id)
      setEvents(prev => prev.filter(ev => ev.id !== id))
    } catch (e: any) { setError(e.message) }
  }

  const handleStatusChange = async (id: number, status: string) => {
    try {
      await updateEvent(id, { status })
      setEvents(prev => prev.map(ev => ev.id === id ? { ...ev, status } : ev))
    } catch (e: any) { setError(e.message) }
  }

  const input = 'w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40'

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Events</h1>
          <p className="text-muted-foreground mt-1">Create and manage community events</p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold text-sm hover:bg-primary/90 transition"
        >
          <Plus size={16} /> New Event
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
            {editingId ? 'Edit Event' : 'Create New Event'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Title *</label>
              <input type="text" required value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })} className={input} />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Description</label>
              <textarea rows={3} value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })} className={input} />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Date & Time *</label>
                <input type="datetime-local" required value={formData.event_date}
                  onChange={e => setFormData({ ...formData, event_date: e.target.value })} className={input} />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">Location</label>
                <input type="text" value={formData.location}
                  onChange={e => setFormData({ ...formData, location: e.target.value })} className={input} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Max Attendees</label>
              <input type="number" min="1" value={formData.max_attendees}
                onChange={e => setFormData({ ...formData, max_attendees: e.target.value })} className={input} placeholder="Leave blank for unlimited" />
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={saving}
                className="flex-1 py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold text-sm hover:bg-primary/90 disabled:opacity-50 transition">
                {saving ? 'Saving...' : editingId ? 'Save Changes' : 'Create Event'}
              </button>
              <button type="button" onClick={() => { setShowForm(false); setEditingId(null) }}
                className="px-6 py-2.5 border border-border rounded-lg text-sm hover:bg-muted transition">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Events list */}
      {loading ? (
        <div className="text-center py-16 text-muted-foreground">Loading events...</div>
      ) : events.length === 0 ? (
        <div className="text-center py-16">
          <CalendarDays size={40} className="mx-auto text-muted-foreground/30 mb-3" />
          <p className="text-muted-foreground">No events yet. Create your first event!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {events.map(ev => (
            <div key={ev.id} className="bg-background border border-border rounded-xl p-5 hover:shadow-sm transition">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="font-bold text-foreground text-lg">{ev.title}</h3>
                    <select
                      value={ev.status}
                      onChange={e => handleStatusChange(ev.id, e.target.value)}
                      className={`px-2.5 py-1 rounded-full border text-xs font-semibold focus:outline-none ${STATUS_COLORS[ev.status] || STATUS_COLORS.upcoming}`}
                    >
                      <option value="upcoming">Upcoming</option>
                      <option value="ongoing">Ongoing</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  {ev.description && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{ev.description}</p>}
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => openEdit(ev)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg border border-border hover:bg-muted transition">
                    <Pencil size={12} /> Edit
                  </button>
                  <button onClick={() => handleDelete(ev.id, ev.title)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition">
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <CalendarDays size={14} />
                  {new Date(ev.event_date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </span>
                {ev.location && <span className="flex items-center gap-1.5"><MapPin size={14} />{ev.location}</span>}
                {ev.max_attendees && <span className="flex items-center gap-1.5"><Users size={14} />Max {ev.max_attendees}</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
