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
        <p className="text-emerald-600 text-xs tracking-[0.2em] uppercase font-[family-name:var(--font-jakarta)] mb-2">
          RSVP
        </p>
        <h2 className="font-[family-name:var(--font-cormorant)] text-stone-800 text-3xl font-semibold">
          {data.title}
        </h2>
        <div className="w-12 h-px bg-emerald-300 mx-auto mt-3" />
        <p className="text-stone-500 text-sm mt-4 font-[family-name:var(--font-jakarta)] max-w-sm mx-auto leading-relaxed">
          {data.description}
        </p>
      </div>

      {/* Form */}
      <div className="space-y-4 max-w-sm mx-auto">
        {data.fields.includes('name') && (
          <div>
            <label className="block text-stone-600 text-xs font-medium mb-1.5 font-[family-name:var(--font-jakarta)]">
              Nama Lengkap
            </label>
            <input
              type="text"
              value={formState.name}
              onChange={(e) => setFormState({ ...formState, name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-stone-200 text-stone-800 text-sm font-[family-name:var(--font-jakarta)] focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-300 transition-all"
              placeholder="Masukkan nama"
            />
          </div>
        )}

        {data.fields.includes('email') && (
          <div>
            <label className="block text-stone-600 text-xs font-medium mb-1.5 font-[family-name:var(--font-jakarta)]">
              Email
            </label>
            <input
              type="email"
              value={formState.email}
              onChange={(e) => setFormState({ ...formState, email: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-stone-200 text-stone-800 text-sm font-[family-name:var(--font-jakarta)] focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-300 transition-all"
              placeholder="email@contoh.com"
            />
          </div>
        )}

        {data.fields.includes('attendance') && (
          <div>
            <label className="block text-stone-600 text-xs font-medium mb-1.5 font-[family-name:var(--font-jakarta)]">
              Kehadiran
            </label>
            <div className="flex gap-2">
              {[
                { value: 'hadir', label: 'Hadir ✓' },
                { value: 'tidak', label: 'Tidak Hadir' },
                { value: 'masih', label: 'Masih Ragu' },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setFormState({ ...formState, attendance: opt.value })}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-medium font-[family-name:var(--font-jakarta)] border transition-all ${
                    formState.attendance === opt.value
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white text-stone-600 border-stone-200 hover:border-emerald-300'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {data.fields.includes('guests') && (
          <div>
            <label className="block text-stone-600 text-xs font-medium mb-1.5 font-[family-name:var(--font-jakarta)]">
              Jumlah Tamu
            </label>
            <select
              value={formState.guests}
              onChange={(e) => setFormState({ ...formState, guests: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-stone-200 text-stone-800 text-sm font-[family-name:var(--font-jakarta)] focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-300 transition-all bg-white"
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
            <label className="block text-stone-600 text-xs font-medium mb-1.5 font-[family-name:var(--font-jakarta)]">
              Ucapan & Doa
            </label>
            <textarea
              value={formState.message}
              onChange={(e) => setFormState({ ...formState, message: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-stone-200 text-stone-800 text-sm font-[family-name:var(--font-jakarta)] focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-300 transition-all resize-none"
              placeholder="Tulis ucapan dan doa..."
            />
          </div>
        )}

        <button className="w-full py-3 rounded-xl bg-emerald-600 text-white text-sm font-semibold font-[family-name:var(--font-jakarta)] hover:bg-emerald-700 transition-colors shadow-sm">
          Kirim RSVP
        </button>
      </div>
    </div>
  )
}
