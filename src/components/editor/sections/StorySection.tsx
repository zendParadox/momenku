'use client'

import type { StoryData } from '@/types/editor'

export default function StorySection({ data }: { data: StoryData }) {
  return (
    <div className="w-full bg-white py-12 px-6">
      {/* Title */}
      <div className="text-center mb-10">
        <p
          className="text-xs tracking-[0.2em] uppercase mb-2"
          style={{
            color: 'var(--theme-primary, #059669)',
            fontFamily: 'var(--theme-font-body)',
          }}
        >
          Our Journey
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
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div
          className="absolute left-6 top-0 bottom-0 w-px"
          style={{
            background: `linear-gradient(to bottom, var(--theme-primary, #059669) 0%, color-mix(in srgb, var(--theme-primary, #059669) 50%, white) 50%, var(--theme-primary, #059669) 100%)`,
            opacity: 0.4,
          }}
        />

        <div className="space-y-8">
          {data.items.map((item, index) => (
            <div key={index} className="relative flex gap-6">
              {/* Timeline dot */}
              <div className="relative z-10 flex-shrink-0">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: 'color-mix(in srgb, var(--theme-primary, #059669) 10%, white)',
                    border: '2px solid var(--theme-primary, #059669)',
                  }}
                >
                  <span
                    className="text-xs font-bold"
                    style={{
                      color: 'var(--theme-primary, #059669)',
                      fontFamily: 'var(--theme-font-body)',
                    }}
                  >
                    {item.year.slice(-2)}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 pb-4">
                <span
                  className="text-xs tracking-wider"
                  style={{
                    color: 'var(--theme-primary, #059669)',
                    opacity: 0.7,
                    fontFamily: 'var(--theme-font-body)',
                  }}
                >
                  {item.year}
                </span>
                <h3
                  className="text-stone-800 text-xl font-semibold mt-1"
                  style={{ fontFamily: 'var(--theme-font-heading)' }}
                >
                  {item.title}
                </h3>
                <p
                  className="text-stone-500 text-sm mt-1 leading-relaxed"
                  style={{ fontFamily: 'var(--theme-font-body)' }}
                >
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
