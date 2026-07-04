'use client'

import { useState, useEffect } from 'react'
import type { CountdownData } from '@/types/editor'

function useCountdown(eventDate: string) {
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(interval)
  }, [])

  if (!eventDate) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true }
  }

  const target = new Date(eventDate).getTime()
  const diff = target - now

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true }
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    expired: false,
  }
}

function TimeBlock({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <div className="flex flex-col items-center">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm"
        style={{ backgroundColor: color }}
      >
        <span
          className="text-2xl font-bold text-white"
          style={{ fontFamily: 'var(--theme-font-heading)' }}
        >
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <span
        className="text-[10px] text-stone-500 mt-2 uppercase tracking-wider"
        style={{ fontFamily: 'var(--theme-font-body)' }}
      >
        {label}
      </span>
    </div>
  )
}

export default function CountdownSection({ data }: { data: CountdownData }) {
  const { days, hours, minutes, seconds, expired } = useCountdown(data.eventDate)
  const primaryColor = 'var(--theme-primary, #059669)'

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
          Countdown
        </p>
        <h2
          className="text-stone-800 text-3xl font-semibold"
          style={{ fontFamily: 'var(--theme-font-heading)' }}
        >
          {data.title || 'Hitung Mundur'}
        </h2>
        <div
          className="w-12 h-px mx-auto mt-3"
          style={{ backgroundColor: primaryColor, opacity: 0.5 }}
        />
      </div>

      {/* Countdown display */}
      {data.eventDate ? (
        <div className="flex justify-center gap-4">
          <TimeBlock value={days} label="Hari" color={primaryColor} />
          <TimeBlock value={hours} label="Jam" color={primaryColor} />
          <TimeBlock value={minutes} label="Menit" color={primaryColor} />
          <TimeBlock value={seconds} label="Detik" color={primaryColor} />
        </div>
      ) : (
        <div className="text-center">
          <p
            className="text-stone-400 text-sm"
            style={{ fontFamily: 'var(--theme-font-body)' }}
          >
            Atur tanggal acara di panel properti
          </p>
        </div>
      )}

      {expired && data.eventDate && (
        <div className="text-center mt-6">
          <p
            className="text-stone-600 text-sm font-medium"
            style={{ fontFamily: 'var(--theme-font-heading)' }}
          >
            🎉 Acara telah dimulai!
          </p>
        </div>
      )}
    </div>
  )
}
