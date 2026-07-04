'use client'

import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import RsvpForm from '@/components/rsvp/RsvpForm'
import SuccessMessage from '@/components/rsvp/SuccessMessage'
import { Loader2 } from 'lucide-react'

interface InvitationData {
  id: string
  title: string
  sections: Array<{
    type: string
    data: Record<string, unknown>
    visible: boolean
  }>
  theme_overrides: Record<string, string> | null
}

export default function RsvpPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const id = params.id as string

  const [invitation, setInvitation] = useState<InvitationData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [submitData, setSubmitData] = useState<{
    guest_name: string
    attendance_status: string
  } | null>(null)

  // Pre-fill guest name from QR code params
  const guestName = searchParams.get('name') || ''
  const guestId = searchParams.get('guest') || ''

  useEffect(() => {
    if (!id) return

    const supabase = createClient()
    supabase
      .from('invitations')
      .select('id, title, sections, theme_overrides')
      .eq('id', id)
      .single()
      .then(({ data, error: fetchError }) => {
        if (fetchError || !data) {
          setError('Undangan tidak ditemukan')
        } else {
          setInvitation(data as InvitationData)
        }
        setLoading(false)
      })
  }, [id])

  // Extract theme overrides
  const themePrimary = invitation?.theme_overrides?.primaryColor || '#059669'
  const themeFontHeading = invitation?.theme_overrides?.fontHeading
    ? `var(--font-${invitation.theme_overrides.fontHeading})`
    : 'var(--font-cormorant)'
  const themeFontBody = invitation?.theme_overrides?.fontBody
    ? `var(--font-${invitation.theme_overrides.fontBody})`
    : 'var(--font-jakarta)'

  // Find RSVP section data
  const rsvpSection = invitation?.sections?.find(
    (s) => s.type === 'rsvp' && s.visible
  )
  const rsvpData = rsvpSection?.data as
    | { title?: string; description?: string; fields?: string[] }
    | undefined

  // Find couple names for display
  const coupleSection = invitation?.sections?.find(
    (s) => s.type === 'couple' && s.visible
  )
  const coupleData = coupleSection?.data as
    | { groomName?: string; brideName?: string }
    | undefined

  // Find events section for date
  const eventsSection = invitation?.sections?.find(
    (s) => s.type === 'events' && s.visible
  )
  const eventsData = eventsSection?.data as
    | { items?: Array<{ name: string; date: string; time: string; location: string }> }
    | undefined

  if (loading) {
    return (
      <div className="text-center py-20">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3" style={{ color: '#059669' }} />
        <p className="text-sm" style={{ color: '#78716c' }}>
          Memuat undangan...
        </p>
      </div>
    )
  }

  if (error || !invitation) {
    return (
      <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-stone-100">
        <div className="text-4xl mb-4">😢</div>
        <p className="text-lg font-semibold mb-2" style={{ color: '#1c1917' }}>
          {error || 'Undangan tidak ditemukan'}
        </p>
        <p className="text-sm" style={{ color: '#78716c' }}>
          Pastikan link yang Anda buka sudah benar.
        </p>
      </div>
    )
  }

  if (submitted && submitData) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6 sm:p-8">
        <SuccessMessage
          guestName={submitData.guest_name}
          attendanceStatus={submitData.attendance_status}
          invitationId={id}
          themePrimary={themePrimary}
          themeFontHeading={themeFontHeading}
          themeFontBody={themeFontBody}
        />
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6 sm:p-8">
      {/* Couple names header */}
      {coupleData && (
        <div className="text-center mb-6 pb-6 border-b border-stone-100">
          <p
            className="text-xs tracking-[0.2em] uppercase mb-1"
            style={{ color: themePrimary, fontFamily: themeFontBody }}
          >
            The Wedding of
          </p>
          <h1
            className="text-2xl sm:text-3xl font-bold"
            style={{ color: '#1c1917', fontFamily: themeFontHeading }}
          >
            {coupleData.groomName} & {coupleData.brideName}
          </h1>
        </div>
      )}

      {/* Event info */}
      {eventsData?.items && eventsData.items.length > 0 && (
        <div className="text-center mb-6 pb-6 border-b border-stone-100">
          {eventsData.items.map((event, idx) => (
            <div key={idx} className="mb-3 last:mb-0">
              <p
                className="text-sm font-semibold"
                style={{ color: '#1c1917', fontFamily: themeFontBody }}
              >
                {event.name}
              </p>
              {event.date && (
                <p
                  className="text-xs"
                  style={{ color: '#78716c', fontFamily: themeFontBody }}
                >
                  {new Date(event.date).toLocaleDateString('id-ID', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                  {event.time && ` • ${event.time}`}
                </p>
              )}
              {event.location && (
                <p
                  className="text-xs"
                  style={{ color: '#a8a29e', fontFamily: themeFontBody }}
                >
                  📍 {event.location}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* RSVP Form */}
      <RsvpForm
        invitationId={id}
        guestName={guestName}
        guestId={guestId}
        rsvpData={rsvpData as never}
        onSuccess={(data) => {
          setSubmitData(data)
          setSubmitted(true)
        }}
        themePrimary={themePrimary}
        themeFontHeading={themeFontHeading}
        themeFontBody={themeFontBody}
      />
    </div>
  )
}
