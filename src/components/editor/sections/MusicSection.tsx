'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import type { MusicData } from '@/types/editor'

function formatTime(seconds: number): string {
  if (!isFinite(seconds)) return '0:00'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}

export default function MusicSection({ data }: { data: MusicData }) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState(false)

  const primaryColor = 'var(--theme-primary, #059669)'
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  // Create audio element on mount / when URL changes
  useEffect(() => {
    if (!data.musicUrl) return

    const audio = new Audio()
    audio.preload = 'metadata'
    audio.crossOrigin = 'anonymous'
    audio.src = data.musicUrl

    audio.addEventListener('loadedmetadata', () => {
      setDuration(audio.duration)
      setLoaded(true)
      setError(false)
    })

    audio.addEventListener('timeupdate', () => {
      setCurrentTime(audio.currentTime)
    })

    audio.addEventListener('ended', () => {
      setIsPlaying(false)
      setCurrentTime(0)
    })

    audio.addEventListener('error', () => {
      setError(true)
      setIsPlaying(false)
    })

    audioRef.current = audio

    return () => {
      audio.pause()
      audio.src = ''
      audioRef.current = null
    }
  }, [data.musicUrl])

  const togglePlay = useCallback(() => {
    const audio = audioRef.current
    if (!audio || error) return

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      audio.play().then(() => {
        setIsPlaying(true)
      }).catch(() => {
        setError(true)
      })
    }
  }, [isPlaying, error])

  const handleSeek = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const audio = audioRef.current
      if (!audio || !duration) return

      const rect = e.currentTarget.getBoundingClientRect()
      const x = e.clientX - rect.left
      const percent = x / rect.width
      audio.currentTime = percent * duration
    },
    [duration]
  )

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0

  return (
    <div
      className="w-full py-12 px-6"
      style={{
        background:
          'linear-gradient(to bottom, white, color-mix(in srgb, var(--theme-primary, #059669) 5%, white))',
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
            {/* Music icon / album art */}
            <div className="text-center mb-4">
              <div
                className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center transition-all ${
                  isPlaying ? 'animate-pulse' : ''
                }`}
                style={{
                  backgroundColor: `color-mix(in srgb, ${primaryColor} 10%, white)`,
                }}
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

            {/* Error state */}
            {error && (
              <div className="text-center mb-4">
                <p className="text-red-400 text-xs">
                  Gagal memuat musik. Pastikan URL valid.
                </p>
              </div>
            )}

            {/* Progress bar */}
            <div className="mb-4">
              <div
                className="h-1.5 bg-stone-100 rounded-full overflow-hidden cursor-pointer"
                onClick={handleSeek}
              >
                <div
                  className="h-full rounded-full transition-all duration-100"
                  style={{
                    width: `${progressPercent}%`,
                    backgroundColor: primaryColor,
                  }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-[10px] text-stone-400 font-[family-name:var(--font-jakarta)] tabular-nums">
                  {formatTime(currentTime)}
                </span>
                <span className="text-[10px] text-stone-400 font-[family-name:var(--font-jakarta)] tabular-nums">
                  {formatTime(duration)}
                </span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-6">
              {/* Rewind 10s */}
              <button
                onClick={() => {
                  if (audioRef.current) {
                    audioRef.current.currentTime = Math.max(
                      0,
                      audioRef.current.currentTime - 10
                    )
                  }
                }}
                className="w-8 h-8 flex items-center justify-center rounded-full text-stone-400 hover:text-stone-600 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0019 16V8a1 1 0 00-1.6-.8l-5.333 4zM4.066 11.2a1 1 0 000 1.6l5.334 4A1 1 0 0011 16V8a1 1 0 00-1.6-.8l-5.334 4z" />
                </svg>
              </button>

              {/* Play/Pause */}
              <button
                onClick={togglePlay}
                className="w-14 h-14 rounded-full flex items-center justify-center transition-all hover:scale-105 shadow-lg"
                style={{ backgroundColor: primaryColor }}
              >
                {isPlaying ? (
                  <svg
                    className="w-6 h-6 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                  </svg>
                ) : (
                  <svg
                    className="w-6 h-6 text-white ml-1"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>

              {/* Forward 10s */}
              <button
                onClick={() => {
                  if (audioRef.current) {
                    audioRef.current.currentTime = Math.min(
                      duration,
                      audioRef.current.currentTime + 10
                    )
                  }
                }}
                className="w-8 h-8 flex items-center justify-center rounded-full text-stone-400 hover:text-stone-600 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z" />
                </svg>
              </button>
            </div>

            {!loaded && !error && (
              <p className="text-center text-stone-300 text-[10px] mt-3">
                Memuat audio...
              </p>
            )}
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
              style={{ fontFamily: 'var(--font-jakarta)' }}
            >
              Masukkan URL musik (.mp3, .ogg, .wav) di panel properti
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
