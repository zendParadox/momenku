'use client'

import { useState } from 'react'
import { toast } from 'gooey-toast'
import { Loader2, Minus, Plus } from 'lucide-react'
import type { RsvpData } from '@/types/editor'

interface RsvpFormProps {
  invitationId: string
  guestName?: string
  guestId?: string
  rsvpData?: RsvpData
  onSuccess: (data: {
    guest_name: string
    attendance_status: string
  }) => void
  themePrimary?: string
  themeFontHeading?: string
  themeFontBody?: string
}

export default function RsvpForm({
  invitationId,
  guestName = '',
  guestId,
  rsvpData,
  onSuccess,
  themePrimary = '#059669',
  themeFontHeading = 'var(--font-cormorant)',
  themeFontBody = 'var(--font-jakarta)',
}: RsvpFormProps) {
  const [name, setName] = useState(guestName)
  const [attendance, setAttendance] = useState<string>('')
  const [guestCount, setGuestCount] = useState(1)
  const [companionNames, setCompanionNames] = useState('')
  const [wishMessage, setWishMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const attendanceOptions = [
    { value: 'attending', label: 'Hadir', emoji: '✅', description: 'Saya akan hadir' },
    { value: 'not_attending', label: 'Tidak Hadir', emoji: '❌', description: 'Maaf tidak bisa hadir' },
    { value: 'maybe', label: 'Masih Ragu', emoji: '🤔', description: 'Belum bisa pastikan' },
  ]

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!name.trim()) {
      toast.error({ title: 'Nama wajib diisi' })
      return
    }
    if (!attendance) {
      toast.error({ title: 'Pilih status kehadiran' })
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invitation_id: invitationId,
          guest_id: guestId || null,
          guest_name: name.trim(),
          attendance_status: attendance,
          guest_count: attendance === 'attending' ? guestCount : 1,
          companion_names: companionNames.trim() || null,
          wish_message: wishMessage.trim() || null,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Gagal mengirim RSVP')
      }

      toast.success({ title: 'RSVP berhasil dikirim!' })
      onSuccess({
        guest_name: name.trim(),
        attendance_status: attendance,
      })
    } catch (err) {
      toast.error({
        title: 'Gagal mengirim',
        description: err instanceof Error ? err.message : 'Terjadi kesalahan',
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Title */}
      <div className="text-center mb-6">
        <p
          className="text-xs tracking-[0.2em] uppercase mb-2"
          style={{ color: themePrimary, fontFamily: themeFontBody }}
        >
          RSVP
        </p>
        <h2
          className="text-3xl font-semibold"
          style={{ color: '#1c1917', fontFamily: themeFontHeading }}
        >
          {rsvpData?.title || 'Konfirmasi Kehadiran'}
        </h2>
        <div
          className="w-12 h-px mx-auto mt-3"
          style={{ backgroundColor: themePrimary, opacity: 0.5 }}
        />
        <p
          className="text-sm mt-4 max-w-sm mx-auto leading-relaxed"
          style={{ color: '#78716c', fontFamily: themeFontBody }}
        >
          {rsvpData?.description || 'Merupakan kehormatan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu.'}
        </p>
      </div>

      {/* Name */}
      <div>
        <label
          className="block text-xs font-medium mb-1.5"
          style={{ color: '#57534e', fontFamily: themeFontBody }}
        >
          Nama Lengkap *
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all"
          style={{
            fontFamily: themeFontBody,
            borderColor: '#e7e5e4',
            '--tw-ring-color': themePrimary,
          } as React.CSSProperties}
          placeholder="Masukkan nama lengkap"
          required
        />
      </div>

      {/* Attendance */}
      <div>
        <label
          className="block text-xs font-medium mb-2"
          style={{ color: '#57534e', fontFamily: themeFontBody }}
        >
          Kehadiran *
        </label>
        <div className="grid grid-cols-3 gap-2">
          {attendanceOptions.map((opt) => {
            const isActive = attendance === opt.value
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => setAttendance(opt.value)}
                className="flex flex-col items-center gap-1 py-3 px-2 rounded-xl border-2 text-center transition-all"
                style={{
                  fontFamily: themeFontBody,
                  ...(isActive
                    ? {
                        backgroundColor: themePrimary,
                        borderColor: themePrimary,
                        color: 'white',
                      }
                    : {
                        backgroundColor: 'white',
                        borderColor: '#e7e5e4',
                        color: '#57534e',
                      }),
                }}
              >
                <span className="text-xl">{opt.emoji}</span>
                <span className="text-xs font-semibold">{opt.label}</span>
                <span
                  className="text-[10px] leading-tight"
                  style={{ opacity: isActive ? 0.9 : 0.6 }}
                >
                  {opt.description}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Guest count (only if attending) */}
      {attendance === 'attending' && (
        <div>
          <label
            className="block text-xs font-medium mb-1.5"
            style={{ color: '#57534e', fontFamily: themeFontBody }}
          >
            Jumlah Tamu
          </label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
              className="w-10 h-10 rounded-xl border flex items-center justify-center transition-colors"
              style={{ borderColor: '#e7e5e4', color: '#57534e' }}
            >
              <Minus className="w-4 h-4" />
            </button>
            <span
              className="w-12 text-center text-lg font-bold"
              style={{ color: '#1c1917', fontFamily: themeFontBody }}
            >
              {guestCount}
            </span>
            <button
              type="button"
              onClick={() => setGuestCount(Math.min(10, guestCount + 1))}
              className="w-10 h-10 rounded-xl border flex items-center justify-center transition-colors"
              style={{ borderColor: '#e7e5e4', color: '#57534e' }}
            >
              <Plus className="w-4 h-4" />
            </button>
            <span
              className="text-xs ml-1"
              style={{ color: '#78716c', fontFamily: themeFontBody }}
            >
              orang
            </span>
          </div>
        </div>
      )}

      {/* Companion names (only if attending and > 1) */}
      {attendance === 'attending' && guestCount > 1 && (
        <div>
          <label
            className="block text-xs font-medium mb-1.5"
            style={{ color: '#57534e', fontFamily: themeFontBody }}
          >
            Nama Teman/Keluarga yang Ikut
          </label>
          <textarea
            value={companionNames}
            onChange={(e) => setCompanionNames(e.target.value)}
            rows={2}
            className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all resize-none"
            style={{
              fontFamily: themeFontBody,
              borderColor: '#e7e5e4',
              '--tw-ring-color': themePrimary,
            } as React.CSSProperties}
            placeholder="Budi, Sari, ..."
          />
        </div>
      )}

      {/* Wish message */}
      <div>
        <label
          className="block text-xs font-medium mb-1.5"
          style={{ color: '#57534e', fontFamily: themeFontBody }}
        >
          Ucapan & Doa
        </label>
        <textarea
          value={wishMessage}
          onChange={(e) => setWishMessage(e.target.value)}
          rows={3}
          className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all resize-none"
          style={{
            fontFamily: themeFontBody,
            borderColor: '#e7e5e4',
            '--tw-ring-color': themePrimary,
          } as React.CSSProperties}
          placeholder="Tulis ucapan atau doa..."
        />
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3 rounded-xl text-white text-sm font-semibold transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        style={{
          backgroundColor: themePrimary,
          fontFamily: themeFontBody,
        }}
      >
        {submitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Mengirim...
          </>
        ) : (
          'Kirim RSVP'
        )}
      </button>
    </form>
  )
}
