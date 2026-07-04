'use client'

import type { StoryData } from '@/types/editor'

export default function StorySection({ data }: { data: StoryData }) {
  return (
    <div className="w-full bg-white py-12 px-6">
      {/* Title */}
      <div className="text-center mb-10">
        <p className="text-emerald-600 text-xs tracking-[0.2em] uppercase font-[family-name:var(--font-jakarta)] mb-2">
          Our Journey
        </p>
        <h2 className="font-[family-name:var(--font-cormorant)] text-stone-800 text-3xl font-semibold">
          {data.title}
        </h2>
        <div className="w-12 h-px bg-emerald-300 mx-auto mt-3" />
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-emerald-200 via-emerald-300 to-emerald-200" />

        <div className="space-y-8">
          {data.items.map((item, index) => (
            <div key={index} className="relative flex gap-6">
              {/* Timeline dot */}
              <div className="relative z-10 flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-emerald-50 border-2 border-emerald-300 flex items-center justify-center">
                  <span className="text-emerald-600 text-xs font-bold font-[family-name:var(--font-jakarta)]">
                    {item.year.slice(-2)}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 pb-4">
                <span className="text-emerald-500 text-xs font-[family-name:var(--font-jakarta)] tracking-wider">
                  {item.year}
                </span>
                <h3 className="font-[family-name:var(--font-cormorant)] text-stone-800 text-xl font-semibold mt-1">
                  {item.title}
                </h3>
                <p className="text-stone-500 text-sm mt-1 font-[family-name:var(--font-jakarta)] leading-relaxed">
                  {item.description}
                </p>
                {item.image && (
                  <div className="mt-3 rounded-lg overflow-hidden shadow-sm">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-32 object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
