'use client'

import type { FooterData } from '@/types/editor'

export default function FooterSection({ data }: { data: FooterData }) {
  return (
    <div className="w-full bg-gradient-to-b from-emerald-50 to-emerald-100 py-16 px-6">
      {/* Decorative top */}
      <div className="text-center mb-8">
        <svg
          className="mx-auto text-emerald-300"
          width="60"
          height="40"
          viewBox="0 0 60 40"
          fill="none"
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
        <p className="text-stone-600 text-sm font-[family-name:var(--font-jakarta)] leading-relaxed italic">
          &ldquo;{data.message}&rdquo;
        </p>
      </div>

      {/* Couple names */}
      <div className="text-center mt-8">
        <p className="font-[family-name:var(--font-script)] text-emerald-700 text-3xl">
          {data.coupleNames}
        </p>
      </div>

      {/* Decorative bottom */}
      <div className="text-center mt-8">
        <div className="flex items-center justify-center gap-3">
          <div className="w-12 h-px bg-emerald-300/50" />
          <span className="text-emerald-400 text-lg">♥</span>
          <div className="w-12 h-px bg-emerald-300/50" />
        </div>
        <p className="text-stone-400 text-xs mt-4 font-[family-name:var(--font-jakarta)]">
          Made with MomenKu
        </p>
      </div>
    </div>
  )
}
