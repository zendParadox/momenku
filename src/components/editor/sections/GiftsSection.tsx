'use client'

import { useState } from 'react'
import type { GiftsData } from '@/types/editor'

export default function GiftsSection({ data }: { data: GiftsData }) {
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
        <p className="text-emerald-600 text-xs tracking-[0.2em] uppercase font-[family-name:var(--font-jakarta)] mb-2">
          Wedding Gift
        </p>
        <h2 className="font-[family-name:var(--font-cormorant)] text-stone-800 text-3xl font-semibold">
          {data.title}
        </h2>
        <div className="w-12 h-px bg-emerald-300 mx-auto mt-3" />
        <p className="text-stone-500 text-sm mt-4 font-[family-name:var(--font-jakarta)] max-w-sm mx-auto leading-relaxed">
          Tanpa mengurangi rasa hormat, bagi Bapak/Ibu/Saudara/i yang ingin memberikan tanda kasih
          dapat melalui:
        </p>
      </div>

      {/* Gift cards */}
      <div className="space-y-4 max-w-sm mx-auto">
        {data.items.map((item, index) => (
          <div
            key={index}
            className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-5 border border-emerald-100"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center">
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
                <p className="text-stone-800 text-sm font-semibold font-[family-name:var(--font-jakarta)]">
                  {item.name}
                </p>
                <p className="text-stone-500 text-xs font-[family-name:var(--font-jakarta)]">
                  a.n. {item.nameAccount}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between bg-white rounded-xl px-4 py-3">
              <span className="text-stone-800 text-sm font-mono tracking-wider font-[family-name:var(--font-jakarta)]">
                {item.number}
              </span>
              <button
                onClick={() => handleCopy(item.number, index)}
                className="text-emerald-600 text-xs font-medium font-[family-name:var(--font-jakarta)] hover:text-emerald-700 transition-colors"
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
