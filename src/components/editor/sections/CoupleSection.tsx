'use client'

import type { CoupleData } from '@/types/editor'

export default function CoupleSection({ data }: { data: CoupleData }) {
  return (
    <div className="w-full bg-gradient-to-b from-emerald-50 to-white py-12 px-6">
      {/* Decorative top */}
      <div className="text-center mb-8">
        <svg
          className="mx-auto text-emerald-300"
          width="60"
          height="30"
          viewBox="0 0 60 30"
          fill="none"
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
            <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-emerald-200 shadow-lg">
              <img
                src={data.photo}
                alt="Couple"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-emerald-600 text-white px-3 py-1 rounded-full text-xs font-[family-name:var(--font-jakarta)]">
              ♥
            </div>
          </div>
        </div>
      )}

      {/* Names */}
      <div className="text-center space-y-6">
        {/* Groom */}
        <div>
          <h3 className="font-[family-name:var(--font-cormorant)] text-emerald-800 text-3xl font-semibold">
            {data.groomName}
          </h3>
          <p className="text-stone-500 text-sm mt-1 font-[family-name:var(--font-jakarta)]">
            {data.groomParents}
          </p>
        </div>

        {/* Ampersand */}
        <div className="flex items-center justify-center gap-4">
          <div className="w-16 h-px bg-emerald-200" />
          <span className="font-[family-name:var(--font-script)] text-emerald-400 text-3xl">
            &
          </span>
          <div className="w-16 h-px bg-emerald-200" />
        </div>

        {/* Bride */}
        <div>
          <h3 className="font-[family-name:var(--font-cormorant)] text-emerald-800 text-3xl font-semibold">
            {data.brideName}
          </h3>
          <p className="text-stone-500 text-sm mt-1 font-[family-name:var(--font-jakarta)]">
            {data.brideParents}
          </p>
        </div>
      </div>

      {/* Decorative bottom */}
      <div className="text-center mt-8">
        <div className="flex items-center justify-center gap-3">
          <div className="w-8 h-px bg-emerald-200" />
          <span className="text-emerald-300 text-xs">✦</span>
          <div className="w-8 h-px bg-emerald-200" />
        </div>
      </div>
    </div>
  )
}
