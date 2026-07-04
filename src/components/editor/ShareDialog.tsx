'use client'

import { useState, useEffect, useRef } from 'react'
import { X, Copy, ExternalLink, MessageCircle } from 'lucide-react'
import { toast } from 'gooey-toast'
import QRCode from 'qrcode'

interface ShareDialogProps {
  open: boolean
  onClose: () => void
  invitationId: string
}

export default function ShareDialog({
  open,
  onClose,
  invitationId,
}: ShareDialogProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [qrDataUrl, setQrDataUrl] = useState<string>('')
  const dialogRef = useRef<HTMLDivElement>(null)

  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const inviteUrl = `${origin}/i/${invitationId}`
  const rsvpUrl = `${origin}/rsvp/${invitationId}`

  // Generate QR code
  useEffect(() => {
    if (!open || !inviteUrl) return
    QRCode.toDataURL(inviteUrl, {
      width: 160,
      margin: 2,
      color: {
        dark: '#1c1917',
        light: '#ffffff',
      },
    }).then((url) => setQrDataUrl(url))
  }, [open, inviteUrl])

  // Close on escape
  useEffect(() => {
    if (!open) return
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [open, onClose])

  if (!open) return null

  const handleCopy = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(field)
      toast.success({ title: 'Tersalin!' })
      setTimeout(() => setCopiedField(null), 2000)
    } catch {
      toast.error({ title: 'Gagal menyalin' })
    }
  }

  const handleWhatsApp = () => {
    const text = encodeURIComponent(
      `💌 Undangan Pernikahan\n\nYuk buka undangan digital kami!\n\n${inviteUrl}\n\nMerupakan suatu kehormatan apabila Bapak/Ibu/Saudara/i berkenan hadir. 🙏`
    )
    window.open(`https://wa.me/?text=${text}`, '_blank')
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Dialog */}
      <div
        ref={dialogRef}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-2">
          <div>
            <h2
              className="text-lg font-semibold text-stone-900"
              style={{ fontFamily: 'var(--font-jakarta)' }}
            >
              Bagikan Undangan
            </h2>
            <p
              className="text-sm text-stone-500"
              style={{ fontFamily: 'var(--font-jakarta)' }}
            >
              Kirim undangan ke tamu Anda
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 pb-6 pt-4 space-y-5">
          {/* QR Code */}
          <div className="flex justify-center">
            <div className="bg-white rounded-xl border border-stone-200 p-3 shadow-sm">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="QR Code Undangan"
                  className="w-[160px] h-[160px]"
                />
              ) : (
                <div className="w-[160px] h-[160px] flex items-center justify-center bg-stone-50 rounded-lg">
                  <div className="w-5 h-5 border-2 border-stone-300 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
          </div>

          {/* Invitation URL */}
          <div>
            <label
              className="text-xs font-medium text-stone-500 mb-1.5 block"
              style={{ fontFamily: 'var(--font-jakarta)' }}
            >
              Link Undangan
            </label>
            <div className="flex gap-2">
              <div className="flex-1 min-w-0 px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-700 truncate font-mono">
                {inviteUrl}
              </div>
              <button
                onClick={() => handleCopy(inviteUrl, 'invite')}
                className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2.5 border border-emerald-300 text-emerald-700 rounded-xl text-sm font-medium hover:bg-emerald-50 transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
                {copiedField === 'invite' ? '✓' : 'Salin'}
              </button>
            </div>
          </div>

          {/* RSVP URL */}
          <div>
            <label
              className="text-xs font-medium text-stone-500 mb-1.5 block"
              style={{ fontFamily: 'var(--font-jakarta)' }}
            >
              Link RSVP
            </label>
            <div className="flex gap-2">
              <div className="flex-1 min-w-0 px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-700 truncate font-mono">
                {rsvpUrl}
              </div>
              <button
                onClick={() => handleCopy(rsvpUrl, 'rsvp')}
                className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2.5 border border-emerald-300 text-emerald-700 rounded-xl text-sm font-medium hover:bg-emerald-50 transition-colors"
              >
                <Copy className="w-3.5 h-3.5" />
                {copiedField === 'rsvp' ? '✓' : 'Salin'}
              </button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 pt-1">
            {/* WhatsApp */}
            <button
              onClick={handleWhatsApp}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:scale-[1.02] shadow-sm"
              style={{
                backgroundColor: '#25D366',
                fontFamily: 'var(--font-jakarta)',
              }}
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </button>

            {/* Lihat Undangan */}
            <a
              href={`/i/${invitationId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border border-stone-200 text-stone-700 hover:bg-stone-50 transition-colors"
              style={{ fontFamily: 'var(--font-jakarta)' }}
            >
              <ExternalLink className="w-4 h-4" />
              Lihat Undangan
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
