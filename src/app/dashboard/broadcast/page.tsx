'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'gooey-toast'
import { Loader2, Send, Users, Mail, Clock } from 'lucide-react'
import WaBroadcast from '@/components/broadcast/WaBroadcast'

interface Invitation {
  id: string
  title: string
  slug: string | null
  groom_name?: string
  bride_name?: string
  event_date?: string
}

interface Guest {
  id: string
  name: string
  phone: string
  whatsapp_number: string | null
  invite_sent: boolean
  attendance_status: string
}

interface BroadcastHistory {
  invitation_id: string
  invitation_title: string
  guest_count: number
  sent_at: string
}

export default function BroadcastPage() {
  const supabase = createClient()
  const [invitations, setInvitations] = useState<Invitation[]>([])
  const [selectedInvitationId, setSelectedInvitationId] = useState<string>('')
  const [guests, setGuests] = useState<Guest[]>([])
  const [loading, setLoading] = useState(true)
  const [guestsLoading, setGuestsLoading] = useState(false)
  const [history, setHistory] = useState<BroadcastHistory[]>([])

  const baseUrl =
    typeof window !== 'undefined' ? window.location.origin : ''

  // Fetch invitations
  useEffect(() => {
    async function fetchInvitations() {
      setLoading(true)
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('invitations')
        .select('id, title, slug, status')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (data) {
        setInvitations(data)
        if (data.length > 0 && !selectedInvitationId) {
          setSelectedInvitationId(data[0].id)
        }
      }
      setLoading(false)
    }
    fetchInvitations()
  }, [supabase, selectedInvitationId])

  // Fetch guests when invitation changes
  useEffect(() => {
    if (!selectedInvitationId) return
    async function fetchGuests() {
      setGuestsLoading(true)
      const { data } = await supabase
        .from('guests')
        .select('*')
        .eq('invitation_id', selectedInvitationId)
        .order('name', { ascending: true })

      setGuests(data || [])
      setGuestsLoading(false)
    }
    fetchGuests()
  }, [selectedInvitationId, supabase])

  // Load broadcast history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('momenku_broadcast_history')
    if (saved) {
      setHistory(JSON.parse(saved))
    }
  }, [])

  const selectedInvitation = invitations.find(
    (inv) => inv.id === selectedInvitationId
  )

  const totalGuests = guests.length
  const sentCount = guests.filter((g) => g.invite_sent).length
  const notSentCount = totalGuests - sentCount

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-[family-name:var(--font-cormorant)] text-3xl font-bold text-stone-900">
          WhatsApp Broadcast
        </h1>
        <p className="text-sm text-stone-500 mt-1">
          Kirim undangan pernikahan via WhatsApp ke semua tamu
        </p>
      </div>

      {/* Invitation selector */}
      <div className="rounded-2xl border border-stone-200 bg-white p-6">
        <label className="block text-sm font-medium text-stone-700 mb-2">
          Pilih Undangan
        </label>
        {loading ? (
          <div className="flex items-center gap-2 text-sm text-stone-400">
            <Loader2 className="w-4 h-4 animate-spin" />
            Memuat undangan...
          </div>
        ) : invitations.length === 0 ? (
          <div className="text-center py-8">
            <Mail className="w-10 h-10 text-stone-300 mx-auto mb-3" />
            <p className="text-sm text-stone-500">Belum ada undangan</p>
            <a
              href="/dashboard"
              className="inline-flex items-center gap-1.5 mt-2 text-xs font-medium text-emerald-600 hover:text-emerald-700"
            >
              Buat undangan baru →
            </a>
          </div>
        ) : (
          <select
            value={selectedInvitationId}
            onChange={(e) => setSelectedInvitationId(e.target.value)}
            className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-800 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          >
            {invitations.map((inv) => (
              <option key={inv.id} value={inv.id}>
                {inv.title}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Stats */}
      {selectedInvitationId && (
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-2xl border border-stone-200 bg-white p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-stone-900">{totalGuests}</p>
                <p className="text-xs text-stone-500">Total Tamu</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-stone-200 bg-white p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
                <Send className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-stone-900">{sentCount}</p>
                <p className="text-xs text-stone-500">Terkirim</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-stone-200 bg-white p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-stone-900">{notSentCount}</p>
                <p className="text-xs text-stone-500">Belum Dikirim</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Broadcast component */}
      {selectedInvitationId && !guestsLoading && selectedInvitation && (
        <WaBroadcast
          guests={guests}
          invitation={selectedInvitation}
          baseUrl={baseUrl}
          onSendComplete={() => {
            // Refresh guests
            setGuestsLoading(true)
            supabase
              .from('guests')
              .select('*')
              .eq('invitation_id', selectedInvitationId)
              .order('name', { ascending: true })
              .then(({ data }) => {
                setGuests(data || [])
                setGuestsLoading(false)
              })
            // Refresh history
            const saved = localStorage.getItem('momenku_broadcast_history')
            if (saved) setHistory(JSON.parse(saved))
          }}
        />
      )}

      {guestsLoading && selectedInvitationId && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
        </div>
      )}

      {/* Broadcast History */}
      {history.length > 0 && (
        <div className="rounded-2xl border border-stone-200 bg-white p-6">
          <h3 className="text-lg font-semibold text-stone-900 mb-4">
            Riwayat Broadcast
          </h3>
          <div className="space-y-3">
            {history.slice(0, 10).map((h, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-xl border border-stone-100 p-3"
              >
                <div>
                  <p className="text-sm font-medium text-stone-800">
                    {h.invitation_title}
                  </p>
                  <p className="text-xs text-stone-400">
                    {h.guest_count} tamu
                  </p>
                </div>
                <span className="text-xs text-stone-400">
                  {new Date(h.sent_at).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
