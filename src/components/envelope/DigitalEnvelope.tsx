'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface DigitalEnvelopeProps {
  invitationUrl: string
  rsvpUrl: string
  coupleNames: string
  themeColor?: string
}

export default function DigitalEnvelope({
  invitationUrl,
  rsvpUrl,
  coupleNames,
  themeColor = '#059669',
}: DigitalEnvelopeProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="flex flex-col items-center">
      <AnimatePresence mode="wait">
        {!isOpen ? (
          <motion.div
            key="envelope"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            className="cursor-pointer group"
            onClick={() => setIsOpen(true)}
          >
            {/* Envelope body */}
            <div className="relative w-64 h-44 sm:w-72 sm:h-48">
              {/* Back of envelope */}
              <div
                className="absolute inset-0 rounded-2xl shadow-xl overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${themeColor}, ${themeColor}dd)`,
                }}
              >
                {/* Decorative pattern */}
                <div className="absolute inset-0 opacity-10">
                  <svg className="w-full h-full" viewBox="0 0 200 150">
                    <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                      <circle cx="10" cy="10" r="1.5" fill="white" />
                    </pattern>
                    <rect width="200" height="150" fill="url(#dots)" />
                  </svg>
                </div>
                {/* Envelope flap */}
                <div
                  className="absolute top-0 left-0 right-0 h-1/2"
                  style={{
                    background: `linear-gradient(180deg, ${themeColor}ee, ${themeColor}aa)`,
                    clipPath: 'polygon(0 0, 50% 100%, 100% 0)',
                  }}
                />
                {/* Seal */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform"
                    style={{
                      background: `linear-gradient(135deg, ${themeColor}, ${themeColor}cc)`,
                      border: '3px solid rgba(255,255,255,0.3)',
                    }}
                  >
                    <span className="text-white text-2xl">💌</span>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-center mt-4 text-sm font-medium text-stone-600 group-hover:text-stone-800 transition-colors">
              Klik untuk membuka amplop
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-sm text-center"
          >
            {/* Opened envelope decoration */}
            <div className="mb-6">
              <div
                className="w-20 h-20 rounded-full mx-auto flex items-center justify-center shadow-lg"
                style={{
                  background: `linear-gradient(135deg, ${themeColor}, ${themeColor}cc)`,
                }}
              >
                <span className="text-4xl">💌</span>
              </div>
            </div>

            <h3 className="text-xl font-[family-name:var(--font-cormorant)] font-bold text-stone-800 mb-2">
              Amplop Digital
            </h3>
            <p className="text-sm text-stone-500 mb-6">
              {coupleNames}
            </p>

            <div className="space-y-3">
              <a
                href={invitationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full rounded-xl px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition-all hover:shadow-xl"
                style={{
                  backgroundColor: themeColor,
                  boxShadow: `0 4px 14px ${themeColor}40`,
                }}
              >
                💌 Buka Undangan
              </a>
              <a
                href={rsvpUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full rounded-xl border-2 px-6 py-3.5 text-sm font-semibold transition-all hover:shadow-md"
                style={{
                  borderColor: themeColor,
                  color: themeColor,
                }}
              >
                ✅ Konfirmasi Kehadiran
              </a>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="mt-4 text-xs text-stone-400 hover:text-stone-600 transition-colors"
            >
              ← Tutup amplop
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
