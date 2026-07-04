'use client'

import { useState } from 'react'
import { toast } from 'gooey-toast'
import { X, Send, Copy, Check } from 'lucide-react'
import QrCode from './QrCode'

interface Guest {
  id: string
  name: string
  phone: string | null
  whatsapp_number: string | null
  qr_code: string
}

interface SendWaModalProps {
  guest: Guest
  invitationTitle: string
  invitationSlug: string
  isOpen: boolean
  onClose: () => void
}

export default function SendWaModal({
  guest,
  invitationTitle,
  invitationSlug,
  isOpen,
  onClose,
}: SendWaModalProps) {
  const [copied, setCopied] = useState(false)

  if (!isOpen) return null

  const baseUrl = 'https://momenku-two.vercel.app'
  const invitationUrl = `${baseUrl}/${invitationSlug}`
  const rsvpUrl = `${baseUrl}/guest/${guest.qr_code}`
  const phone = guest.whatsapp_number || guest.phone || ''

  const message = `Halo ${guest.name}! Anda diundang ke ${invitationTitle}. Lihat undangan: ${invitationUrl}. Konfirmasi kehadiran: ${rsvpUrl}`

  const encodedMessage = encodeURIComponent(message)
  const waUrl = phone
    ? `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodedMessage}`
    : `https://wa.me/?text=${encodedMessage}`

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(message)
      setCopied(true)
      toast.success({ title: 'Pesan berhasil disalin' })
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error({ title: 'Gagal menyalin pesan' })
    }
  }

  function handleSendWhatsApp() {
    window.open(waUrl, '_blank')
    toast.info({ title: 'WhatsApp dibuka', description: 'Kirim pesan di jendela WhatsApp' })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-stone-900/20 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
              <Send className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-stone-900">Kirim Undangan</h3>
              <p className="text-xs text-stone-500">Kirim via WhatsApp ke {guest.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* QR Code */}
        <div className="mb-5 flex justify-center">
          <div className="rounded-xl border border-stone-100 bg-stone-50 p-3">
            <QrCode value={rsvpUrl} size={120} />
          </div>
        </div>

        {/* Message preview */}
        <div className="mb-4 rounded-xl border border-stone-200 bg-stone-50 p-4">
          <p className="mb-1 text-[11px] font-medium uppercase tracking-wider text-stone-400">
            Preview Pesan
          </p>
          <p className="text-sm leading-relaxed text-stone-700">{message}</p>
        </div>

        {/* Phone info */}
        {phone && (
          <p className="mb-4 text-xs text-stone-500">
            Tujuan:{' '}
            <span className="font-medium text-stone-700">{phone}</span>
          </p>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleCopy}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-100"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-emerald-600" />
                Tersalin!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Salin Pesan
              </>
            )}
          </button>
          <button
            onClick={handleSendWhatsApp}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700"
          >
            <Send className="h-4 w-4" />
            Kirim via WhatsApp
          </button>
        </div>
      </div>
    </div>
  )
}
