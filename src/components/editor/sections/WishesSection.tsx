'use client'

import type { WishesData } from '@/types/editor'

const SAMPLE_WISHES = [
  { name: 'Sarah', message: 'Selamat menempuh hidup baru! Semoga selalu diberkahi.', time: '2 jam lalu' },
  { name: 'Ahmad', message: 'Barakallah! Semoga menjadi keluarga sakinah mawaddah.', time: '5 jam lalu' },
  { name: 'Diana', message: 'Happy wedding! Can\'t wait to celebrate with you both!', time: '1 hari lalu' },
]

export default function WishesSection({ data }: { data: WishesData }) {
  return (
    <div className="w-full bg-gradient-to-b from-stone-50 to-white py-12 px-6">
      {/* Title */}
      <div className="text-center mb-8">
        <p
          className="text-xs tracking-[0.2em] uppercase mb-2"
          style={{
            color: 'var(--theme-primary, #059669)',
            fontFamily: 'var(--theme-font-body)',
          }}
        >
          Warm Wishes
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

      {/* Social proof */}
      {data.showSocialProof && (
        <div className="text-center mb-6">
          <p
            className="text-stone-400 text-xs"
            style={{ fontFamily: 'var(--theme-font-body)' }}
          >
            127 orang sudah mengirim ucapan
          </p>
        </div>
      )}

      {/* Wishes feed */}
      <div className="space-y-3 max-w-sm mx-auto">
        {SAMPLE_WISHES.map((wish, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100"
          >
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{
                  background: 'linear-gradient(to bottom right, var(--theme-primary, #059669), color-mix(in srgb, var(--theme-primary, #059669) 70%, black))',
                }}
              >
                <span
                  className="text-white text-xs font-bold"
                  style={{ fontFamily: 'var(--theme-font-body)' }}
                >
                  {wish.name.charAt(0)}
                </span>
              </div>
              <div>
                <p
                  className="text-stone-800 text-sm font-medium"
                  style={{ fontFamily: 'var(--theme-font-body)' }}
                >
                  {wish.name}
                </p>
                <p
                  className="text-stone-400 text-xs"
                  style={{ fontFamily: 'var(--theme-font-body)' }}
                >
                  {wish.time}
                </p>
              </div>
            </div>
            <p
              className="text-stone-600 text-sm leading-relaxed pl-11"
              style={{ fontFamily: 'var(--theme-font-body)' }}
            >
              {wish.message}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
