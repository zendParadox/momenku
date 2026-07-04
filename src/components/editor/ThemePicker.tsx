'use client'

import { useState, useRef, useEffect } from 'react'
import { useEditorStore } from '@/lib/editor-store'
import { Palette } from 'lucide-react'

const PRESET_COLORS = [
  { name: 'Emerald', value: '#059669' },
  { name: 'Rose', value: '#E11D48' },
  { name: 'Amber', value: '#D97706' },
  { name: 'Blue', value: '#2563EB' },
  { name: 'Purple', value: '#7C3AED' },
  { name: 'Teal', value: '#0D9488' },
  { name: 'Indigo', value: '#4F46E5' },
  { name: 'Slate', value: '#475569' },
]

export default function ThemePicker() {
  const { themeOverrides, setThemeOverrides } = useEditorStore()
  const [open, setOpen] = useState(false)
  const [customColor, setCustomColor] = useState(themeOverrides.primaryColor || '#059669')
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

  const currentColor = themeOverrides.primaryColor || '#059669'

  const handlePresetClick = (color: string) => {
    setThemeOverrides({ ...themeOverrides, primaryColor: color })
    setCustomColor(color)
  }

  const handleCustomChange = (color: string) => {
    setCustomColor(color)
    setThemeOverrides({ ...themeOverrides, primaryColor: color })
  }

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setOpen(!open)}
        className="p-2 text-stone-400 hover:text-white transition-colors"
        title="Warna Tema"
      >
        <Palette className="w-4 h-4" />
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-stone-200 z-50 p-4">
          <p className="text-xs font-semibold text-stone-700 font-[family-name:var(--font-jakarta)] mb-3">
            Warna Utama Tema
          </p>

          {/* Preset colors */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            {PRESET_COLORS.map((preset) => (
              <button
                key={preset.value}
                onClick={() => handlePresetClick(preset.value)}
                className={`w-12 h-12 rounded-full border-2 transition-all flex items-center justify-center ${
                  currentColor === preset.value
                    ? 'border-stone-800 scale-110'
                    : 'border-transparent hover:scale-105'
                }`}
                style={{ backgroundColor: preset.value }}
                title={preset.name}
              >
                {currentColor === preset.value && (
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>

          {/* Custom color */}
          <div className="flex items-center gap-3">
            <label className="text-xs text-stone-500 font-[family-name:var(--font-jakarta)]">
              Kustom:
            </label>
            <input
              type="color"
              value={customColor}
              onChange={(e) => handleCustomChange(e.target.value)}
              className="w-10 h-10 rounded-lg border border-stone-200 cursor-pointer"
            />
            <span className="text-xs text-stone-400 font-mono">{customColor}</span>
          </div>

          {/* Preview */}
          <div
            className="mt-3 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: currentColor }}
          >
            <span className="text-white text-xs font-medium font-[family-name:var(--font-jakarta)]">
              Preview
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
