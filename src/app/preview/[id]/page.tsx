'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Section } from '@/types/editor'
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
import { ArrowLeft } from 'lucide-react'

const SECTION_COMPONENTS: Record<string, React.ComponentType<{ data: any }>> = {
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
}

export default function PreviewPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const [sections, setSections] = useState<Section[]>([])
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(true)

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
    <div className="min-h-screen bg-stone-900 flex flex-col items-center">
      {/* Top bar */}
      <div className="w-full bg-stone-800 px-4 py-3 flex items-center justify-between">
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
        <div className="w-24" />
      </div>

      {/* Phone frame */}
      <div className="flex-1 flex items-start justify-center py-8 px-4">
        <div className="w-[420px] max-w-full">
          {/* Phone bezel */}
          <div className="bg-stone-800 rounded-[2rem] p-3 shadow-2xl">
            {/* Notch */}
            <div className="flex justify-center mb-2">
              <div className="w-24 h-5 bg-stone-900 rounded-full" />
            </div>

            {/* Screen */}
            <div className="bg-white rounded-[1.5rem] overflow-hidden max-h-[80vh] overflow-y-auto">
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

            {/* Home indicator */}
            <div className="flex justify-center mt-2">
              <div className="w-28 h-1 bg-stone-600 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
