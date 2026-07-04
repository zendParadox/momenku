import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock the editor store
vi.mock('@/lib/editor-store', () => ({
  useEditorStore: vi.fn(),
}))

// Mock lucide-react
vi.mock('lucide-react', () => ({
  Sparkles: () => <span />,
  Heart: () => <span />,
  BookHeart: () => <span />,
  Images: () => <span />,
  Calendar: () => <span />,
  ClipboardList: () => <span />,
  MessageCircleHeart: () => <span />,
  Gift: () => <span />,
  PartyPopper: () => <span />,
  Code: () => <span />,
  GripVertical: () => <span />,
  Eye: () => <span />,
  EyeOff: () => <span />,
  Trash2: () => <span />,
  Copy: () => <span />,
  Plus: () => <span data-testid="icon-plus" />,
}))

import { useEditorStore } from '@/lib/editor-store'
import SectionPanel from '@/components/editor/SectionPanel'

const mockStore = {
  sections: [],
  selectedSectionId: null,
  addSection: vi.fn(),
  selectSection: vi.fn(),
  removeSection: vi.fn(),
  duplicateSection: vi.fn(),
  updateSectionMeta: vi.fn(),
  reorderSections: vi.fn(),
}

describe('SectionPanel Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useEditorStore).mockReturnValue(mockStore as any)
  })

  it('renders the "Section" header', () => {
    render(<SectionPanel />)
    expect(screen.getByText('Section')).toBeInTheDocument()
  })

  it('renders "Tambah Section" label', () => {
    render(<SectionPanel />)
    expect(screen.getByText('Tambah Section')).toBeInTheDocument()
  })

  it('renders all 10 section type buttons in the palette', () => {
    render(<SectionPanel />)
    const sectionTypes = [
      'Hero', 'Mempelai', 'Love Story', 'Galeri Foto', 'Acara',
      'RSVP', 'Ucapan', 'Hadiah', 'Penutup', 'Kustom',
    ]
    sectionTypes.forEach((label) => {
      // Each label appears in the palette buttons
      expect(screen.getAllByText(label).length).toBeGreaterThanOrEqual(1)
    })
  })

  it('calls addSection when clicking a section type button', () => {
    render(<SectionPanel />)
    const heroButton = screen.getAllByText('Hero')[0]
    fireEvent.click(heroButton)
    expect(mockStore.addSection).toHaveBeenCalledWith('hero')
  })

  it('shows empty state when no sections added', () => {
    render(<SectionPanel />)
    expect(screen.getByText(/Klik atau seret section ke canvas/)).toBeInTheDocument()
  })

  it('shows sections count', () => {
    render(<SectionPanel />)
    expect(screen.getByText('Sections (0)')).toBeInTheDocument()
  })

  it('shows added sections with correct count', () => {
    vi.mocked(useEditorStore).mockReturnValue({
      ...mockStore,
      sections: [
        {
          id: 's1',
          type: 'hero',
          data: { title: 'Hero', subtitle: '', backgroundImage: '', overlayOpacity: 0.5 },
          visible: true,
          padding: { top: 0, bottom: 0, left: 0, right: 0 },
        },
      ],
    } as any)

    render(<SectionPanel />)
    expect(screen.getByText('Sections (1)')).toBeInTheDocument()
    // Hero now appears twice - once in palette, once in added sections
    expect(screen.getAllByText('Hero').length).toBe(2)
  })
})
