'use client'

import { useState } from 'react'
import type { MusicData } from '@/types/editor'

export default function MusicSection({ data }: { data: MusicData }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const primaryColor = 'var(--theme-primary, #059669)'

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
    // Simulate progress for UI demonstration
    if (!isPlaying) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            return 0
          }
          return prev + 0.5
        })
      }, 100)
      // Store interval for cleanup (simplified for demo)
    }
  }

  return (
    <div
      className="w-full py-12 px-6"
      style={{
        background: 'linear-gradient(to bottom, white, color-mix(in srgb, var(--theme-primary, #059669) 5%, white))',
      }}
    >
      {/* Title */}
      <div className="text-center mb-8">
        <p
          className="text-xs tracking-[0.2em] uppercase mb-2"
          style={{
            color: primaryColor,
            fontFamily: 'var(--theme-font-body)',
          }}
        >
          Musik Latar
        </p>
        <h2
          className="text-stone-800 text-3xl font-semibold"
          style={{ fontFamily: 'var(--theme-font-heading)' }}
        >
          {data.title || 'Musik Latar'}
        </h2>
        <div
          className="w-12 h-px mx-auto mt-3"
          style={{ backgroundColor: primaryColor, opacity: 0.5 }}
        />
      </div>

      {/* Player UI */}
      {data.musicUrl ? (
        <div className="max-w-sm mx-auto">
          <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6">
            {/* Music icon */}
            <div className="text-center mb-4">
              <div
                className="w-16 h-16 rounded-full mx-auto flex items-center justify-center"
                style={{ backgroundColor: `color-mix(in srgb, ${primaryColor} 10%, white)` }}
              >
                <svg
                  className="w-8 h-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  style={{ color: primaryColor }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                  />
                </svg>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mb-4">
              <div className="h-1.5 bg-stone-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${progress}%`,
                    backgroundColor: primaryColor,
                  }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-[10px] text-stone-400 font-[family-name:var(--font-jakarta)]">
                  {Math.floor(progress * 0.3)}:{String(Math.floor((progress * 18) % 60)).padStart(2, '0')}
                </span>
                <span className="text-[10px] text-stone-400 font-[family-name:var(--font-jakarta)]">
                  3:00
                </span>
              </div>
            </div>

            {/* Play/Pause button */}
            <div className="text-center">
              <button
                onClick={togglePlay}
                className="w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-105"
                style={{ backgroundColor: primaryColor }}
              >
                {isPlaying ? (
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-sm mx-auto text-center">
          <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6">
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
                d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
              />
            </svg>
            <p
              className="text-stone-600 text-sm font-medium"
              style={{ fontFamily: 'var(--theme-font-body)' }}
            >
              Belum ada musik
            </p>
            <p
              className="text-stone-400 text-xs mt-1"
              style={{ fontFamily: 'var(--theme-font-body)' }}
            >
              Masukkan URL musik di panel properti
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
