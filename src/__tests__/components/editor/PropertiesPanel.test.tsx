import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock the editor store
vi.mock('@/lib/editor-store', () => ({
  useEditorStore: vi.fn(),
}))

// Mock lucide-react
vi.mock('lucide-react', () => ({
  Trash2: () => <span data-testid="icon-trash" />,
}))

import { useEditorStore } from '@/lib/editor-store'
import PropertiesPanel from '@/components/editor/PropertiesPanel'

const mockStore = {
  sections: [],
  selectedSectionId: null,
  removeSection: vi.fn(),
  updateSectionMeta: vi.fn(),
  updateSection: vi.fn(),
}

describe('PropertiesPanel Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useEditorStore).mockReturnValue(mockStore as any)
  })

  it('shows empty state when nothing selected', () => {
    render(<PropertiesPanel />)
    expect(screen.getByText('Properties')).toBeInTheDocument()
    expect(screen.getByText('Pilih section untuk mengedit')).toBeInTheDocument()
  })

  it('shows hero properties when hero section is selected', () => {
    vi.mocked(useEditorStore).mockReturnValue({
      ...mockStore,
      sections: [
        {
          id: 's1',
          type: 'hero',
          data: { title: 'The Wedding of', subtitle: 'Rina & Budi', backgroundImage: '', overlayOpacity: 0.5 },
          visible: true,
          padding: { top: 48, bottom: 48, left: 16, right: 16 },
        },
      ],
      selectedSectionId: 's1',
    } as any)

    render(<PropertiesPanel />)
    expect(screen.getByText('hero Section')).toBeInTheDocument()
    expect(screen.getByText('Judul')).toBeInTheDocument()
    expect(screen.getByText('Subjudul')).toBeInTheDocument()
    expect(screen.getByText('Gambar Latar')).toBeInTheDocument()
    expect(screen.getByText('Opacity Overlay')).toBeInTheDocument()
  })

  it('shows couple properties when couple section is selected', () => {
    vi.mocked(useEditorStore).mockReturnValue({
      ...mockStore,
      sections: [
        {
          id: 's2',
          type: 'couple',
          data: {
            groomName: 'Budi Santoso',
            brideName: 'Rina Wulandari',
            groomParents: 'Bpk. Hadi',
            brideParents: 'Bpk. Agus',
            photo: '',
          },
          visible: true,
          padding: { top: 48, bottom: 48, left: 16, right: 16 },
        },
      ],
      selectedSectionId: 's2',
    } as any)

    render(<PropertiesPanel />)
    expect(screen.getByText('couple Section')).toBeInTheDocument()
    expect(screen.getByText('Nama Mempelai Pria')).toBeInTheDocument()
    expect(screen.getByText('Nama Mempelai Wanita')).toBeInTheDocument()
    expect(screen.getByText('Orang Tua Pria')).toBeInTheDocument()
    expect(screen.getByText('Orang Tua Wanita')).toBeInTheDocument()
    expect(screen.getByText('Foto Pasangan')).toBeInTheDocument()
  })

  it('shows delete button when section is selected', () => {
    vi.mocked(useEditorStore).mockReturnValue({
      ...mockStore,
      sections: [
        {
          id: 's1',
          type: 'hero',
          data: { title: '', subtitle: '', backgroundImage: '', overlayOpacity: 0.5 },
          visible: true,
          padding: { top: 48, bottom: 48, left: 16, right: 16 },
        },
      ],
      selectedSectionId: 's1',
    } as any)

    render(<PropertiesPanel />)
    expect(screen.getByText('Hapus Section')).toBeInTheDocument()
  })

  it('shows spacing controls when section is selected', () => {
    vi.mocked(useEditorStore).mockReturnValue({
      ...mockStore,
      sections: [
        {
          id: 's1',
          type: 'hero',
          data: { title: '', subtitle: '', backgroundImage: '', overlayOpacity: 0.5 },
          visible: true,
          padding: { top: 48, bottom: 48, left: 16, right: 16 },
        },
      ],
      selectedSectionId: 's1',
    } as any)

    render(<PropertiesPanel />)
    expect(screen.getByText('Spacing')).toBeInTheDocument()
  })

  it('shows font family selector when section is selected', () => {
    vi.mocked(useEditorStore).mockReturnValue({
      ...mockStore,
      sections: [
        {
          id: 's1',
          type: 'hero',
          data: { title: '', subtitle: '', backgroundImage: '', overlayOpacity: 0.5 },
          visible: true,
          padding: { top: 48, bottom: 48, left: 16, right: 16 },
        },
      ],
      selectedSectionId: 's1',
    } as any)

    render(<PropertiesPanel />)
    expect(screen.getByText('Font Family')).toBeInTheDocument()
    expect(screen.getByText('Jakarta')).toBeInTheDocument()
    expect(screen.getByText('Cormorant')).toBeInTheDocument()
    expect(screen.getByText('Script')).toBeInTheDocument()
  })
})
