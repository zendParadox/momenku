'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'gooey-toast'
import { X, Loader2, UserPlus } from 'lucide-react'

interface AddGuestModalProps {
  invitationId: string
  isOpen: boolean
  onClose: () => void
  onGuestAdded: () => void
}

export default function AddGuestModal({
  invitationId,
  isOpen,
  onClose,
  onGuestAdded,
}: AddGuestModalProps) {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [guestCount, setGuestCount] = useState(1)
  const [companionNames, setCompanionNames] = useState('')

  if (!isOpen) return null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) {
      toast.error({ title: 'Nama wajib diisi' })
      return
    }

    setLoading(true)
    const { error } = await supabase.from('guests').insert({
      invitation_id: invitationId,
      name: name.trim(),
      email: email.trim() || null,
      phone: phone.trim() || null,
      whatsapp_number: phone.trim() || null,
      guest_count: guestCount,
      companion_names: companionNames.trim() || null,
      attendance_status: 'pending',
      invite_sent: false,
    })

    setLoading(false)

    if (error) {
      toast.error({ title: 'Gagal menambah tamu', description: error.message })
      return
    }

    toast.success({ title: 'Tamu berhasil ditambahkan' })
    setName('')
    setEmail('')
    setPhone('')
    setGuestCount(1)
    setCompanionNames('')
    onGuestAdded()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-stone-900/20 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
              <UserPlus className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-stone-900">Tambah Tamu</h3>
              <p className="text-xs text-stone-500">Masukkan data tamu baru</p>
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
            <p className="mt-1 text-[11px] text-stone-400">
              Gunakan format internasional: 628123456789
            </p>
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
                <UserPlus className="h-4 w-4" />
              )}
              Tambah Tamu
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
