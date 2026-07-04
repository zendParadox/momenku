'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Loader2, Users, CheckCircle, XCircle, HelpCircle, Clock } from 'lucide-react'
import type { User } from '@supabase/supabase-js'

interface RsvpRecord {
  id: string
  guest_name: string
  attendance_status: string
  guest_count: number
  companion_names: string | null
  wish_message: string | null
  created_at: string
}

interface InvitationRsvp {
  id: string
  title: string
  rsvp_count: number
}

export default function DashboardRsvpPage() {
  const [invitations, setInvitations] = useState<InvitationRsvp[]>([])
  const [selectedInvitation, setSelectedInvitation] = useState<string>('')
  const [rsvps, setRsvps] = useState<RsvpRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingRsvps, setLoadingRsvps] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('invitations')
      .select('id, title, rsvp_count')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setInvitations(data || [])
        if (data && data.length > 0) {
          setSelectedInvitation(data[0].id)
        }
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    if (!selectedInvitation) return

    setLoadingRsvps(true)
    const supabase = createClient()
    supabase
      .from('rsvps')
      .select('*')
      .eq('invitation_id', selectedInvitation)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setRsvps(data || [])
        setLoadingRsvps(false)
      })
  }, [selectedInvitation])

  // Calculate stats
  const attending = rsvps.filter((r) => r.attendance_status === 'attending')
  const notAttending = rsvps.filter((r) => r.attendance_status === 'not_attending')
  const maybe = rsvps.filter((r) => r.attendance_status === 'maybe')
  const totalGuests = attending.reduce((sum, r) => sum + (r.guest_count || 1), 0)
  const total = rsvps.length

  const stats = [
    { label: 'Hadir', count: attending.length, color: '#059669', icon: CheckCircle },
    { label: 'Tidak Hadir', count: notAttending.length, color: '#dc2626', icon: XCircle },
    { label: 'Masih Ragu', count: maybe.length, color: '#2563eb', icon: HelpCircle },
    { label: 'Belum RSVP', count: Math.max(0, (invitations.find((i) => i.id === selectedInvitation)?.rsvp_count || 0) - total), color: '#a8a29e', icon: Clock },
  ]

  const maxCount = Math.max(...stats.map((s) => s.count), 1)

  function statusBadge(status: string) {
    switch (status) {
      case 'attending':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Hadir
          </span>
        )
      case 'not_attending':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-700">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
            Tidak Hadir
          </span>
        )
      case 'maybe':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
            Masih Ragu
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-medium text-stone-500">
            <span className="h-1.5 w-1.5 rounded-full bg-stone-400" />
            Unknown
          </span>
        )
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
      </div>
    )
  }

  return (
    <>
      <div className="mb-6">
        <h2 className="font-[family-name:var(--font-cormorant)] text-2xl font-bold text-stone-900 mb-4">
          Statistik RSVP
        </h2>

        {/* Invitation selector */}
        <select
          value={selectedInvitation}
          onChange={(e) => setSelectedInvitation(e.target.value)}
          className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-stone-200 text-sm font-medium text-stone-700 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          {invitations.map((inv) => (
            <option key={inv.id} value={inv.id}>
              {inv.title}
            </option>
          ))}
        </select>
      </div>

      {/* Stats cards */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.label} className="rounded-2xl border border-stone-200 bg-white p-4">
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-lg"
                  style={{ backgroundColor: `${stat.color}15` }}
                >
                  <Icon className="h-4 w-4" style={{ color: stat.color }} />
                </div>
                <span className="text-xs text-stone-500">{stat.label}</span>
              </div>
              <p className="text-2xl font-bold text-stone-900">{stat.count}</p>
            </div>
          )
        })}
      </div>

      {/* Bar chart */}
      <div className="rounded-2xl border border-stone-200 bg-white p-6 mb-8">
        <h3 className="text-sm font-semibold text-stone-900 mb-4">Distribusi Kehadiran</h3>
        <div className="space-y-3">
          {stats.map((stat) => {
            const percentage = total > 0 ? Math.round((stat.count / total) * 100) : 0
            const barWidth = total > 0 ? (stat.count / maxCount) * 100 : 0
            return (
              <div key={stat.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-stone-600">{stat.label}</span>
                  <span className="text-xs text-stone-500">
                    {stat.count} ({percentage}%)
                  </span>
                </div>
                <div className="h-3 bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${barWidth}%`,
                      backgroundColor: stat.color,
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>
        {total > 0 && (
          <div className="mt-4 pt-4 border-t border-stone-100 flex items-center justify-between">
            <span className="text-xs text-stone-500">Total Tamu (Hadir)</span>
            <span className="text-sm font-bold text-stone-900">{totalGuests} orang</span>
          </div>
        )}
      </div>

      {/* Recent RSVPs */}
      <div className="rounded-2xl border border-stone-200 bg-white">
        <div className="px-6 py-4 border-b border-stone-100">
          <h3 className="text-sm font-semibold text-stone-900">RSVP Terbaru</h3>
        </div>
        {loadingRsvps ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />
          </div>
        ) : rsvps.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Users className="h-8 w-8 text-stone-300 mb-2" />
            <p className="text-sm text-stone-500">Belum ada RSVP</p>
          </div>
        ) : (
          <div className="divide-y divide-stone-50">
            {rsvps.map((rsvp) => (
              <div key={rsvp.id} className="px-6 py-3 flex items-center justify-between">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-stone-900 truncate">
                    {rsvp.guest_name}
                  </p>
                  <p className="text-xs text-stone-500">
                    {new Date(rsvp.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                    {rsvp.guest_count > 1 && ` • ${rsvp.guest_count} orang`}
                  </p>
                </div>
                {statusBadge(rsvp.attendance_status)}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
