'use client'

import { useState } from 'react'
import type { GiftsData } from '@/types/editor'
export default function GiftsSection({ data, sectionId, onUpdate }: { data: GiftsData; sectionId: string; onUpdate: (data: Partial<GiftsData>) => void }) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const handleCopy = (number: string, index: number) => {
    navigator.clipboard.writeText(number)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  return (
    <div className="w-full bg-white py-12 px-6">
      {/* Title */}
      <div className="text-center mb-8">
        <p
          className="text-xs tracking-[0.2em] uppercase mb-2"
          style={{
            color: 'var(--theme-primary, #059669)',
            fontFamily: 'var(--theme-font-body)',
          }}
        >
          Wedding Gift
        </p>
        <h2
          className="text-stone-800 text-3xl font-semibold"
          style={{ fontFamily: 'var(--theme-font-heading)' }}
        >
          {data.title}
        </h2>
        <div
          className="w-12 h-px mx-auto mt-3"
          style={{ backgroundColor: 'var(--theme-primary, #059669)', opacity: 0.5 }}
        />
        <p
          className="text-stone-500 text-sm mt-4 max-w-sm mx-auto leading-relaxed"
          style={{ fontFamily: 'var(--theme-font-body)' }}
        >
          Tanpa mengurangi rasa hormat, bagi Bapak/Ibu/Saudara/i yang ingin memberikan tanda kasih
          dapat melalui:
        </p>
      </div>

      {/* Gift cards */}
      <div className="space-y-4 max-w-sm mx-auto">
        {data.items.map((item, index) => (
          <div
            key={index}
            className="rounded-2xl p-5 border"
            style={{
              background: `linear-gradient(to bottom right, color-mix(in srgb, var(--theme-primary, #059669) 5%, white), color-mix(in srgb, var(--theme-primary, #059669) 8%, white))`,
              borderColor: 'color-mix(in srgb, var(--theme-primary, #059669) 20%, white)',
            }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: 'var(--theme-primary, #059669)' }}
              >
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                  />
                </svg>
              </div>
              <div>
                <p
                  className="text-stone-800 text-sm font-semibold"
                  style={{ fontFamily: 'var(--theme-font-body)' }}
                >
                  {item.name}
                </p>
                <p
                  className="text-stone-500 text-xs"
                  style={{ fontFamily: 'var(--theme-font-body)' }}
                >
                  a.n. {item.nameAccount}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between bg-white rounded-xl px-4 py-3">
              <span
                className="text-stone-800 text-sm font-mono tracking-wider"
                style={{ fontFamily: 'var(--theme-font-body)' }}
              >
                {item.number}
              </span>
              <button
                onClick={() => handleCopy(item.number, index)}
                className="text-xs font-medium transition-colors"
                style={{
                  color: 'var(--theme-primary, #059669)',
                  fontFamily: 'var(--theme-font-body)',
                }}
              >
                {copiedIndex === index ? '✓ Tersalin' : 'Salin'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
