'use client'

import { useEditorStore } from '@/lib/editor-store'
import Link from 'next/link'
import {
  ArrowLeft,
  Undo2,
  Redo2,
  Save,
  Eye,
  Send,
  Settings,
  Loader2,
} from 'lucide-react'
import ThemePicker from './ThemePicker'
import FontPicker from './FontPicker'

export default function Toolbar() {
  const {
    invitationTitle,
    setInvitationTitle,
    isDirty,
    isSaving,
    published,
    undo,
    redo,
    canUndo,
    canRedo,
    setSaving,
    setDirty,
    setPublished,
    invitationId,
  } = useEditorStore()

  const handleSave = async () => {
    if (!invitationId || isSaving) return
    setSaving(true)
    try {
      const res = await fetch(`/api/invitations/${invitationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: invitationTitle,
          sections: useEditorStore.getState().sections,
        }),
      })
      if (res.ok) setDirty(false)
    } catch {
      // silent
    } finally {
      setSaving(false)
    }
  }

  const handlePublish = async () => {
    if (!invitationId) return
    await handleSave()
    try {
      const res = await fetch(`/api/invitations/${invitationId}/publish`, {
        method: 'POST',
      })
      if (res.ok) setPublished(true)
    } catch {
      // silent
    }
  }

  return (
    <div className="h-14 bg-stone-900 flex items-center px-4 gap-3 flex-shrink-0">
      {/* Back + Logo */}
      <Link
        href="/dashboard"
        className="flex items-center gap-2 text-stone-400 hover:text-white transition-colors mr-2"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="font-[family-name:var(--font-jakarta)] text-sm font-semibold tracking-tight text-emerald-400">
          MomenKu
        </span>
      </Link>

      <div className="w-px h-6 bg-stone-700" />

      {/* Editable title */}
      <input
        type="text"
        value={invitationTitle}
        onChange={(e) => setInvitationTitle(e.target.value)}
        className="bg-transparent text-white text-sm font-[family-name:var(--font-jakarta)] font-medium px-2 py-1 rounded hover:bg-stone-800 focus:bg-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-colors max-w-[240px]"
      />

      {/* Spacer */}
      <div className="flex-1" />

      {/* Undo / Redo */}
      <button
        onClick={undo}
        disabled={!canUndo()}
        className="p-2 text-stone-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        title="Undo"
      >
        <Undo2 className="w-4 h-4" />
      </button>
      <button
        onClick={redo}
        disabled={!canRedo()}
        className="p-2 text-stone-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        title="Redo"
      >
        <Redo2 className="w-4 h-4" />
      </button>

      <div className="w-px h-6 bg-stone-700" />

      {/* Theme Color Picker */}
      <ThemePicker />

      {/* Font Picker */}
      <FontPicker />

      <div className="w-px h-6 bg-stone-700" />

      {/* Save */}
      <button
        onClick={handleSave}
        disabled={isSaving}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-[family-name:var(--font-jakarta)] text-stone-300 hover:text-white hover:bg-stone-800 transition-colors disabled:opacity-50"
      >
        {isSaving ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Save className="w-4 h-4" />
        )}
        <span className="hidden sm:inline">
          {isSaving ? 'Menyimpan...' : 'Simpan'}
        </span>
        {isDirty && !isSaving && (
          <span className="w-2 h-2 rounded-full bg-amber-400" />
        )}
      </button>

      {/* Preview */}
      <Link
        href={invitationId ? `/preview/${invitationId}` : '#'}
        target="_blank"
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-[family-name:var(--font-jakarta)] text-stone-300 hover:text-white hover:bg-stone-800 transition-colors"
      >
        <Eye className="w-4 h-4" />
        <span className="hidden sm:inline">Preview</span>
      </Link>

      {/* Publish */}
      <button
        onClick={handlePublish}
        className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-[family-name:var(--font-jakarta)] font-semibold bg-emerald-600 text-white hover:bg-emerald-500 transition-colors shadow-sm"
      >
        <Send className="w-4 h-4" />
        <span className="hidden sm:inline">
          {published ? 'Update' : 'Publikasi'}
        </span>
      </button>

      {/* Settings */}
      <button className="p-2 text-stone-400 hover:text-white transition-colors">
        <Settings className="w-4 h-4" />
      </button>
    </div>
  )
}
