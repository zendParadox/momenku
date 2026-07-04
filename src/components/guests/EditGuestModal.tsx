'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'gooey-toast'
import { X, Loader2, Save } from 'lucide-react'

interface Guest {
  id: string
  invitation_id: string
  name: string
  email: string | null
  phone: string | null
  whatsapp_number: string | null
  attendance_status: 'pending' | 'attending' | 'not_attending' | 'maybe'
  guest_count: number
  companion_names: string | null
  invite_sent: boolean
  qr_code: string
}

interface EditGuestModalProps {
  guest: Guest
  isOpen: boolean
  onClose: () => void
  onGuestUpdated: () => void
}

export default function EditGuestModal({
  guest,
  isOpen,
  onClose,
  onGuestUpdated,
}: EditGuestModalProps) {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [guestCount, setGuestCount] = useState(1)
  const [companionNames, setCompanionNames] = useState('')
  const [attendanceStatus, setAttendanceStatus] = useState<string>('pending')

  useEffect(() => {
    if (guest) {
      setName(guest.name)
      setEmail(guest.email || '')
      setPhone(guest.phone || guest.whatsapp_number || '')
      setGuestCount(guest.guest_count)
      setCompanionNames(guest.companion_names || '')
      setAttendanceStatus(guest.attendance_status)
    }
  }, [guest])

  if (!isOpen) return null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) {
      toast.error({ title: 'Nama wajib diisi' })
      return
    }

    setLoading(true)
    const { error } = await supabase
      .from('guests')
      .update({
        name: name.trim(),
        email: email.trim() || null,
        phone: phone.trim() || null,
        whatsapp_number: phone.trim() || null,
        guest_count: guestCount,
        companion_names: companionNames.trim() || null,
        attendance_status: attendanceStatus,
      })
      .eq('id', guest.id)

    setLoading(false)

    if (error) {
      toast.error({ title: 'Gagal mengupdate tamu', description: error.message })
      return
    }

    toast.success({ title: 'Tamu berhasil diupdate' })
    onGuestUpdated()
    onClose()
  }

  const statusOptions = [
    { value: 'pending', label: 'Belum RSVP' },
    { value: 'attending', label: 'Hadir' },
    { value: 'not_attending', label: 'Tidak Hadir' },
    { value: 'maybe', label: 'Mungkin' },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-stone-900/20 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
              <Save className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-stone-900">Edit Tamu</h3>
              <p className="text-xs text-stone-500">Perbarui data tamu</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="mb-1 block text-xs font-medium text-stone-600">
              Nama <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm text-stone-700 focus:border-emerald-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-100"
              placeholder="Nama lengkap tamu"
              autoFocus
            />
          </div>

          {/* Attendance status */}
          <div>
            <label className="mb-1 block text-xs font-medium text-stone-600">
              Status RSVP
            </label>
            <select
              value={attendanceStatus}
              onChange={(e) => setAttendanceStatus(e.target.value)}
              className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm text-stone-700 focus:border-emerald-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-100"
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Email */}
          <div>
            <label className="mb-1 block text-xs font-medium text-stone-600">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm text-stone-700 focus:border-emerald-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-100"
              placeholder="email@contoh.com"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="mb-1 block text-xs font-medium text-stone-600">
              No. HP / WhatsApp
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm text-stone-700 focus:border-emerald-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-100"
              placeholder="628123456789"
            />
          </div>

          {/* Guest count */}
          <div>
            <label className="mb-1 block text-xs font-medium text-stone-600">
              Jumlah Tamu
            </label>
            <input
              type="number"
              min={1}
              max={20}
              value={guestCount}
              onChange={(e) => setGuestCount(Number(e.target.value))}
              className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm text-stone-700 focus:border-emerald-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          {/* Companion names */}
          <div>
            <label className="mb-1 block text-xs font-medium text-stone-600">
              Nama Pendamping
            </label>
            <textarea
              value={companionNames}
              onChange={(e) => setCompanionNames(e.target.value)}
              rows={2}
              className="w-full resize-none rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm text-stone-700 focus:border-emerald-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-100"
              placeholder="Pisahkan dengan koma: Budi, Sari"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-100"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
