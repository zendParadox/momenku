'use client'

import { useState } from 'react'

interface Wish {
  id: string
  guest_name: string
  message: string
  created_at: string
}

interface WishListProps {
  initialWishes: Wish[]
  themePrimary?: string
  themeFontBody?: string
}

function timeAgo(dateString: string): string {
  const now = new Date()
  const date = new Date(dateString)
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (seconds < 60) return 'Baru saja'
  if (seconds < 3600) return `${Math.floor(seconds / 60)} menit lalu`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} jam lalu`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} hari lalu`
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long' })
}

const AVATAR_COLORS = [
  '#059669', '#2563eb', '#dc2626', '#9333ea', '#ea580c',
  '#0891b2', '#c026d3', '#ca8a04', '#4f46e5', '#16a34a',
]

function getAvatarColor(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

export default function WishList({
  initialWishes,
  themePrimary = '#059669',
  themeFontBody = 'var(--font-jakarta)',
}: WishListProps) {
  const [wishes] = useState<Wish[]>(initialWishes)

  if (wishes.length === 0) {
    return (
      <div className="text-center py-12">
        <div
          className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
          style={{ backgroundColor: `${themePrimary}15` }}
        >
          <span className="text-3xl">💌</span>
        </div>
        <p
          className="text-sm"
          style={{ color: '#78716c', fontFamily: themeFontBody }}
        >
          Belum ada ucapan. Jadilah yang pertama mengirim!
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {wishes.map((wish, index) => (
        <div
          key={wish.id}
          className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100 wish-card"
          style={{
            animationDelay: `${index * 0.05}s`,
          }}
        >
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
              style={{
                background: `linear-gradient(to bottom right, ${getAvatarColor(wish.guest_name)}, ${getAvatarColor(wish.guest_name)}cc)`,
              }}
            >
              <span
                className="text-white text-sm font-bold"
                style={{ fontFamily: themeFontBody }}
              >
                {wish.guest_name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="min-w-0">
              <p
                className="text-sm font-medium truncate"
                style={{ color: '#1c1917', fontFamily: themeFontBody }}
              >
                {wish.guest_name}
              </p>
              <p
                className="text-xs"
                style={{ color: '#a8a29e', fontFamily: themeFontBody }}
              >
                {timeAgo(wish.created_at)}
              </p>
            </div>
          </div>
          <p
            className="text-sm leading-relaxed pl-12"
            style={{ color: '#57534e', fontFamily: themeFontBody }}
          >
            {wish.message}
          </p>
        </div>
      ))}

      <style jsx>{`
        @keyframes wish-slide-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .wish-card {
          animation: wish-slide-in 0.3s ease-out both;
        }
      `}</style>
    </div>
  )
}
