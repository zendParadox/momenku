'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Section } from '@/types/editor'
import PhoneFrame from '@/components/editor/PhoneFrame'
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
import { ArrowLeft, Smartphone, Monitor } from 'lucide-react'

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

export default function PreviewPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const [sections, setSections] = useState<Section[]>([])
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'phone' | 'full'>('phone')

  useEffect(() => {
    if (!id) return
    const supabase = createClient()
    supabase
      .from('invitations')
      .select('title, sections')
      .eq('id', id)
      .single()
      .then(({ data }) => {
        if (data) {
          setTitle(data.title || '')
          setSections(data.sections || [])
        }
        setLoading(false)
      })
  }, [id])

  return (
    <div className="min-h-screen bg-stone-950 flex flex-col">
      {/* Top bar */}
      <div className="w-full bg-stone-900 border-b border-stone-800 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-stone-400 hover:text-white transition-colors text-sm font-[family-name:var(--font-jakarta)]"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Editor
        </button>

        <h1 className="text-stone-300 text-sm font-[family-name:var(--font-jakarta)] font-medium truncate max-w-[200px]">
          {title || 'Preview'}
        </h1>

        {/* View mode toggle */}
        <div className="flex items-center gap-1 bg-stone-800 rounded-lg p-0.5">
          <button
            onClick={() => setViewMode('phone')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              viewMode === 'phone'
                ? 'bg-stone-700 text-white shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            HP
          </button>
          <button
            onClick={() => setViewMode('full')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              viewMode === 'full'
                ? 'bg-stone-700 text-white shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            Full
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {viewMode === 'phone' ? (
          /* Phone preview */
          <div className="flex items-start justify-center py-8 px-4">
            <PhoneFrame>
              {loading ? (
                <div className="flex items-center justify-center min-h-[400px]">
                  <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : sections.length === 0 ? (
                <div className="flex items-center justify-center min-h-[400px] text-center p-8">
                  <p className="text-stone-400 text-sm font-[family-name:var(--font-jakarta)]">
                    Belum ada section
                  </p>
                </div>
              ) : (
                sections
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
                  })
              )}
            </PhoneFrame>
          </div>
        ) : (
          /* Full-width preview */
          <div className="max-w-2xl mx-auto py-8 px-4">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              {loading ? (
                <div className="flex items-center justify-center min-h-[400px]">
                  <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : sections.length === 0 ? (
                <div className="flex items-center justify-center min-h-[400px] text-center p-8">
                  <p className="text-stone-400 text-sm font-[family-name:var(--font-jakarta)]">
                    Belum ada section
                  </p>
                </div>
              ) : (
                sections
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
                  })
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
