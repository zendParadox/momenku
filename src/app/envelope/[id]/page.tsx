import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import EnvelopePageClient from './EnvelopePageClient'

interface GiftItem {
  name: string
  bank: string
  number: string
  nameAccount: string
}

interface Section {
  id: string
  type: string
  data: Record<string, unknown>
  visible: boolean
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from('invitations')
    .select('title, slug, sections')
    .eq('id', id)
    .single()

  if (!data) {
    return { title: 'Amplop Digital — MomenKu' }
  }

  const coupleSection = (data.sections as Section[])?.find(
    (s) => s.type === 'couple'
  )
  const coupleData = coupleSection?.data as {
    groomName?: string
    brideName?: string
  } | undefined

  const coupleNames = coupleData
    ? `${coupleData.groomName || ''} & ${coupleData.brideName || ''}`
    : data.title

  return {
    title: `Amplop Digital — ${coupleNames} — MomenKu`,
    description: `Kirim hadiah pernikahan untuk ${coupleNames} melalui amplop digital MomenKu.`,
  }
}

export default async function EnvelopePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: invitation } = await supabase
    .from('invitations')
    .select('*')
    .eq('id', id)
    .single()

  if (!invitation) {
    notFound()
  }

  // Parse sections
  const sections = (invitation.sections as Section[]) || []

  // Extract data from sections
  const coupleSection = sections.find((s) => s.type === 'couple')
  const giftsSection = sections.find((s) => s.type === 'gifts')
  const heroSection = sections.find((s) => s.type === 'hero')
  const eventsSection = sections.find((s) => s.type === 'events')

  const coupleData = coupleSection?.data as {
    groomName?: string
    brideName?: string
  } | undefined

  const giftsData = giftsSection?.data as {
    title?: string
    items?: GiftItem[]
  } | undefined

  const heroData = heroSection?.data as {
    title?: string
    subtitle?: string
  } | undefined

  const eventsData = eventsSection?.data as {
    items?: Array<{
      name: string
      date: string
      time: string
      location: string
    }>
  } | undefined

  const coupleNames = coupleData
    ? `${coupleData.groomName || ''} & ${coupleData.brideName || ''}`
    : invitation.title

  const invitationUrl = invitation.slug
    ? `/invitation/${invitation.slug}`
    : `/invitation/${invitation.id}`
  const rsvpUrl = `${invitationUrl}?rsvp=true`

  const themeOverrides = (invitation.theme_overrides as Record<string, string>) || {}
  const themeColor = themeOverrides.primaryColor || '#059669'

  // Extract first event date
  const firstEvent = eventsData?.items?.[0]
  const eventDate = firstEvent?.date || ''

  return (
    <EnvelopePageClient
      invitationId={invitation.id}
      title={invitation.title}
      coupleNames={coupleNames}
      groomName={coupleData?.groomName || ''}
      brideName={coupleData?.brideName || ''}
      invitationUrl={invitationUrl}
      rsvpUrl={rsvpUrl}
      gifts={giftsData?.items || []}
      giftsTitle={giftsData?.title || 'Hadiah'}
      heroTitle={heroData?.title || ''}
      heroSubtitle={heroData?.subtitle || ''}
      eventName={firstEvent?.name || invitation.title}
      eventDate={eventDate}
      eventTime={firstEvent?.time || ''}
      eventLocation={firstEvent?.location || ''}
      themeColor={themeColor}
      themeOverrides={themeOverrides}
    />
  )
}
