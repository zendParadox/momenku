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
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(135deg, var(--theme-primary, #059669) 0%, color-mix(in srgb, var(--theme-primary, #059669) 85%, black) 50%, color-mix(in srgb, var(--theme-primary, #059669) 70%, black) 100%)',
          }}
        />
      )}

      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black"
        style={{ opacity: data.overlayOpacity }}
      />

      {/* Decorative elements */}
      <div
        className="absolute top-8 left-1/2 -translate-x-1/2 w-32 h-px"
        style={{
          background:
            'linear-gradient(to right, transparent, rgba(255,255,255,0.4), transparent)',
        }}
      />
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 w-32 h-px"
        style={{
          background:
            'linear-gradient(to right, transparent, rgba(255,255,255,0.4), transparent)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 text-center px-6 py-12">
        <p
          className="text-sm tracking-[0.3em] uppercase mb-4"
          style={{
            color: 'rgba(255,255,255,0.7)',
            fontFamily: 'var(--theme-font-body)',
          }}
        >
          Wedding Invitation
        </p>

        {/* Decorative flourish */}
        <svg
          className="mx-auto mb-6"
          width="80"
          height="24"
          viewBox="0 0 80 24"
          fill="none"
          style={{ color: 'rgba(255,255,255,0.4)' }}
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

        <h1
          className="text-white text-4xl md:text-5xl font-light leading-tight mb-3"
          style={{ fontFamily: 'var(--theme-font-heading)' }}
        >
          {data.title}
        </h1>

        <div
          className="w-12 h-px mx-auto my-4"
          style={{ backgroundColor: 'rgba(255,255,255,0.3)' }}
        />

        <h2
          className="text-3xl md:text-4xl"
          style={{
            fontFamily: 'var(--theme-font-heading)',
            color: 'rgba(255,255,255,0.8)',
          }}
        >
          {data.subtitle}
        </h2>

        <div className="mt-8">
          <svg
            className="mx-auto"
            width="24"
            height="40"
            viewBox="0 0 24 40"
            fill="none"
            style={{ color: 'rgba(255,255,255,0.35)' }}
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
