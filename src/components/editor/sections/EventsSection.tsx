'use client'

import type { EventsData } from '@/types/editor'

export default function EventsSection({ data }: { data: EventsData }) {
  return (
    <div className="w-full bg-gradient-to-b from-white to-emerald-50 py-12 px-6">
      {/* Title */}
      <div className="text-center mb-8">
        <p className="text-emerald-600 text-xs tracking-[0.2em] uppercase font-[family-name:var(--font-jakarta)] mb-2">
          Save the Date
        </p>
        <h2 className="font-[family-name:var(--font-cormorant)] text-stone-800 text-3xl font-semibold">
          {data.title}
        </h2>
        <div className="w-12 h-px bg-emerald-300 mx-auto mt-3" />
      </div>

      {/* Event cards */}
      <div className="space-y-6">
        {data.items.map((event, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden"
          >
            {/* Card header */}
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 px-6 py-4">
              <h3 className="font-[family-name:var(--font-cormorant)] text-white text-xl font-semibold">
                {event.name}
              </h3>
            </div>

            {/* Card body */}
            <div className="px-6 py-5 space-y-3">
              {/* Date & Time */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-emerald-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-stone-800 text-sm font-medium font-[family-name:var(--font-jakarta)]">
                    {event.date || 'Tanggal acara'}
                  </p>
                  <p className="text-stone-500 text-xs font-[family-name:var(--font-jakarta)]">
                    {event.time}
                  </p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                  <svg
                    className="w-5 h-5 text-emerald-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
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
                </div>
                <div>
                  <p className="text-stone-800 text-sm font-medium font-[family-name:var(--font-jakarta)]">
                    {event.location}
                  </p>
                  <p className="text-stone-500 text-xs font-[family-name:var(--font-jakarta)]">
                    {event.address}
                  </p>
                </div>
              </div>
            </div>

            {/* Map link */}
            <div className="px-6 pb-5">
              <button className="w-full py-2.5 rounded-xl border border-emerald-200 text-emerald-600 text-sm font-medium font-[family-name:var(--font-jakarta)] hover:bg-emerald-50 transition-colors">
                Lihat Peta
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
