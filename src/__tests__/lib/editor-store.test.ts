import { describe, it, expect, beforeEach } from 'vitest'
import { useEditorStore } from '@/lib/editor-store'

describe('Editor Store', () => {
  beforeEach(() => {
    // Reset the store before each test
    useEditorStore.getState().reset()
  })

  it('has correct initial state', () => {
    const state = useEditorStore.getState()
    expect(state.sections).toEqual([])
    expect(state.selectedSectionId).toBeNull()
    expect(state.invitationId).toBeNull()
    expect(state.invitationTitle).toBe('Undangan Pernikahan')
    expect(state.isDirty).toBe(false)
    expect(state.isPreviewMode).toBe(false)
    expect(state.isSaving).toBe(false)
    expect(state.published).toBe(false)
    expect(state.undoStack).toEqual([])
    expect(state.redoStack).toEqual([])
  })

  it('setInvitationTitle updates title and marks dirty', () => {
    const { setInvitationTitle } = useEditorStore.getState()
    setInvitationTitle('Wedding Budi & Rina')
    const state = useEditorStore.getState()
    expect(state.invitationTitle).toBe('Wedding Budi & Rina')
    expect(state.isDirty).toBe(true)
  })

  it('setInvitationId updates invitationId', () => {
    const { setInvitationId } = useEditorStore.getState()
    setInvitationId('inv-123')
    expect(useEditorStore.getState().invitationId).toBe('inv-123')
  })

  it('setPublished updates published state', () => {
    const { setPublished } = useEditorStore.getState()
    setPublished(true)
    expect(useEditorStore.getState().published).toBe(true)
  })

  it('addSection adds a section and selects it', () => {
    const { addSection } = useEditorStore.getState()
    const id = addSection('hero')
    const state = useEditorStore.getState()
    expect(state.sections).toHaveLength(1)
    expect(state.sections[0].type).toBe('hero')
    expect(state.sections[0].id).toBe(id)
    expect(state.selectedSectionId).toBe(id)
    expect(state.isDirty).toBe(true)
  })

  it('addSection creates correct default data', () => {
    const { addSection } = useEditorStore.getState()
    addSection('couple')
    const state = useEditorStore.getState()
    const sectionData = state.sections[0].data as any
    expect(sectionData).toHaveProperty('groomName')
    expect(sectionData).toHaveProperty('brideName')
  })

  it('addSection pushes to undo stack', () => {
    const { addSection } = useEditorStore.getState()
    addSection('hero')
    const state = useEditorStore.getState()
    expect(state.undoStack).toHaveLength(1)
    expect(state.redoStack).toHaveLength(0)
  })

  it('removeSection removes a section', () => {
    const { addSection, removeSection } = useEditorStore.getState()
    const id = addSection('hero')
    removeSection(id)
    const state = useEditorStore.getState()
    expect(state.sections).toHaveLength(0)
    expect(state.selectedSectionId).toBeNull()
  })

  it('removeSection deselects if selected section is removed', () => {
    const { addSection, removeSection } = useEditorStore.getState()
    const id = addSection('hero')
    expect(useEditorStore.getState().selectedSectionId).toBe(id)
    removeSection(id)
    expect(useEditorStore.getState().selectedSectionId).toBeNull()
  })

  it('removeSection keeps selection if different section is removed', () => {
    const { addSection, removeSection } = useEditorStore.getState()
    const id1 = addSection('hero')
    const id2 = addSection('couple')
    // Current selected is id2 (last added)
    removeSection(id1)
    expect(useEditorStore.getState().selectedSectionId).toBe(id2)
  })

  it('updateSection updates section data', () => {
    const { addSection, updateSection } = useEditorStore.getState()
    const id = addSection('hero')
    updateSection(id, { title: 'New Title' })
    const state = useEditorStore.getState()
    const sectionData = state.sections[0].data as any
    expect(sectionData.title).toBe('New Title')
  })

  it('selectSection / deselectSection works', () => {
    const { addSection, selectSection } = useEditorStore.getState()
    const id = addSection('hero')
    selectSection(id)
    expect(useEditorStore.getState().selectedSectionId).toBe(id)
    selectSection(null)
    expect(useEditorStore.getState().selectedSectionId).toBeNull()
  })

  it('undo restores previous state', () => {
    const { addSection, undo } = useEditorStore.getState()
    addSection('hero')
    addSection('couple')
    // Now sections = [hero, couple]
    undo()
    const state = useEditorStore.getState()
    expect(state.sections).toHaveLength(1)
    expect(state.sections[0].type).toBe('hero')
  })

  it('redo restores undone state', () => {
    const { addSection, undo, redo } = useEditorStore.getState()
    addSection('hero')
    addSection('couple')
    undo()
    redo()
    const state = useEditorStore.getState()
    expect(state.sections).toHaveLength(2)
    expect(state.sections[1].type).toBe('couple')
  })

  it('canUndo returns true when undoStack has items', () => {
    const { addSection, canUndo } = useEditorStore.getState()
    expect(canUndo()).toBe(false)
    addSection('hero')
    expect(canUndo()).toBe(true)
  })

  it('canRedo returns true when redoStack has items', () => {
    const { addSection, undo, canRedo } = useEditorStore.getState()
    addSection('hero')
    undo()
    expect(canRedo()).toBe(true)
  })

  it('redo on empty redoStack does nothing', () => {
    const { addSection, redo } = useEditorStore.getState()
    addSection('hero')
    redo() // should not throw
    expect(useEditorStore.getState().sections).toHaveLength(1)
  })

  it('undo on empty undoStack does nothing', () => {
    const { undo } = useEditorStore.getState()
    undo() // should not throw
    expect(useEditorStore.getState().sections).toHaveLength(0)
  })

  it('setPreviewMode toggles preview mode', () => {
    const { setPreviewMode } = useEditorStore.getState()
    setPreviewMode(true)
    expect(useEditorStore.getState().isPreviewMode).toBe(true)
    setPreviewMode(false)
    expect(useEditorStore.getState().isPreviewMode).toBe(false)
  })

  it('setDirty toggles dirty state', () => {
    const { setDirty } = useEditorStore.getState()
    setDirty(true)
    expect(useEditorStore.getState().isDirty).toBe(true)
    setDirty(false)
    expect(useEditorStore.getState().isDirty).toBe(false)
  })

  it('setSaving toggles saving state', () => {
    const { setSaving } = useEditorStore.getState()
    setSaving(true)
    expect(useEditorStore.getState().isSaving).toBe(true)
    setSaving(false)
    expect(useEditorStore.getState().isSaving).toBe(false)
  })

  it('loadSections replaces all sections and resets history', () => {
    const { addSection, loadSections } = useEditorStore.getState()
    addSection('hero')
    loadSections([
      {
        id: 'loaded-1',
        type: 'couple',
        data: { groomName: 'Budi', brideName: 'Rina', groomParents: '', brideParents: '', photo: '' },
        visible: true,
        padding: { top: 0, bottom: 0, left: 0, right: 0 },
      },
    ])
    const state = useEditorStore.getState()
    expect(state.sections).toHaveLength(1)
    expect(state.sections[0].type).toBe('couple')
    expect(state.undoStack).toHaveLength(0)
    expect(state.redoStack).toHaveLength(0)
    expect(state.isDirty).toBe(false)
  })

  it('reset returns to initial state', () => {
    const { addSection, setInvitationTitle, reset } = useEditorStore.getState()
    addSection('hero')
    addSection('couple')
    setInvitationTitle('Custom Title')
    reset()
    const state = useEditorStore.getState()
    expect(state.sections).toEqual([])
    expect(state.selectedSectionId).toBeNull()
    expect(state.invitationId).toBeNull()
    expect(state.invitationTitle).toBe('Undangan Pernikahan')
    expect(state.isDirty).toBe(false)
    expect(state.undoStack).toEqual([])
    expect(state.redoStack).toEqual([])
  })

  it('reorderSections changes section order', () => {
    const { addSection, reorderSections } = useEditorStore.getState()
    addSection('hero')
    addSection('couple')
    reorderSections(0, 1)
    const state = useEditorStore.getState()
    expect(state.sections[0].type).toBe('couple')
    expect(state.sections[1].type).toBe('hero')
  })

  it('duplicateSection creates a copy of the section', () => {
    const { addSection, duplicateSection } = useEditorStore.getState()
    const id = addSection('hero')
    duplicateSection(id)
    const state = useEditorStore.getState()
    expect(state.sections).toHaveLength(2)
    expect(state.sections[0].type).toBe('hero')
    expect(state.sections[1].type).toBe('hero')
    expect(state.sections[0].id).not.toBe(state.sections[1].id)
  })

  it('duplicateSection inserts after original', () => {
    const { addSection, duplicateSection } = useEditorStore.getState()
    const id1 = addSection('hero')
    const id2 = addSection('couple')
    duplicateSection(id1)
    const state = useEditorStore.getState()
    expect(state.sections).toHaveLength(3)
    expect(state.sections[0].type).toBe('hero')
    expect(state.sections[1].type).toBe('hero') // duplicated
    expect(state.sections[2].type).toBe('couple')
  })

  it('updateSectionMeta updates section metadata', () => {
    const { addSection, updateSectionMeta } = useEditorStore.getState()
    const id = addSection('hero')
    updateSectionMeta(id, { visible: false, backgroundColor: '#000000' })
    const state = useEditorStore.getState()
    expect(state.sections[0].visible).toBe(false)
    expect(state.sections[0].backgroundColor).toBe('#000000')
  })

  it('undo/redo preserves full history chain', () => {
    const { addSection, undo, redo } = useEditorStore.getState()
    addSection('hero')   // undo: [[]]
    addSection('couple') // undo: [[hero], [hero, couple]]

    undo() // sections: [hero], redo: [[hero, couple]]
    expect(useEditorStore.getState().sections).toHaveLength(1)
    expect(useEditorStore.getState().canRedo()).toBe(true)

    redo() // sections: [hero, couple]
    expect(useEditorStore.getState().sections).toHaveLength(2)
    expect(useEditorStore.getState().canRedo()).toBe(false)
  })
})
