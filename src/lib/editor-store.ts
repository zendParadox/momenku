'use client'

import { create } from 'zustand'
import type { Section, SectionType, SectionDataMap } from '@/types/editor'
import { DEFAULT_SECTION_DATA } from '@/types/editor'

function generateId(): string {
  return Math.random().toString(36).substring(2, 10) + Date.now().toString(36)
}

type EditorState = {
  sections: Section[]
  selectedSectionId: string | null
  invitationId: string | null
  invitationTitle: string
  isDirty: boolean
  isPreviewMode: boolean
  isSaving: boolean
  published: boolean
  themeOverrides: Record<string, string>

  // History
  undoStack: Section[][]
  redoStack: Section[][]

  // Actions
  setInvitationId: (id: string) => void
  setInvitationTitle: (title: string) => void
  setPublished: (published: boolean) => void
  setThemeOverrides: (overrides: Record<string, string>) => void

  addSection: (type: SectionType) => string
  updateSection: <T extends SectionType>(
    id: string,
    data: Partial<SectionDataMap[T]>
  ) => void
  updateSectionMeta: (
    id: string,
    updates: Partial<Pick<Section, 'visible' | 'padding' | 'backgroundColor' | 'fontFamily'>>
  ) => void
  removeSection: (id: string) => void
  reorderSections: (fromIndex: number, toIndex: number) => void
  selectSection: (id: string | null) => void
  duplicateSection: (id: string) => void

  setPreviewMode: (mode: boolean) => void
  setDirty: (dirty: boolean) => void
  setSaving: (saving: boolean) => void

  undo: () => void
  redo: () => void
  canUndo: () => boolean
  canRedo: () => boolean

  loadSections: (sections: Section[]) => void
  reset: () => void
}

function pushHistory(state: EditorState): { undoStack: Section[][]; redoStack: Section[][] } {
  const snapshot = JSON.parse(JSON.stringify(state.sections)) as Section[]
  return {
    undoStack: [...state.undoStack.slice(-50), snapshot],
    redoStack: [],
  }
}

export const useEditorStore = create<EditorState>((set, get) => ({
  sections: [],
  selectedSectionId: null,
  invitationId: null,
  invitationTitle: 'Undangan Pernikahan',
  isDirty: false,
  isPreviewMode: false,
  isSaving: false,
  published: false,
  themeOverrides: {},

  undoStack: [],
  redoStack: [],

  setInvitationId: (id) => set({ invitationId: id }),
  setInvitationTitle: (title) => set({ invitationTitle: title, isDirty: true }),
  setPublished: (published) => set({ published }),
  setThemeOverrides: (overrides) => set({ themeOverrides: overrides, isDirty: true }),

  addSection: (type) => {
    const state = get()
    const history = pushHistory(state)
    const newSection: Section = {
      id: generateId(),
      type,
      data: JSON.parse(JSON.stringify(DEFAULT_SECTION_DATA[type])),
      visible: true,
      padding: { top: 48, bottom: 48, left: 16, right: 16 },
    }
    set({
      sections: [...state.sections, newSection],
      selectedSectionId: newSection.id,
      isDirty: true,
      ...history,
    })
    return newSection.id
  },

  updateSection: (id, data) => {
    const state = get()
    const history = pushHistory(state)
    set({
      sections: state.sections.map((s) =>
        s.id === id ? { ...s, data: { ...s.data, ...data } } : s
      ),
      isDirty: true,
      ...history,
    })
  },

  updateSectionMeta: (id, updates) => {
    const state = get()
    const history = pushHistory(state)
    set({
      sections: state.sections.map((s) =>
        s.id === id ? { ...s, ...updates } : s
      ),
      isDirty: true,
      ...history,
    })
  },

  removeSection: (id) => {
    const state = get()
    const history = pushHistory(state)
    set({
      sections: state.sections.filter((s) => s.id !== id),
      selectedSectionId: state.selectedSectionId === id ? null : state.selectedSectionId,
      isDirty: true,
      ...history,
    })
  },

  reorderSections: (fromIndex, toIndex) => {
    const state = get()
    const history = pushHistory(state)
    const newSections = [...state.sections]
    const [moved] = newSections.splice(fromIndex, 1)
    newSections.splice(toIndex, 0, moved)
    set({
      sections: newSections,
      isDirty: true,
      ...history,
    })
  },

  selectSection: (id) => set({ selectedSectionId: id }),

  duplicateSection: (id) => {
    const state = get()
    const history = pushHistory(state)
    const section = state.sections.find((s) => s.id === id)
    if (!section) return
    const newSection: Section = {
      ...JSON.parse(JSON.stringify(section)),
      id: generateId(),
    }
    const idx = state.sections.findIndex((s) => s.id === id)
    const newSections = [...state.sections]
    newSections.splice(idx + 1, 0, newSection)
    set({
      sections: newSections,
      selectedSectionId: newSection.id,
      isDirty: true,
      ...history,
    })
  },

  setPreviewMode: (mode) => set({ isPreviewMode: mode }),
  setDirty: (dirty) => set({ isDirty: dirty }),
  setSaving: (saving) => set({ isSaving: saving }),

  undo: () => {
    const state = get()
    if (state.undoStack.length === 0) return
    const prev = state.undoStack[state.undoStack.length - 1]
    const currentSnapshot = JSON.parse(JSON.stringify(state.sections)) as Section[]
    set({
      sections: prev,
      undoStack: state.undoStack.slice(0, -1),
      redoStack: [...state.redoStack, currentSnapshot],
      isDirty: true,
    })
  },

  redo: () => {
    const state = get()
    if (state.redoStack.length === 0) return
    const next = state.redoStack[state.redoStack.length - 1]
    const currentSnapshot = JSON.parse(JSON.stringify(state.sections)) as Section[]
    set({
      sections: next,
      redoStack: state.redoStack.slice(0, -1),
      undoStack: [...state.undoStack, currentSnapshot],
      isDirty: true,
    })
  },

  canUndo: () => get().undoStack.length > 0,
  canRedo: () => get().redoStack.length > 0,

  loadSections: (sections) => set({ sections, isDirty: false, undoStack: [], redoStack: [] }),
  reset: () =>
    set({
      sections: [],
      selectedSectionId: null,
      invitationId: null,
      invitationTitle: 'Undangan Pernikahan',
      isDirty: false,
      isPreviewMode: false,
      isSaving: false,
      published: false,
      themeOverrides: {},
      undoStack: [],
      redoStack: [],
    }),
}))
