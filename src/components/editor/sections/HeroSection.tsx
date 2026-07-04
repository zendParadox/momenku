'use client'

import type { HeroData } from '@/types/editor'

export default function HeroSection({ data }: { data: HeroData }) {
  return (
    <div className="relative w-full min-h-[520px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      {data.backgroundImage ? (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${data.backgroundImage})` }}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-600" />
      )}

      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black"
        style={{ opacity: data.overlayOpacity }}
      />

      {/* Decorative elements */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-amber-300/60 to-transparent" />
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-amber-300/60 to-transparent" />

      {/* Content */}
      <div className="relative z-10 text-center px-6 py-12">
        <p className="text-amber-200/80 text-sm tracking-[0.3em] uppercase font-[family-name:var(--font-jakarta)] mb-4">
          Wedding Invitation
        </p>

        {/* Decorative flourish */}
        <svg
          className="mx-auto mb-6 text-amber-300/50"
          width="80"
          height="24"
          viewBox="0 0 80 24"
          fill="none"
        >
          <path
            d="M0 12 C20 12 20 2 40 2 C60 2 60 12 80 12"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
          />
          <path
            d="M0 12 C20 12 20 22 40 22 C60 22 60 12 80 12"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
          />
          <circle cx="40" cy="12" r="2" fill="currentColor" />
        </svg>

        <h1 className="font-[family-name:var(--font-cormorant)] text-white text-4xl md:text-5xl font-light leading-tight mb-3">
          {data.title}
        </h1>

        <div className="w-12 h-px bg-amber-300/40 mx-auto my-4" />

        <h2 className="font-[family-name:var(--font-script)] text-amber-200 text-3xl md:text-4xl">
          {data.subtitle}
        </h2>

        <div className="mt-8">
          <svg
            className="mx-auto text-amber-300/40"
            width="24"
            height="40"
            viewBox="0 0 24 40"
            fill="none"
          >
            <rect
              x="8"
              y="0"
              width="8"
              height="14"
              rx="4"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
            />
            <line
              x1="12"
              y1="18"
              x2="12"
              y2="30"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <polyline
              points="8,26 12,30 16,26"
              stroke="currentColor"
              strokeWidth="1.5"
              fill="none"
            />
          </svg>
        </div>
      </div>
    </div>
  )
}
