'use client'

import { useState } from 'react'
import { toast } from 'gooey-toast'
import { Loader2, Send } from 'lucide-react'

interface WishFormProps {
  invitationId: string
  onWishSubmitted: (wish: {
    id: string
    guest_name: string
    message: string
    created_at: string
  }) => void
  themePrimary?: string
  themeFontBody?: string
}

export default function WishForm({
  invitationId,
  onWishSubmitted,
  themePrimary = '#059669',
  themeFontBody = 'var(--font-jakarta)',
}: WishFormProps) {
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!name.trim()) {
      toast.error({ title: 'Nama wajib diisi' })
      return
    }
    if (!message.trim()) {
      toast.error({ title: 'Pesan wajib diisi' })
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/wishes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invitation_id: invitationId,
          guest_name: name.trim(),
          message: message.trim(),
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Gagal mengirim ucapan')
      }

      toast.success({ title: 'Ucapan berhasil dikirim!' })
      onWishSubmitted(data.wish)
      setName('')
      setMessage('')
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
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
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
          placeholder="Nama Anda"
          required
        />
      </div>
      <div>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          className="w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all resize-none"
          style={{
            fontFamily: themeFontBody,
            borderColor: '#e7e5e4',
            '--tw-ring-color': themePrimary,
          } as React.CSSProperties}
          placeholder="Tulis ucapan atau doa..."
          required
        />
      </div>
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
          <>
            <Send className="w-4 h-4" />
            Kirim Ucapan
          </>
        )}
      </button>
    </form>
  )
}
