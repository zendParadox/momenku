'use client'

import { useState, useRef, useEffect } from 'react'

const VARIABLES = [
  { key: '{name}', label: 'Nama Tamu' },
  { key: '{event_name}', label: 'Nama Acara' },
  { key: '{date}', label: 'Tanggal' },
  { key: '{url}', label: 'URL Undangan' },
  { key: '{rsvp_url}', label: 'URL RSVP' },
]

const DEFAULT_TEMPLATE = `Halo {name}! 💕

Kami mengundang Anda ke acara pernikahan:
📅 {event_name}
📆 {date}

Lihat undangan: {url}
Konfirmasi kehadiran: {rsvp_url}

Merupakan kehormatan bagi kami apabila Anda berkenan hadir. 🙏`

interface MessageTemplateProps {
  value: string
  onChange: (val: string) => void
  sampleData?: {
    name: string
    event_name: string
    date: string
    url: string
    rsvp_url: string
  }
}

export default function MessageTemplate({
  value,
  onChange,
  sampleData,
}: MessageTemplateProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [showPreview, setShowPreview] = useState(false)

  const sample = sampleData || {
    name: 'Budi Santoso',
    event_name: 'Pernikahan Rina & Budi',
    date: '25 Desember 2025',
    url: 'https://momenku.app/invitation/abc123',
    rsvp_url: 'https://momenku.app/invitation/abc123?rsvp=true',
  }

  const preview = Object.entries(sample).reduce(
    (acc, [key, val]) => acc.replace(new RegExp(`\\{${key}\\}`, 'g'), val),
    value
  )

  function insertVariable(variable: string) {
    const ta = textareaRef.current
    if (!ta) return
    const start = ta.selectionStart
    const end = ta.selectionEnd
    const newVal = value.slice(0, start) + variable + value.slice(end)
    onChange(newVal)
    // Reset cursor position after insert
    setTimeout(() => {
      ta.focus()
      ta.selectionStart = ta.selectionEnd = start + variable.length
    }, 0)
  }

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('momenku_broadcast_template')
    if (saved) {
      onChange(saved)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem('momenku_broadcast_template', value)
  }, [value])

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-stone-700">
          Pesan Undangan
        </label>
        <button
          type="button"
          onClick={() => setShowPreview(!showPreview)}
          className="text-xs font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
        >
          {showPreview ? 'Sembunyikan Preview' : 'Lihat Preview'}
        </button>
      </div>

      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={8}
        className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-800 placeholder:text-stone-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 resize-none font-mono"
        placeholder="Ketik pesan undangan..."
      />

      {/* Variable buttons */}
      <div className="flex flex-wrap gap-2">
        {VARIABLES.map((v) => (
          <button
            key={v.key}
            type="button"
            onClick={() => insertVariable(v.key)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-stone-200 bg-stone-50 px-2.5 py-1.5 text-xs font-medium text-stone-600 transition-colors hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
          >
            <span className="text-emerald-500 font-mono text-[10px]">{v.key}</span>
            <span>{v.label}</span>
          </button>
        ))}
      </div>

      {/* Live preview */}
      {showPreview && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-medium text-emerald-700">Preview Pesan</span>
          </div>
          <p className="text-sm text-stone-800 whitespace-pre-wrap leading-relaxed">
            {preview}
          </p>
        </div>
      )}
    </div>
  )
}
