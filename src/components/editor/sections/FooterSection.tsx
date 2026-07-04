'use client'

import type { FooterData } from '@/types/editor'
import InlineEditable from '../InlineEditable'

export default function FooterSection({
  data,
  sectionId,
  onUpdate,
}: {
  data: FooterData
  sectionId: string
  onUpdate: (data: Partial<FooterData>) => void
}) {
  return (
    <div
      className="w-full py-16 px-6"
      style={{
        background: 'linear-gradient(to bottom, color-mix(in srgb, var(--theme-primary, #059669) 5%, white), color-mix(in srgb, var(--theme-primary, #059669) 10%, white))',
      }}
    >
      {/* Decorative top */}
      <div className="text-center mb-8">
        <svg
          className="mx-auto"
          width="60"
          height="40"
          viewBox="0 0 60 40"
          fill="none"
          style={{ color: 'var(--theme-primary, #059669)', opacity: 0.4 }}
        >
          <path
            d="M30 36 C30 36 4 22 4 12 C4 4 10 2 16 6 C22 10 27 18 30 22 C33 18 38 10 44 6 C50 2 56 4 56 12 C56 22 30 36 30 36Z"
            fill="currentColor"
            opacity="0.3"
          />
        </svg>
      </div>

      {/* Message */}
      <div className="text-center max-w-sm mx-auto">
        <p
          className="text-stone-600 text-sm leading-relaxed italic"
          style={{ fontFamily: 'var(--theme-font-body)' }}
        >
          &ldquo;<InlineEditable
            value={data.message}
            onChange={(v) => onUpdate({ message: v })}
            tag="span"
            className="text-stone-600 text-sm leading-relaxed italic"
            placeholder="Pesan penutup..."
            multiline
          />&rdquo;
        </p>
      </div>

      {/* Couple names */}
      <div className="text-center mt-8">
        <p
          className="text-3xl"
          style={{
            fontFamily: 'var(--theme-font-heading)',
            color: 'var(--theme-primary, #059669)',
          }}
        >
          <InlineEditable
            value={data.coupleNames}
            onChange={(v) => onUpdate({ coupleNames: v })}
            tag="p"
            className="text-3xl"
            placeholder="Rina & Budi"
          />
        </p>
      </div>

      {/* Decorative bottom */}
      <div className="text-center mt-8">
        <div className="flex items-center justify-center gap-3">
          <div className="w-12 h-px" style={{ backgroundColor: 'var(--theme-primary, #059669)', opacity: 0.3 }} />
          <span className="text-lg" style={{ color: 'var(--theme-primary, #059669)', opacity: 0.6 }}>♥</span>
          <div className="w-12 h-px" style={{ backgroundColor: 'var(--theme-primary, #059669)', opacity: 0.3 }} />
        </div>
        <p
          className="text-stone-400 text-xs mt-4"
          style={{ fontFamily: 'var(--theme-font-body)' }}
        >
          Made with MomenKu
        </p>
      </div>
    </div>
  )
}
