'use client'

import { useMemo } from 'react'
import type { MapsData } from '@/types/editor'

function getOsmEmbedUrl(mapsUrl: string, address: string): string {
  // If it's already an embed URL, use as-is
  if (mapsUrl.includes('/embed')) return mapsUrl

  // Try to extract coordinates from Google Maps URL
  // Patterns: @lat,lng or ?q=lat,lng or !2d3d patterns
  const coordMatch = mapsUrl.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/)
  if (coordMatch) {
    return `https://www.openstreetmap.org/export/embed.html?bbox=0.01,${coordMatch[1]},0.02,${coordMatch[2]}&layer=mapnik&marker=${coordMatch[1]},${coordMatch[2]}`
  }

  const qCoordMatch = mapsUrl.match(/[?&]q=(-?\d+\.?\d*),(-?\d+\.?\d*)/)
  if (qCoordMatch) {
    return `https://www.openstreetmap.org/export/embed.html?bbox=0.01,${qCoordMatch[1]},0.02,${qCoordMatch[2]}&layer=mapnik&marker=${qCoordMatch[1]},${qCoordMatch[2]}`
  }

  // Use Nominatim search for address-based embed
  const query = encodeURIComponent(address || mapsUrl)
  return `https://www.openstreetmap.org/export/embed.html?bbox=106.7,-6.3,106.9,-6.1&layer=mapnik`
}

function getOsmLink(mapsUrl: string, address: string): string {
  if (mapsUrl.includes('openstreetmap.org')) return mapsUrl

  const coordMatch = mapsUrl.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/)
  if (coordMatch) {
    return `https://www.openstreetmap.org/?mlat=${coordMatch[1]}&mlon=${coordMatch[2]}#map=15/${coordMatch[1]}/${coordMatch[2]}`
  }

  const qCoordMatch = mapsUrl.match(/[?&]q=(-?\d+\.?\d*),(-?\d+\.?\d*)/)
  if (qCoordMatch) {
    return `https://www.openstreetmap.org/?mlat=${qCoordMatch[1]}&mlon=${qCoordMatch[2]}#map=15/${qCoordMatch[1]}/${qCoordMatch[2]}`
  }

  const query = encodeURIComponent(address || 'Jakarta')
  return `https://www.openstreetmap.org/search?query=${query}`
}

export default function MapsSection({ data }: { data: MapsData }) {
  const primaryColor = 'var(--theme-primary, #059669)'

  const osmUrl = useMemo(
    () => (data.mapsUrl ? getOsmEmbedUrl(data.mapsUrl, data.address) : ''),
    [data.mapsUrl, data.address]
  )

  const osmLink = useMemo(
    () => (data.mapsUrl ? getOsmLink(data.mapsUrl, data.address) : ''),
    [data.mapsUrl, data.address]
  )

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
      {osmUrl ? (
        <div className="rounded-2xl overflow-hidden shadow-sm border border-stone-100">
          <iframe
            src={osmUrl}
            width="100%"
            height="300"
            style={{ border: 0 }}
            loading="lazy"
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
            Masukkan URL peta di panel properti untuk menampilkan peta
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

      {/* Open in Maps button */}
      {osmLink && (
        <div className="mt-4 text-center">
          <a
            href={osmLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-2.5 rounded-xl border text-sm font-medium transition-colors hover:opacity-80"
            style={{
              borderColor: primaryColor,
              color: primaryColor,
              fontFamily: 'var(--theme-font-body)',
            }}
          >
            Buka di Peta
          </a>
        </div>
      )}
    </div>
  )
}
