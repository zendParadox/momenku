'use client'

import { useEditorStore } from '@/lib/editor-store'
import { SECTION_CONFIG, type SectionType } from '@/types/editor'
import {
  Sparkles,
  Heart,
  BookHeart,
  Images,
  Calendar,
  ClipboardList,
  MessageCircleHeart,
  Gift,
  PartyPopper,
  Code,
  GripVertical,
  Eye,
  EyeOff,
  Trash2,
  Copy,
  Plus,
  Clock,
  MapPin,
  Music,
} from 'lucide-react'

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Sparkles,
  Heart,
  BookHeart,
  Images,
  Calendar,
  ClipboardList,
  MessageCircleHeart,
  Gift,
  PartyPopper,
  Code,
  Clock,
  MapPin,
  Music,
}

const SECTION_TYPES: SectionType[] = [
  'hero',
  'couple',
  'story',
  'gallery',
  'events',
  'rsvp',
  'wishes',
  'gifts',
  'footer',
  'custom',
  'countdown',
  'maps',
  'music',
]

export default function SectionPanel() {
  const {
    sections,
    selectedSectionId,
    addSection,
    selectSection,
    removeSection,
    duplicateSection,
    updateSectionMeta,
    reorderSections,
  } = useEditorStore()

  // Drag state for reorder
  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData('application/reorder-index', index.toString())
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, toIndex: number) => {
    e.preventDefault()
    const fromIndex = parseInt(e.dataTransfer.getData('application/reorder-index'), 10)
    if (!isNaN(fromIndex) && fromIndex !== toIndex) {
      reorderSections(fromIndex, toIndex)
    }
  }

  // Drag from palette
  const handleAddDragStart = (e: React.DragEvent, type: SectionType) => {
    e.dataTransfer.setData('application/add-section', type)
    e.dataTransfer.effectAllowed = 'copy'
  }

  return (
    <div className="w-72 bg-white border-r border-stone-200 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-stone-100">
        <h3 className="font-[family-name:var(--font-jakarta)] text-sm font-semibold text-stone-800">
          Section
        </h3>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Available sections palette */}
        <div className="p-3">
          <p className="text-[10px] uppercase tracking-wider text-stone-400 font-[family-name:var(--font-jakarta)] font-semibold mb-2 px-1">
            Tambah Section
          </p>
          <div className="grid grid-cols-2 gap-1.5">
            {SECTION_TYPES.map((type) => {
              const config = SECTION_CONFIG[type]
              const Icon = ICON_MAP[config.icon]
              return (
                <button
                  key={type}
                  draggable
                  onDragStart={(e) => handleAddDragStart(e, type)}
                  onClick={() => addSection(type)}
                  className="flex flex-col items-center gap-1 p-2.5 rounded-xl border border-stone-100 hover:border-emerald-200 hover:bg-emerald-50 transition-all cursor-grab active:cursor-grabbing group"
                >
                  {Icon && (
                    <Icon className="w-4 h-4 text-stone-400 group-hover:text-emerald-600 transition-colors" />
                  )}
                  <span className="text-[10px] font-[family-name:var(--font-jakarta)] text-stone-500 group-hover:text-emerald-700 transition-colors text-center leading-tight">
                    {config.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Divider */}
        <div className="px-4">
          <div className="h-px bg-stone-100" />
        </div>

        {/* Added sections */}
        <div className="p-3">
          <p className="text-[10px] uppercase tracking-wider text-stone-400 font-[family-name:var(--font-jakarta)] font-semibold mb-2 px-1">
            Sections ({sections.length})
          </p>

          {sections.length === 0 ? (
            <div className="text-center py-8">
              <Plus className="w-6 h-6 text-stone-300 mx-auto mb-2" />
              <p className="text-xs text-stone-400 font-[family-name:var(--font-jakarta)]">
                Klik atau seret section ke canvas
              </p>
            </div>
          ) : (
            <div className="space-y-1">
              {sections.map((section, index) => {
                const config = SECTION_CONFIG[section.type]
                const Icon = ICON_MAP[config.icon]
                const isSelected = section.id === selectedSectionId

                return (
                  <div
                    key={section.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, index)}
                    onClick={() => selectSection(section.id)}
                    className={`flex items-center gap-2 px-2.5 py-2 rounded-lg cursor-pointer transition-all group ${
                      isSelected
                        ? 'bg-emerald-50 border border-emerald-200'
                        : 'hover:bg-stone-50 border border-transparent'
                    }`}
                  >
                    <GripVertical className="w-3.5 h-3.5 text-stone-300 cursor-grab flex-shrink-0" />

                    {Icon && (
                      <Icon
                        className={`w-3.5 h-3.5 flex-shrink-0 ${
                          isSelected ? 'text-emerald-600' : 'text-stone-400'
                        }`}
                      />
                    )}

                    <span
                      className={`text-xs font-[family-name:var(--font-jakarta)] flex-1 truncate ${
                        isSelected ? 'text-emerald-800 font-medium' : 'text-stone-600'
                      }`}
                    >
                      {config.label}
                    </span>

                    {/* Actions */}
                    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          updateSectionMeta(section.id, { visible: !section.visible })
                        }}
                        className="p-1 rounded hover:bg-stone-200 transition-colors"
                        title={section.visible ? 'Sembunyikan' : 'Tampilkan'}
                      >
                        {section.visible ? (
                          <Eye className="w-3 h-3 text-stone-400" />
                        ) : (
                          <EyeOff className="w-3 h-3 text-stone-300" />
                        )}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          duplicateSection(section.id)
                        }}
                        className="p-1 rounded hover:bg-stone-200 transition-colors"
                        title="Duplikat"
                      >
                        <Copy className="w-3 h-3 text-stone-400" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          removeSection(section.id)
                        }}
                        className="p-1 rounded hover:bg-red-100 transition-colors"
                        title="Hapus"
                      >
                        <Trash2 className="w-3 h-3 text-red-400" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
