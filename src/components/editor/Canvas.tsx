'use client'

import { useRef, useCallback } from 'react'
import { useEditorStore } from '@/lib/editor-store'
import type { Section, SectionType } from '@/types/editor'
import HeroSection from './sections/HeroSection'
import CoupleSection from './sections/CoupleSection'
import StorySection from './sections/StorySection'
import GallerySection from './sections/GallerySection'
import EventsSection from './sections/EventsSection'
import RsvpSection from './sections/RsvpSection'
import WishesSection from './sections/WishesSection'
import GiftsSection from './sections/GiftsSection'
import FooterSection from './sections/FooterSection'
import CustomSection from './sections/CustomSection'
import CountdownSection from './sections/CountdownSection'
import MapsSection from './sections/MapsSection'
import MusicSection from './sections/MusicSection'
import { GripVertical } from 'lucide-react'

const SECTION_COMPONENTS: Record<
  SectionType,
  React.ComponentType<{ data: any; sectionId: string; onUpdate: (data: any) => void }>
> = {
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

function SectionBlock({
  section,
  isSelected,
  onSelect,
  onDragStart,
  onDragOver,
  onDrop,
}: {
  section: Section
  isSelected: boolean
  onSelect: () => void
  onDragStart: (e: React.DragEvent) => void
  onDragOver: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent) => void
}) {
  const Component = SECTION_COMPONENTS[section.type]
  const handleUpdate = useCallback(
    (data: any) => {
      useEditorStore.getState().updateSection(section.id, data)
    },
    [section.id]
  )

  return (
    <div
      onClick={onSelect}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className={`relative group transition-all duration-200 ${
        isSelected ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-transparent' : ''
      }`}
      style={{
        paddingTop: section.padding.top,
        paddingBottom: section.padding.bottom,
        paddingLeft: section.padding.left,
        paddingRight: section.padding.right,
        backgroundColor: section.backgroundColor,
      }}
    >
      {/* Section type badge on hover */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <span className="bg-stone-800/80 text-white text-[10px] px-2 py-0.5 rounded-full font-[family-name:var(--font-jakarta)] backdrop-blur-sm">
          {section.type.charAt(0).toUpperCase() + section.type.slice(1)}
        </span>
      </div>

      {/* Drag handle */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
        <div
          draggable
          onDragStart={onDragStart}
          className="cursor-grab active:cursor-grabbing p-1 rounded bg-white shadow-md border border-stone-200"
        >
          <GripVertical className="w-3 h-3 text-stone-400" />
        </div>
      </div>

      {/* Section content */}
      <div className={`${!section.visible ? 'opacity-30 pointer-events-none' : ''}`}>
        <Component data={section.data} sectionId={section.id} onUpdate={handleUpdate} />
      </div>
    </div>
  )
}

export default function Canvas() {
  const { sections, selectedSectionId, selectSection, addSection, reorderSections, themeOverrides } =
    useEditorStore()
  const canvasRef = useRef<HTMLDivElement>(null)

  const handleCanvasDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.dataTransfer.dropEffect = 'copy'
    },
    []
  )

  const handleCanvasDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      const type = e.dataTransfer.getData('application/add-section') as SectionType
      if (type) {
        addSection(type)
      }
    },
    [addSection]
  )

  const handleSectionDragStart = useCallback(
    (e: React.DragEvent, index: number) => {
      e.dataTransfer.setData('application/reorder-canvas', index.toString())
      e.dataTransfer.effectAllowed = 'move'
    },
    []
  )

  const handleSectionDragOver = useCallback(
    (e: React.DragEvent, _index: number) => {
      e.preventDefault()
      e.dataTransfer.dropEffect = 'move'
    },
    []
  )

  const handleSectionDrop = useCallback(
    (e: React.DragEvent, toIndex: number) => {
      e.preventDefault()
      e.stopPropagation()
      const fromIndex = parseInt(e.dataTransfer.getData('application/reorder-canvas'), 10)
      if (!isNaN(fromIndex) && fromIndex !== toIndex) {
        reorderSections(fromIndex, toIndex)
      }
    },
    [reorderSections]
  )

  return (
    <div className="flex-1 overflow-y-auto bg-stone-100 p-4 md:p-8">
      <div
        ref={canvasRef}
        onDragOver={handleCanvasDragOver}
        onDrop={handleCanvasDrop}
        className="mx-auto max-w-[420px] bg-white rounded-2xl shadow-xl overflow-hidden min-h-[600px]"
        style={{
          backgroundImage:
            'linear-gradient(45deg, #f5f5f4 25%, transparent 25%), linear-gradient(-45deg, #f5f5f4 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f5f5f4 75%), linear-gradient(-45deg, transparent 75%, #f5f5f4 75%)',
          backgroundSize: '20px 20px',
          backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
          backgroundColor: '#e7e5e4',
        }}
      >
        {/* White canvas card */}
        <div
          className="bg-white min-h-[600px]"
          style={{
            '--theme-primary': (themeOverrides.primaryColor as string) || '#059669',
            '--theme-font-heading': (themeOverrides.fontHeading as string) || 'Cormorant Garamond',
            '--theme-font-body': (themeOverrides.fontBody as string) || 'Plus Jakarta Sans',
          } as React.CSSProperties}
        >
          {sections.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center min-h-[600px] text-center p-8"
              onDragOver={handleCanvasDragOver}
              onDrop={handleCanvasDrop}
            >
              <div className="w-16 h-16 rounded-2xl bg-stone-100 flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-stone-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
              </div>
              <p className="text-stone-400 text-sm font-[family-name:var(--font-jakarta)] mb-2">
                Mulai buat undangan Anda
              </p>
              <p className="text-stone-300 text-xs font-[family-name:var(--font-jakarta)]">
                Klik atau seret section dari panel kiri
              </p>
            </div>
          ) : (
            sections.map((section, index) => (
              <SectionBlock
                key={section.id}
                section={section}
                isSelected={section.id === selectedSectionId}
                onSelect={() => selectSection(section.id)}
                onDragStart={(e) => handleSectionDragStart(e, index)}
                onDragOver={(e) => handleSectionDragOver(e, index)}
                onDrop={(e) => handleSectionDrop(e, index)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
