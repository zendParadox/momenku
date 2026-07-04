'use client'

import { Heart } from 'lucide-react'
import DigitalEnvelope from '@/components/envelope/DigitalEnvelope'
import GiftCard from '@/components/envelope/GiftCard'

interface GiftItem {
  name: string
  bank: string
  number: string
  nameAccount: string
}

interface EnvelopePageClientProps {
  invitationId: string
  title: string
  coupleNames: string
  groomName: string
  brideName: string
  invitationUrl: string
  rsvpUrl: string
  gifts: GiftItem[]
  giftsTitle: string
  heroTitle: string
  heroSubtitle: string
  eventName: string
  eventDate: string
  eventTime: string
  eventLocation: string
  themeColor: string
  themeOverrides: Record<string, string>
}

function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  try {
    const date = new Date(dateStr)
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return dateStr
  }
}

export default function EnvelopePageClient({
  title,
  coupleNames,
  groomName,
  brideName,
  invitationUrl,
  rsvpUrl,
  gifts,
  giftsTitle,
  heroTitle,
  heroSubtitle,
  eventName,
  eventDate,
  eventTime,
  eventLocation,
  themeColor,
  themeOverrides,
}: EnvelopePageClientProps) {
  const fontHeading = themeOverrides.fontHeading || 'var(--font-cormorant)'
  const fontBody = themeOverrides.fontBody || 'var(--font-jakarta)'

  return (
    <div
      className="min-h-screen"
      style={{
        background: `linear-gradient(180deg, ${themeColor}08, ${themeColor}15, white)`,
        fontFamily: fontBody,
      }}
    >
      <div className="max-w-lg mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <p
            className="text-xs tracking-[0.2em] uppercase mb-2"
            style={{ color: themeColor }}
          >
            {heroTitle || 'Wedding Gift'}
          </p>
          <h1
            className="text-3xl sm:text-4xl font-bold text-stone-800 mb-2"
            style={{ fontFamily: fontHeading }}
          >
            {coupleNames}
          </h1>
          {heroSubtitle && (
            <p className="text-sm text-stone-500">{heroSubtitle}</p>
          )}
          <div
            className="w-12 h-px mx-auto mt-4"
            style={{ backgroundColor: themeColor, opacity: 0.5 }}
          />
        </div>

        {/* Digital Envelope */}
        <div className="mb-12">
          <DigitalEnvelope
            invitationUrl={invitationUrl}
            rsvpUrl={rsvpUrl}
            coupleNames={coupleNames}
            themeColor={themeColor}
          />
        </div>

        {/* Event Info */}
        {eventName && (
          <div className="mb-10 text-center">
            <p
              className="text-xs tracking-[0.2em] uppercase mb-3"
              style={{ color: themeColor }}
            >
              Detail Acara
            </p>
            <h2
              className="text-xl font-bold text-stone-800 mb-1"
              style={{ fontFamily: fontHeading }}
            >
              {eventName}
            </h2>
            {eventDate && (
              <p className="text-sm text-stone-500">
                {formatDate(eventDate)}
                {eventTime && ` • ${eventTime}`}
              </p>
            )}
            {eventLocation && (
              <p className="text-xs text-stone-400 mt-1">
                📍 {eventLocation}
              </p>
            )}
          </div>
        )}

        {/* Gift Section */}
        {gifts.length > 0 && (
          <div className="mb-10">
            <div className="text-center mb-6">
              <p
                className="text-xs tracking-[0.2em] uppercase mb-2"
                style={{ color: themeColor }}
              >
                Wedding Gift
              </p>
              <h2
                className="text-2xl font-bold text-stone-800"
                style={{ fontFamily: fontHeading }}
              >
                {giftsTitle}
              </h2>
              <div
                className="w-12 h-px mx-auto mt-3"
                style={{ backgroundColor: themeColor, opacity: 0.5 }}
              />
              <p className="text-sm text-stone-500 mt-4 max-w-sm mx-auto leading-relaxed">
                Tanpa mengurangi rasa hormat, bagi Bapak/Ibu/Saudara/i yang
                ingin memberikan tanda kasih dapat melalui:
              </p>
            </div>

            <div className="space-y-4">
              {gifts.map((gift, i) => (
                <GiftCard
                  key={i}
                  bank={gift.bank}
                  accountNumber={gift.number}
                  accountName={gift.nameAccount}
                />
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center pt-8 border-t border-stone-200">
          <Heart className="w-5 h-5 mx-auto mb-3" style={{ color: themeColor }} />
          <p className="text-xs text-stone-400">
            Dibuat dengan ❤️ oleh{' '}
            <span className="font-semibold" style={{ color: themeColor }}>
              MomenKu
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}
