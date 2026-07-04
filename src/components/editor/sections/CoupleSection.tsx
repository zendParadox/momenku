'use client'

import type { CoupleData } from '@/types/editor'
import InlineEditable from '../InlineEditable'

export default function CoupleSection({
  data,
  sectionId,
  onUpdate,
}: {
  data: CoupleData
  sectionId: string
  onUpdate: (data: Partial<CoupleData>) => void
}) {
  return (
    <div
      className="w-full py-12 px-6"
      style={{
        background: 'linear-gradient(to bottom, color-mix(in srgb, var(--theme-primary, #059669) 5%, white), white)',
      }}
    >
      {/* Decorative top */}
      <div className="text-center mb-8">
        <svg
          className="mx-auto"
          width="60"
          height="30"
          viewBox="0 0 60 30"
          fill="none"
          style={{ color: 'var(--theme-primary, #059669)' }}
        >
          <path
            d="M30 28 C30 28 4 16 4 8 C4 2 10 0 15 4 C20 8 25 14 30 18 C35 14 40 8 45 4 C50 0 56 2 56 8 C56 16 30 28 30 28Z"
            fill="currentColor"
            opacity="0.3"
          />
        </svg>
      </div>

      {/* Couple photo */}
      {data.photo && (
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div
              className="w-40 h-40 rounded-full overflow-hidden shadow-lg"
              style={{ border: '4px solid var(--theme-primary, #059669)', opacity: 0.8 }}
            >
              <img
                src={data.photo}
                alt="Couple"
                className="w-full h-full object-cover"
              />
            </div>
            <div
              className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-white px-3 py-1 rounded-full text-xs"
              style={{
                backgroundColor: 'var(--theme-primary, #059669)',
                fontFamily: 'var(--theme-font-body)',
              }}
            >
              ♥
            </div>
          </div>
        </div>
      )}

      {/* Names */}
      <div className="text-center space-y-6">
        {/* Groom */}
        <div>
          <h3
            className="text-3xl font-semibold"
            style={{
              fontFamily: 'var(--theme-font-heading)',
              color: 'color-mix(in srgb, var(--theme-primary, #059669) 80%, black)',
            }}
          >
            <InlineEditable
              value={data.groomName}
              onChange={(v) => onUpdate({ groomName: v })}
              tag="h3"
              className="text-3xl font-semibold"
              placeholder="Nama Mempelai Pria"
            />
          </h3>
          <p
            className="text-stone-500 text-sm mt-1"
            style={{ fontFamily: 'var(--theme-font-body)' }}
          >
            <InlineEditable
              value={data.groomParents}
              onChange={(v) => onUpdate({ groomParents: v })}
              tag="p"
              className="text-stone-500 text-sm mt-1"
              placeholder="Orang Tua Pria"
            />
          </p>
        </div>

        {/* Ampersand */}
        <div className="flex items-center justify-center gap-4">
          <div className="w-16 h-px" style={{ backgroundColor: 'var(--theme-primary, #059669)', opacity: 0.3 }} />
          <span
            className="text-3xl"
            style={{
              fontFamily: 'var(--theme-font-heading)',
              color: 'var(--theme-primary, #059669)',
              opacity: 0.5,
            }}
          >
            &
          </span>
          <div className="w-16 h-px" style={{ backgroundColor: 'var(--theme-primary, #059669)', opacity: 0.3 }} />
        </div>

        {/* Bride */}
        <div>
          <h3
            className="text-3xl font-semibold"
            style={{
              fontFamily: 'var(--theme-font-heading)',
              color: 'color-mix(in srgb, var(--theme-primary, #059669) 80%, black)',
            }}
          >
            <InlineEditable
              value={data.brideName}
              onChange={(v) => onUpdate({ brideName: v })}
              tag="h3"
              className="text-3xl font-semibold"
              placeholder="Nama Mempelai Wanita"
            />
          </h3>
          <p
            className="text-stone-500 text-sm mt-1"
            style={{ fontFamily: 'var(--theme-font-body)' }}
          >
            <InlineEditable
              value={data.brideParents}
              onChange={(v) => onUpdate({ brideParents: v })}
              tag="p"
              className="text-stone-500 text-sm mt-1"
              placeholder="Orang Tua Wanita"
            />
          </p>
        </div>
      </div>

      {/* Decorative bottom */}
      <div className="text-center mt-8">
        <div className="flex items-center justify-center gap-3">
          <div className="w-8 h-px" style={{ backgroundColor: 'var(--theme-primary, #059669)', opacity: 0.3 }} />
          <span
            className="text-xs"
            style={{ color: 'var(--theme-primary, #059669)', opacity: 0.5 }}
          >
            ✦
          </span>
          <div className="w-8 h-px" style={{ backgroundColor: 'var(--theme-primary, #059669)', opacity: 0.3 }} />
        </div>
      </div>
    </div>
  )
}
