'use client'

import Link from 'next/link'

interface SuccessMessageProps {
  guestName: string
  attendanceStatus: string
  invitationId: string
  themePrimary?: string
  themeFontHeading?: string
  themeFontBody?: string
}

const attendanceLabels: Record<string, { label: string; emoji: string; color: string }> = {
  attending: { label: 'Hadir', emoji: '✅', color: '#059669' },
  not_attending: { label: 'Tidak Hadir', emoji: '❌', color: '#dc2626' },
  maybe: { label: 'Masih Ragu', emoji: '🤔', color: '#2563eb' },
}

export default function SuccessMessage({
  guestName,
  attendanceStatus,
  invitationId,
  themePrimary = '#059669',
  themeFontHeading = 'var(--font-cormorant)',
  themeFontBody = 'var(--font-jakarta)',
}: SuccessMessageProps) {
  const status = attendanceLabels[attendanceStatus] || attendanceLabels.maybe

  return (
    <div className="text-center py-8 relative">
      {/* Confetti CSS animation */}
      <div className="confetti-container" aria-hidden="true">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="confetti-piece"
            style={{
              '--confetti-delay': `${Math.random() * 0.5}s`,
              '--confetti-x': `${Math.random() * 200 - 100}px`,
              '--confetti-rotation': `${Math.random() * 360}deg`,
              '--confetti-color': ['#059669', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4'][i % 5],
              left: `${10 + Math.random() * 80}%`,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* Animated checkmark */}
      <div className="checkmark-container mx-auto mb-6">
        <svg
          className="checkmark-svg"
          viewBox="0 0 52 52"
          width="80"
          height="80"
        >
          <circle
            className="checkmark-circle"
            cx="26"
            cy="26"
            r="25"
            fill="none"
            stroke={themePrimary}
            strokeWidth="2"
          />
          <path
            className="checkmark-check"
            fill="none"
            stroke={themePrimary}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14.1 27.2l7.1 7.2 16.7-16.8"
          />
        </svg>
      </div>

      {/* Thank you message */}
      <h2
        className="text-3xl font-bold mb-3"
        style={{ color: '#1c1917', fontFamily: themeFontHeading }}
      >
        Terima Kasih!
      </h2>
      <p
        className="text-base mb-2"
        style={{ color: '#57534e', fontFamily: themeFontBody }}
      >
        Halo <span className="font-semibold">{guestName}</span>, konfirmasi
        Anda sudah kami terima.
      </p>

      {/* Attendance status badge */}
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mt-4 mb-6"
        style={{
          backgroundColor: `${status.color}15`,
          border: `1px solid ${status.color}30`,
        }}
      >
        <span>{status.emoji}</span>
        <span
          className="text-sm font-medium"
          style={{ color: status.color, fontFamily: themeFontBody }}
        >
          {status.label}
        </span>
      </div>

      {/* Back to invitation link */}
      <div className="mt-6">
        <Link
          href={`/wishes/${invitationId}`}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-semibold transition-all shadow-sm"
          style={{
            backgroundColor: themePrimary,
            fontFamily: themeFontBody,
          }}
        >
          Lihat Ucapan & Doa
        </Link>
      </div>

      <style jsx>{`
        @keyframes confetti-fall {
          0% {
            opacity: 1;
            transform: translateY(-20px) translateX(0) rotate(0deg);
          }
          100% {
            opacity: 0;
            transform: translateY(200px) translateX(var(--confetti-x)) rotate(var(--confetti-rotation));
          }
        }
        .confetti-container {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 100%;
          overflow: hidden;
          pointer-events: none;
        }
        .confetti-piece {
          position: absolute;
          top: -10px;
          width: 8px;
          height: 8px;
          border-radius: 2px;
          background-color: var(--confetti-color);
          animation: confetti-fall 1.5s ease-out forwards;
          animation-delay: var(--confetti-delay);
        }
        @keyframes circle-draw {
          0% {
            stroke-dashoffset: 166;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }
        @keyframes check-draw {
          0% {
            stroke-dashoffset: 48;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }
        .checkmark-circle {
          stroke-dasharray: 166;
          stroke-dashoffset: 166;
          animation: circle-draw 0.6s ease-in-out forwards;
        }
        .checkmark-check {
          stroke-dasharray: 48;
          stroke-dashoffset: 48;
          animation: check-draw 0.3s ease-in-out 0.4s forwards;
        }
      `}</style>
    </div>
  )
}
