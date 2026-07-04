'use client'

import type { GalleryData } from '@/types/editor'
export default function GallerySection({ data, sectionId, onUpdate }: { data: GalleryData; sectionId: string; onUpdate: (data: Partial<GalleryData>) => void }) {
  const colClass =
    data.columns === 4
      ? 'grid-cols-4'
      : data.columns === 3
        ? 'grid-cols-3'
        : 'grid-cols-2'

  return (
    <div className="w-full bg-stone-50 py-12 px-6">
      {/* Title */}
      <div className="text-center mb-8">
        <p
          className="text-xs tracking-[0.2em] uppercase mb-2"
          style={{
            color: 'var(--theme-primary, #059669)',
            fontFamily: 'var(--theme-font-body)',
          }}
        >
          Moments
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

      {/* Image grid */}
      {data.images.length > 0 ? (
        <div className={`grid ${colClass} gap-2`}>
          {data.images.map((img, index) => (
            <div
              key={index}
              className="aspect-square rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <img
                src={img}
                alt={`Gallery ${index + 1}`}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      ) : (
        <div className={`grid ${colClass} gap-2`}>
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="aspect-square rounded-lg bg-stone-200 flex items-center justify-center"
            >
              <svg
                className="w-8 h-8 text-stone-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
