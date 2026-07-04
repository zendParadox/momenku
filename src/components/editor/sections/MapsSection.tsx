'use client'

import type { MapsData } from '@/types/editor'

function getGoogleMapsEmbedUrl(address: string, mapsUrl: string): string {
  // If user provided a Google Maps embed URL directly, use it
  if (mapsUrl && mapsUrl.includes('/embed')) return mapsUrl

  // If user provided a Google Maps share URL, convert to embed
  if (mapsUrl && mapsUrl.includes('google.com/maps')) {
    // Extract the query part
    const urlObj = new URL(mapsUrl)
    const query = urlObj.searchParams.get('q') || urlObj.searchParams.get('query') || ''
    if (query) {
      return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&t=&z=15&ie=UTF8&iwloc=&output=embed`
    }
  }

  // Use address field for embed
  if (address) {
    return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`
  }

  return ''
}

function getGoogleMapsLink(address: string, mapsUrl: string): string {
  // If user provided a Google Maps URL, use it directly
  if (mapsUrl && mapsUrl.includes('google.com/maps')) {
    // Make sure it's a regular Maps link (not embed)
    if (mapsUrl.includes('/embed')) {
      const urlObj = new URL(mapsUrl)
      const query = urlObj.searchParams.get('q') || urlObj.searchParams.get('query') || ''
      if (query) {
        return `https://www.google.com/maps?q=${encodeURIComponent(query)}`
      }
    }
    return mapsUrl
  }

  // Build from address
  if (address) {
    return `https://www.google.com/maps?q=${encodeURIComponent(address)}`
  }

  return 'https://www.google.com/maps'
}

export default function MapsSection({ data }: { data: MapsData }) {
  const primaryColor = 'var(--theme-primary, #059669)'

  const embedUrl = getGoogleMapsEmbedUrl(data.address, data.mapsUrl)
  const mapsLink = getGoogleMapsLink(data.address, data.mapsUrl)

  return (
    <div
      className="w-full py-12 px-6"
      style={{
        background:
          'linear-gradient(to bottom, white, color-mix(in srgb, var(--theme-primary, #059669) 5%, white))',
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
      {embedUrl ? (
        <div className="rounded-2xl overflow-hidden shadow-sm border border-stone-100">
          <iframe
            src={embedUrl}
            width="100%"
            height="300"
            style={{ border: 0 }}
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
            Masukkan alamat atau URL Google Maps di panel properti
          </p>
        </div>
      )}

      {/* Address text */}
      {data.address && (
        <div className="mt-4 text-center">
          <p
            className="text-stone-600 text-sm"
            style={{ fontFamily: 'var(--theme-font-body)' }}
          >
            {data.address}
          </p>
        </div>
      )}

      {/* Open in Google Maps button */}
      {data.address && (
        <div className="mt-4 text-center">
          <a
            href={mapsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl border text-sm font-medium transition-colors hover:opacity-80"
            style={{
              borderColor: primaryColor,
              color: primaryColor,
              fontFamily: 'var(--theme-font-body)',
            }}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            Buka di Google Maps
          </a>
        </div>
      )}
    </div>
  )
}
