'use client'

import type { MapsData } from '@/types/editor'

export default function MapsSection({ data }: { data: MapsData }) {
  const primaryColor = 'var(--theme-primary, #059669)'

  return (
    <div
      className="w-full py-12 px-6"
      style={{
        background: 'linear-gradient(to bottom, white, color-mix(in srgb, var(--theme-primary, #059669) 5%, white))',
      }}
    >
      {/* Title */}
      <div className="text-center mb-6">
        <p
          className="text-xs tracking-[0.2em] uppercase mb-2"
          style={{
            color: primaryColor,
            fontFamily: 'var(--theme-font-body)',
          }}
        >
          Lokasi
        </p>
        <h2
          className="text-stone-800 text-3xl font-semibold"
          style={{ fontFamily: 'var(--theme-font-heading)' }}
        >
          {data.title || 'Lokasi Acara'}
        </h2>
        <div
          className="w-12 h-px mx-auto mt-3"
          style={{ backgroundColor: primaryColor, opacity: 0.5 }}
        />
      </div>

      {/* Map embed or address fallback */}
      {data.mapsUrl ? (
        <div className="rounded-2xl overflow-hidden shadow-sm border border-stone-100">
          <iframe
            src={data.mapsUrl}
            width="100%"
            height="300"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Peta Lokasi"
          />
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6 text-center">
          <svg
            className="w-12 h-12 mx-auto mb-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            style={{ color: primaryColor, opacity: 0.5 }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <p
            className="text-stone-800 text-sm font-medium"
            style={{ fontFamily: 'var(--theme-font-body)' }}
          >
            {data.address || 'Alamat lokasi'}
          </p>
          <p
            className="text-stone-400 text-xs mt-1"
            style={{ fontFamily: 'var(--theme-font-body)' }}
          >
            Masukkan URL Google Maps di panel properti untuk menampilkan peta
          </p>
        </div>
      )}

      {/* Address text */}
      {data.address && data.mapsUrl && (
        <div className="mt-4 text-center">
          <p
            className="text-stone-600 text-sm"
            style={{ fontFamily: 'var(--theme-font-body)' }}
          >
            {data.address}
          </p>
        </div>
      )}

      {/* Open in Maps button */}
      {data.mapsUrl && (
        <div className="mt-4 text-center">
          <a
            href={data.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-2.5 rounded-xl border text-sm font-medium transition-colors"
            style={{
              borderColor: primaryColor,
              color: primaryColor,
              fontFamily: 'var(--theme-font-body)',
            }}
          >
            Buka di Google Maps
          </a>
        </div>
      )}
    </div>
  )
}
