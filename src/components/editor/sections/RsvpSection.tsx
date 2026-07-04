'use client'

import { useState } from 'react'
import type { RsvpData } from '@/types/editor'

export default function RsvpSection({ data }: { data: RsvpData }) {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    attendance: 'hadir',
    guests: '1',
    message: '',
  })

  return (
    <div className="w-full bg-white py-12 px-6">
      {/* Title */}
      <div className="text-center mb-8">
        <p
          className="text-xs tracking-[0.2em] uppercase mb-2"
          style={{
            color: 'var(--theme-primary, #059669)',
            fontFamily: 'var(--theme-font-body)',
          }}
        >
          RSVP
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
        <p
          className="text-stone-500 text-sm mt-4 max-w-sm mx-auto leading-relaxed"
          style={{ fontFamily: 'var(--theme-font-body)' }}
        >
          {data.description}
        </p>
      </div>

      {/* Form */}
      <div className="space-y-4 max-w-sm mx-auto">
        {data.fields.includes('name') && (
          <div>
            <label
              className="block text-stone-600 text-xs font-medium mb-1.5"
              style={{ fontFamily: 'var(--theme-font-body)' }}
            >
              Nama Lengkap
            </label>
            <input
              type="text"
              value={formState.name}
              onChange={(e) => setFormState({ ...formState, name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-stone-200 text-stone-800 text-sm focus:outline-none focus:ring-2 transition-all"
              style={{ fontFamily: 'var(--theme-font-body)', '--tw-ring-color': 'var(--theme-primary, #059669)' } as React.CSSProperties}
              placeholder="Masukkan nama"
            />
          </div>
        )}

        {data.fields.includes('email') && (
          <div>
            <label
              className="block text-stone-600 text-xs font-medium mb-1.5"
              style={{ fontFamily: 'var(--theme-font-body)' }}
            >
              Email
            </label>
            <input
              type="email"
              value={formState.email}
              onChange={(e) => setFormState({ ...formState, email: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-stone-200 text-stone-800 text-sm focus:outline-none focus:ring-2 transition-all"
              style={{ fontFamily: 'var(--theme-font-body)', '--tw-ring-color': 'var(--theme-primary, #059669)' } as React.CSSProperties}
              placeholder="email@contoh.com"
            />
          </div>
        )}

        {data.fields.includes('attendance') && (
          <div>
            <label
              className="block text-stone-600 text-xs font-medium mb-1.5"
              style={{ fontFamily: 'var(--theme-font-body)' }}
            >
              Kehadiran
            </label>
            <div className="flex gap-2">
              {[
                { value: 'hadir', label: 'Hadir ✓' },
                { value: 'tidak', label: 'Tidak Hadir' },
                { value: 'masih', label: 'Masih Ragu' },
              ].map((opt) => {
                const isActive = formState.attendance === opt.value
                return (
                  <button
                    key={opt.value}
                    onClick={() => setFormState({ ...formState, attendance: opt.value })}
                    className="flex-1 py-2.5 rounded-xl text-xs font-medium border transition-all"
                    style={{
                      fontFamily: 'var(--theme-font-body)',
                      ...(isActive
                        ? {
                            backgroundColor: 'var(--theme-primary, #059669)',
                            color: 'white',
                            borderColor: 'var(--theme-primary, #059669)',
                          }
                        : {
                            backgroundColor: 'white',
                            color: '#57534e',
                            borderColor: '#e7e5e4',
                          }),
                    }}
                  >
                    {opt.label}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {data.fields.includes('guests') && (
          <div>
            <label
              className="block text-stone-600 text-xs font-medium mb-1.5"
              style={{ fontFamily: 'var(--theme-font-body)' }}
            >
              Jumlah Tamu
            </label>
            <select
              value={formState.guests}
              onChange={(e) => setFormState({ ...formState, guests: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-stone-200 text-stone-800 text-sm focus:outline-none focus:ring-2 transition-all bg-white"
              style={{ fontFamily: 'var(--theme-font-body)', '--tw-ring-color': 'var(--theme-primary, #059669)' } as React.CSSProperties}
            >
              <option value="1">1 Orang</option>
              <option value="2">2 Orang</option>
              <option value="3">3 Orang</option>
              <option value="4">4 Orang</option>
            </select>
          </div>
        )}

        {data.fields.includes('message') && (
          <div>
            <label
              className="block text-stone-600 text-xs font-medium mb-1.5"
              style={{ fontFamily: 'var(--theme-font-body)' }}
            >
              Ucapan & Doa
            </label>
            <textarea
              value={formState.message}
              onChange={(e) => setFormState({ ...formState, message: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-stone-200 text-stone-800 text-sm focus:outline-none focus:ring-2 transition-all resize-none"
              style={{ fontFamily: 'var(--theme-font-body)', '--tw-ring-color': 'var(--theme-primary, #059669)' } as React.CSSProperties}
              placeholder="Tulis ucapan dan doa..."
            />
          </div>
        )}

        <button
          className="w-full py-3 rounded-xl text-white text-sm font-semibold transition-colors shadow-sm"
          style={{
            backgroundColor: 'var(--theme-primary, #059669)',
            fontFamily: 'var(--theme-font-body)',
          }}
        >
          Kirim RSVP
        </button>
      </div>
    </div>
  )
}
