'use client'

import { useState, useRef, useEffect } from 'react'
import { useEditorStore } from '@/lib/editor-store'
import { Type } from 'lucide-react'

const FONT_PAIRS = [
  {
    heading: 'Cormorant Garamond',
    body: 'Plus Jakarta Sans',
    label: 'Elegan',
    preview: 'Aa',
  },
  {
    heading: 'Playfair Display',
    body: 'Lora',
    label: 'Klasik',
    preview: 'Aa',
  },
  {
    heading: 'Cinzel',
    body: 'Crimson Text',
    label: 'Royal',
    preview: 'Aa',
  },
  {
    heading: 'Great Vibes',
    body: 'Nunito',
    label: 'Script',
    preview: 'Aa',
  },
  {
    heading: 'Inter',
    body: 'Inter',
    label: 'Minimal',
    preview: 'Aa',
  },
  {
    heading: 'IBM Plex Sans',
    body: 'IBM Plex Sans',
    label: 'Korporat',
    preview: 'Aa',
  },
]

export default function FontPicker() {
  const { themeOverrides, setThemeOverrides } = useEditorStore()
  const [open, setOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  const currentHeading = themeOverrides.fontHeading || 'Cormorant Garamond'
  const currentBody = themeOverrides.fontBody || 'Plus Jakarta Sans'

  const handleFontSelect = (heading: string, body: string) => {
    setThemeOverrides({ ...themeOverrides, fontHeading: heading, fontBody: body })
  }

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setOpen(!open)}
        className="p-2 text-stone-400 hover:text-white transition-colors"
        title="Pilih Font"
      >
        <Type className="w-4 h-4" />
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-stone-200 z-50 p-4 max-h-[400px] overflow-y-auto">
          <p className="text-xs font-semibold text-stone-700 font-[family-name:var(--font-jakarta)] mb-3">
            Pilihan Font
          </p>

          <div className="space-y-2">
            {FONT_PAIRS.map((pair, idx) => {
              const isSelected = currentHeading === pair.heading && currentBody === pair.body
              return (
                <button
                  key={idx}
                  onClick={() => handleFontSelect(pair.heading, pair.body)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    isSelected
                      ? 'border-emerald-300 bg-emerald-50'
                      : 'border-stone-100 hover:border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-stone-600 font-[family-name:var(--font-jakarta)]">
                      {pair.label}
                    </span>
                    {isSelected && (
                      <span className="text-[10px] text-emerald-600 font-[family-name:var(--font-jakarta)] font-semibold">
                        Aktif
                      </span>
                    )}
                  </div>
                  <p
                    className="text-xl text-stone-800 leading-tight"
                    style={{ fontFamily: pair.heading }}
                  >
                    {pair.heading}
                  </p>
                  <p
                    className="text-xs text-stone-500 mt-0.5"
                    style={{ fontFamily: pair.body }}
                  >
                    {pair.body}
                  </p>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
