import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock the editor store
vi.mock('@/lib/editor-store', () => ({
  useEditorStore: vi.fn(),
}))

// Mock lucide-react
vi.mock('lucide-react', () => ({
  GripVertical: () => <span data-testid="icon-grip" />,
}))

// Mock section components
vi.mock('@/components/editor/sections/HeroSection', () => ({
  default: ({ data }: any) => <div data-testid="hero-section">{data?.title}</div>,
}))
vi.mock('@/components/editor/sections/CoupleSection', () => ({
  default: ({ data }: any) => <div data-testid="couple-section">{data?.groomName}</div>,
}))
vi.mock('@/components/editor/sections/StorySection', () => ({
  default: () => <div data-testid="story-section" />,
}))
vi.mock('@/components/editor/sections/GallerySection', () => ({
  default: () => <div data-testid="gallery-section" />,
}))
vi.mock('@/components/editor/sections/EventsSection', () => ({
  default: () => <div data-testid="events-section" />,
}))
vi.mock('@/components/editor/sections/RsvpSection', () => ({
  default: () => <div data-testid="rsvp-section" />,
}))
vi.mock('@/components/editor/sections/WishesSection', () => ({
  default: () => <div data-testid="wishes-section" />,
}))
vi.mock('@/components/editor/sections/GiftsSection', () => ({
  default: () => <div data-testid="gifts-section" />,
}))
vi.mock('@/components/editor/sections/FooterSection', () => ({
  default: () => <div data-testid="footer-section" />,
}))
vi.mock('@/components/editor/sections/CustomSection', () => ({
  default: () => <div data-testid="custom-section" />,
}))

import { useEditorStore } from '@/lib/editor-store'
import Canvas from '@/components/editor/Canvas'

const mockStore = {
  sections: [],
  selectedSectionId: null,
  selectSection: vi.fn(),
  addSection: vi.fn(),
  reorderSections: vi.fn(),
  themeOverrides: {},
}

describe('Canvas Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useEditorStore).mockReturnValue(mockStore as any)
  })

  it('shows empty state when no sections', () => {
    render(<Canvas />)
    expect(screen.getByText('Mulai buat undangan Anda')).toBeInTheDocument()
    expect(screen.getByText(/Klik atau seret section dari panel kiri/)).toBeInTheDocument()
  })

  it('renders sections when available', () => {
    vi.mocked(useEditorStore).mockReturnValue({
      ...mockStore,
      sections: [
        {
          id: 'section-1',
          type: 'hero',
          data: { title: 'Test Hero', subtitle: '', backgroundImage: '', overlayOpacity: 0.5 },
          visible: true,
          padding: { top: 48, bottom: 48, left: 16, right: 16 },
        },
      ],
    } as any)

    render(<Canvas />)
    expect(screen.getByTestId('hero-section')).toBeInTheDocument()
    expect(screen.getByText('Test Hero')).toBeInTheDocument()
  })

  it('calls selectSection when clicking a section', () => {
    const selectSection = vi.fn()
    vi.mocked(useEditorStore).mockReturnValue({
      ...mockStore,
      selectSection,
      sections: [
        {
          id: 'section-1',
          type: 'couple',
          data: { groomName: 'Budi', brideName: 'Rina', groomParents: '', brideParents: '', photo: '' },
          visible: true,
          padding: { top: 48, bottom: 48, left: 16, right: 16 },
        },
      ],
    } as any)

    render(<Canvas />)
    // Click on the couple section container
    fireEvent.click(screen.getByTestId('couple-section'))
    expect(selectSection).toHaveBeenCalledWith('section-1')
  })

  it('renders multiple sections in order', () => {
    vi.mocked(useEditorStore).mockReturnValue({
      ...mockStore,
      sections: [
        {
          id: 's1',
          type: 'hero',
          data: { title: 'Hero 1', subtitle: '', backgroundImage: '', overlayOpacity: 0.5 },
          visible: true,
          padding: { top: 0, bottom: 0, left: 0, right: 0 },
        },
        {
          id: 's2',
          type: 'couple',
          data: { groomName: 'Budi', brideName: 'Rina', groomParents: '', brideParents: '', photo: '' },
          visible: true,
          padding: { top: 0, bottom: 0, left: 0, right: 0 },
        },
      ],
    } as any)

    const { container } = render(<Canvas />)
    const sections = container.querySelectorAll('[data-testid="hero-section"], [data-testid="couple-section"]')
    expect(sections).toHaveLength(2)
  })
})
