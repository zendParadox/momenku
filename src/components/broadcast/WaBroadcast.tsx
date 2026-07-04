'use client'

import { useState, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'gooey-toast'
import { Send, CheckSquare, Square, Loader2, Filter } from 'lucide-react'
import MessageTemplate from './MessageTemplate'

interface Guest {
  id: string
  name: string
  phone: string
  whatsapp_number: string | null
  invite_sent: boolean
  attendance_status: string
}

interface Invitation {
  id: string
  title: string
  slug: string | null
  groom_name?: string
  bride_name?: string
  event_date?: string
}

interface WaBroadcastProps {
  guests: Guest[]
  invitation: Invitation
  baseUrl: string
  onSendComplete?: () => void
}

function formatPhone(phone: string): string {
  // Remove all non-digit characters
  let cleaned = phone.replace(/\D/g, '')
  // Remove leading 0, add 62 prefix
  if (cleaned.startsWith('0')) {
    cleaned = '62' + cleaned.slice(1)
  }
  // If already starts with 62, keep it
  if (!cleaned.startsWith('62')) {
    cleaned = '62' + cleaned
  }
  return cleaned
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return '-'
  try {
    const date = new Date(dateStr)
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return dateStr
  }
}

const DEFAULT_TEMPLATE = `Halo {name}! 💕

Kami mengundang Anda ke acara pernikahan:
📅 {event_name}
📆 {date}

Lihat undangan: {url}
Konfirmasi kehadiran: {rsvp_url}

Merupakan kehormatan bagi kami apabila Anda berkenan hadir. 🙏`

type FilterType = 'all' | 'not_sent' | 'sent'

export default function WaBroadcast({
  guests,
  invitation,
  baseUrl,
  onSendComplete,
}: WaBroadcastProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [filter, setFilter] = useState<FilterType>('all')
  const [message, setMessage] = useState(DEFAULT_TEMPLATE)
  const [sending, setSending] = useState(false)
  const [progress, setProgress] = useState({ current: 0, total: 0 })

  const filteredGuests = useMemo(() => {
    switch (filter) {
      case 'not_sent':
        return guests.filter((g) => !g.invite_sent)
      case 'sent':
        return guests.filter((g) => g.invite_sent)
      default:
        return guests
    }
  }, [guests, filter])

  const invitationUrl = invitation.slug
    ? `${baseUrl}/invitation/${invitation.slug}`
    : `${baseUrl}/invitation/${invitation.id}`
  const rsvpUrl = `${invitationUrl}?rsvp=true`

  function fillMessage(guest: Guest): string {
    return message
      .replace(/{name}/g, guest.name)
      .replace(/{event_name}/g, invitation.title || '-')
      .replace(/{date}/g, formatDate(invitation.event_date))
      .replace(/{url}/g, invitationUrl)
      .replace(/{rsvp_url}/g, rsvpUrl)
  }

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  function selectAll() {
    setSelected(new Set(filteredGuests.map((g) => g.id)))
  }

  function deselectAll() {
    setSelected(new Set())
  }

  async function handleSend() {
    if (selected.size === 0) {
      toast.error({
        title: 'Tidak ada tamu dipilih',
        description: 'Pilih minimal satu tamu untuk mengirim undangan',
      })
      return
    }

    setSending(true)
    const selectedGuests = filteredGuests.filter((g) => selected.has(g.id))
    setProgress({ current: 0, total: selectedGuests.length })

    const supabase = createClient()

    for (let i = 0; i < selectedGuests.length; i++) {
      const guest = selectedGuests[i]
      const phone = guest.whatsapp_number || guest.phone
      const formattedPhone = formatPhone(phone)
      const text = fillMessage(guest)
      const url = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(text)}`

      // Open WhatsApp link in new tab
      window.open(url, '_blank')

      // Mark as sent in Supabase
      await supabase
        .from('guests')
        .update({ invite_sent: true })
        .eq('id', guest.id)

      setProgress({ current: i + 1, total: selectedGuests.length })

      // Stagger by 500ms
      if (i < selectedGuests.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 500))
      }
    }

    // Save to broadcast history
    const history = JSON.parse(
      localStorage.getItem('momenku_broadcast_history') || '[]'
    )
    history.unshift({
      invitation_id: invitation.id,
      invitation_title: invitation.title,
      guest_count: selectedGuests.length,
      sent_at: new Date().toISOString(),
    })
    localStorage.setItem(
      'momenku_broadcast_history',
      JSON.stringify(history.slice(0, 50))
    )

    toast.success({
      title: 'Berhasil!',
      description: `Mengirim ke ${selectedGuests.length} tamu via WhatsApp`,
    })

    setSending(false)
    setProgress({ current: 0, total: 0 })
    setSelected(new Set())
    onSendComplete?.()
  }

  return (
    <div className="space-y-6">
      {/* Message Template */}
      <div className="rounded-2xl border border-stone-200 bg-white p-6">
        <h3 className="text-lg font-semibold text-stone-900 mb-4">
          Pesan Undangan
        </h3>
        <MessageTemplate
          value={message}
          onChange={setMessage}
          sampleData={{
            name: filteredGuests[0]?.name || 'Nama Tamu',
            event_name: invitation.title || '-',
            date: formatDate(invitation.event_date),
            url: invitationUrl,
            rsvp_url: rsvpUrl,
          }}
        />
      </div>

      {/* Guest List */}
      <div className="rounded-2xl border border-stone-200 bg-white p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <h3 className="text-lg font-semibold text-stone-900">
            Daftar Tamu
          </h3>

          {/* Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-stone-400" />
            {(['all', 'not_sent', 'sent'] as FilterType[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  filter === f
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                }`}
              >
                {f === 'all' ? 'Semua' : f === 'not_sent' ? 'Belum Dikirim' : 'Terkirim'}
              </button>
            ))}
          </div>
        </div>

        {/* Select all / deselect all */}
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={selectAll}
            className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            <CheckSquare className="w-3.5 h-3.5" />
            Pilih Semua
          </button>
          <button
            onClick={deselectAll}
            className="flex items-center gap-1.5 text-xs font-medium text-stone-500 hover:text-stone-700 transition-colors"
          >
            <Square className="w-3.5 h-3.5" />
            Batal Pilih
          </button>
          <span className="text-xs text-stone-400">
            {selected.size} dipilih
          </span>
        </div>

        {/* Guest list */}
        {filteredGuests.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-stone-400">Tidak ada tamu ditemukan</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {filteredGuests.map((guest) => (
              <div
                key={guest.id}
                onClick={() => toggleSelect(guest.id)}
                className={`flex items-center gap-3 rounded-xl border p-3 cursor-pointer transition-all ${
                  selected.has(guest.id)
                    ? 'border-emerald-300 bg-emerald-50'
                    : 'border-stone-100 bg-white hover:border-stone-200'
                }`}
              >
                <div className="flex-shrink-0">
                  {selected.has(guest.id) ? (
                    <CheckSquare className="w-5 h-5 text-emerald-600" />
                  ) : (
                    <Square className="w-5 h-5 text-stone-300" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-stone-800 truncate">
                    {guest.name}
                  </p>
                  <p className="text-xs text-stone-400">
                    {guest.whatsapp_number || guest.phone}
                  </p>
                </div>
                {guest.invite_sent && (
                  <span className="flex-shrink-0 text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                    Terkirim
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Send button */}
      <div className="flex items-center justify-between rounded-2xl border border-stone-200 bg-white p-4">
        {sending ? (
          <div className="flex items-center gap-3">
            <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
            <span className="text-sm text-stone-600">
              Mengirim {progress.current}/{progress.total}...
            </span>
          </div>
        ) : (
          <div className="text-sm text-stone-500">
            {selected.size > 0
              ? `Siap mengirim ke ${selected.size} tamu`
              : 'Pilih tamu untuk mengirim undangan'}
          </div>
        )}

        <button
          onClick={handleSend}
          disabled={selected.size === 0 || sending}
          className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/25 transition-all hover:bg-emerald-700 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-4 h-4" />
          Kirim ke {selected.size} Tamu
        </button>
      </div>
    </div>
  )
}
