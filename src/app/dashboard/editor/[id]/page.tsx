'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { useEditorStore } from '@/lib/editor-store'
import SectionPanel from '@/components/editor/SectionPanel'
import Canvas from '@/components/editor/Canvas'
import PropertiesPanel from '@/components/editor/PropertiesPanel'
import { createClient } from '@/lib/supabase/client'
import { Menu, X } from 'lucide-react'

export default function EditorPage() {
  const params = useParams()
  const id = params.id as string
  const {
    setInvitationId,
    setInvitationTitle,
    loadSections,
    setPublished,
    sections,
    invitationTitle,
    isDirty,
    setSaving,
    setDirty,
  } = useEditorStore()

  const [loading, setLoading] = useState(true)
  const [mobilePanel, setMobilePanel] = useState<'sections' | 'properties' | null>(null)
  const autoSaveRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Load invitation data
  useEffect(() => {
    if (!id) return

    const loadInvitation = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('invitations')
        .select('*')
        .eq('id', id)
        .single()

      if (data) {
        setInvitationId(data.id)
        setInvitationTitle(data.title || 'Undangan Pernikahan')
        loadSections(data.sections || [])
        setPublished(data.published || false)
      } else {
        // Create new invitation
        const { data: newData } = await supabase
          .from('invitations')
          .insert({
            id,
            title: 'Undangan Pernikahan',
            sections: [],
            published: false,
          })
          .select()
          .single()

        if (newData) {
          setInvitationId(newData.id)
          setInvitationTitle(newData.title)
          loadSections([])
        }
      }
      setLoading(false)
    }

    loadInvitation()
  }, [id, setInvitationId, setInvitationTitle, loadSections, setPublished])

  // Auto-save every 30 seconds
  const saveData = useCallback(async () => {
    const state = useEditorStore.getState()
    if (!state.invitationId || !state.isDirty || state.isSaving) return

    setSaving(true)
    try {
      const supabase = createClient()
      await supabase
        .from('invitations')
        .update({
          title: state.invitationTitle,
          sections: state.sections,
          updated_at: new Date().toISOString(),
        })
        .eq('id', state.invitationId)
      setDirty(false)
    } catch {
      // silent
    } finally {
      setSaving(false)
    }
  }, [setSaving, setDirty])

  useEffect(() => {
    autoSaveRef.current = setInterval(saveData, 30000)
    return () => {
      if (autoSaveRef.current) clearInterval(autoSaveRef.current)
    }
  }, [saveData])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault()
        if (e.shiftKey) {
          useEditorStore.getState().redo()
        } else {
          useEditorStore.getState().undo()
        }
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault()
        saveData()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [saveData])

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-stone-400 text-sm font-[family-name:var(--font-jakarta)]">
            Memuat editor...
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Mobile toggle buttons */}
      <div className="md:hidden fixed bottom-4 left-4 right-4 z-50 flex gap-2">
        <button
          onClick={() => setMobilePanel(mobilePanel === 'sections' ? null : 'sections')}
          className="flex-1 py-3 rounded-xl bg-stone-800 text-white text-xs font-[family-name:var(--font-jakarta)] font-medium shadow-lg"
        >
          {mobilePanel === 'sections' ? (
            <X className="w-4 h-4 mx-auto" />
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Menu className="w-4 h-4" /> Sections
            </span>
          )}
        </button>
        <button
          onClick={() => setMobilePanel(mobilePanel === 'properties' ? null : 'properties')}
          className="flex-1 py-3 rounded-xl bg-emerald-600 text-white text-xs font-[family-name:var(--font-jakarta)] font-medium shadow-lg"
        >
          {mobilePanel === 'properties' ? (
            <X className="w-4 h-4 mx-auto" />
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Menu className="w-4 h-4" /> Properties
            </span>
          )}
        </button>
      </div>

      {/* Desktop layout */}
      <div className="hidden md:flex flex-1 overflow-hidden">
        <SectionPanel />
        <Canvas />
        <PropertiesPanel />
      </div>

      {/* Mobile layout */}
      <div className="md:hidden flex-1 overflow-hidden relative">
        {mobilePanel === 'sections' && (
          <div className="absolute inset-0 z-40">
            <SectionPanel />
          </div>
        )}
        {mobilePanel === 'properties' && (
          <div className="absolute inset-0 z-40">
            <PropertiesPanel />
          </div>
        )}
        <Canvas />
      </div>
    </>
  )
}
