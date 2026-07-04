'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Section } from '@/types/editor'
import { ArrowRight, Loader2, Heart } from 'lucide-react'
import Link from 'next/link'

// ── Section renderers ──
import HeroSection from '@/components/editor/sections/HeroSection'
import CoupleSection from '@/components/editor/sections/CoupleSection'
import StorySection from '@/components/editor/sections/StorySection'
import GallerySection from '@/components/editor/sections/GallerySection'
import EventsSection from '@/components/editor/sections/EventsSection'
import RsvpSection from '@/components/editor/sections/RsvpSection'
import WishesSection from '@/components/editor/sections/WishesSection'
import GiftsSection from '@/components/editor/sections/GiftsSection'
import FooterSection from '@/components/editor/sections/FooterSection'
import CustomSection from '@/components/editor/sections/CustomSection'
import CountdownSection from '@/components/editor/sections/CountdownSection'
import MapsSection from '@/components/editor/sections/MapsSection'
import MusicSection from '@/components/editor/sections/MusicSection'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SECTION_COMPONENTS: Record<string, React.ComponentType<any>> = {
  hero: HeroSection,
  couple: CoupleSection,
  story: StorySection,
  gallery: GallerySection,
  events: EventsSection,
  rsvp: RsvpSection,
  wishes: WishesSection,
  gifts: GiftsSection,
  footer: FooterSection,
  custom: CustomSection,
  countdown: CountdownSection,
  maps: MapsSection,
  music: MusicSection,
}

interface InvitationData {
  id: string
  title: string
  status: string
  sections: Section[]
  theme_overrides: Record<string, string> | null
}

export default function InvitationPage() {
  const params = useParams()
  const id = params.id as string

  const [invitation, setInvitation] = useState<InvitationData | null>(null)
  const [loading, setLoading] = useState(true)
  const [notAvailable, setNotAvailable] = useState(false)

  useEffect(() => {
    if (!id) return
    const supabase = createClient()
    supabase
      .from('invitations')
      .select('id, title, status, sections, theme_overrides')
      .eq('id', id)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          setNotAvailable(true)
        } else if (data.status !== 'published') {
          setNotAvailable(true)
        } else {
          setInvitation(data as InvitationData)
        }
        setLoading(false)
      })
  }, [id])

  // Apply page title
  useEffect(() => {
    if (invitation?.title) {
      document.title = `${invitation.title} — MomenKu`
    }
  }, [invitation?.title])

  // Extract theme overrides
  const themePrimary = invitation?.theme_overrides?.primaryColor || '#059669'
  const themeFontHeading = invitation?.theme_overrides?.fontHeading
    ? `var(--font-${invitation.theme_overrides.fontHeading})`
    : 'var(--font-cormorant)'
  const themeFontBody = invitation?.theme_overrides?.fontBody
    ? `var(--font-${invitation.theme_overrides.fontBody})`
    : 'var(--font-jakarta)'

  // ── Loading ──
  if (loading) {
    return (
      <div className="min-h-dvh bg-gradient-to-br from-stone-50 via-white to-stone-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2
            className="w-8 h-8 animate-spin mx-auto mb-3"
            style={{ color: themePrimary }}
          />
          <p
            className="text-sm"
            style={{ color: '#78716c', fontFamily: themeFontBody }}
          >
            Memuat undangan...
          </p>
        </div>
      </div>
    )
  }

  // ── Not available ──
  if (notAvailable || !invitation) {
    return (
      <div className="min-h-dvh bg-gradient-to-br from-stone-50 via-white to-stone-100 flex items-center justify-center p-4">
        <div className="text-center bg-white rounded-2xl shadow-sm border border-stone-100 p-8 sm:p-12 max-w-md w-full">
          <div className="text-5xl mb-4">💌</div>
          <h1
            className="text-xl font-semibold mb-2"
            style={{ color: '#1c1917', fontFamily: themeFontHeading }}
          >
            Undangan Belum Tersedia
          </h1>
          <p
            className="text-sm mb-6"
            style={{ color: '#78716c', fontFamily: themeFontBody }}
          >
            Undangan ini belum dipublikasi atau tidak tersedia. Silakan hubungi pemilik undangan untuk informasi lebih lanjut.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors"
            style={{ backgroundColor: themePrimary }}
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    )
  }

  // ── Render invitation ──
  return (
    <div
      className="min-h-dvh bg-white"
      style={{
        '--theme-primary': themePrimary,
        '--theme-font-heading': themeFontHeading,
        '--theme-font-body': themeFontBody,
      } as React.CSSProperties}
    >
      {/* Sections */}
      <div className="max-w-2xl mx-auto">
        {invitation.sections
          .filter((s) => s.visible)
          .map((section) => {
            const Component = SECTION_COMPONENTS[section.type]
            if (!Component) return null
            return (
              <div
                key={section.id}
                style={{
                  paddingTop: section.padding.top,
                  paddingBottom: section.padding.bottom,
                  paddingLeft: section.padding.left,
                  paddingRight: section.padding.right,
                  backgroundColor: section.backgroundColor,
                }}
              >
                <Component data={section.data} />
              </div>
            )
          })}
      </div>

      {/* Bottom sticky RSVP bar */}
      <div className="fixed bottom-0 inset-x-0 z-50">
        <div
          className="max-w-2xl mx-auto backdrop-blur-xl border-t"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderColor: '#e7e5e4',
          }}
        >
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart
                className="w-4 h-4"
                style={{ color: themePrimary }}
                fill={themePrimary}
              />
              <span
                className="text-sm font-medium"
                style={{ color: '#1c1917', fontFamily: themeFontBody }}
              >
                Buka Undangan
              </span>
            </div>
            <Link
              href={`/rsvp/${id}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105 shadow-lg"
              style={{
                backgroundColor: themePrimary,
                fontFamily: themeFontBody,
              }}
            >
              Konfirmasi Kehadiran
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
