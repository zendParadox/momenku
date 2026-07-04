import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Palette: () => <span />,
  Sparkles: () => <span />,
  MessageCircle: () => <span />,
  QrCode: () => <span />,
  BarChart3: () => <span />,
  Globe: () => <span />,
}))

import Features from '@/components/Features'

describe('Features Component', () => {
  it('renders 6 feature cards', () => {
    render(<Features />)
    const featureTitles = [
      'Visual Editor',
      'AI Copywriting',
      'WhatsApp Broadcast',
      'QR Check-In',
      'Real-time Analytics',
      'Custom Domain',
    ]
    featureTitles.forEach((title) => {
      expect(screen.getByText(title)).toBeInTheDocument()
    })
  })

  it('renders feature descriptions', () => {
    render(<Features />)
    expect(screen.getByText(/Canva-like drag-drop editor/)).toBeInTheDocument()
    expect(screen.getByText(/Masukkan data acara, AI tulis undangan/)).toBeInTheDocument()
    expect(screen.getByText(/Kirim undangan ke semua tamu/)).toBeInTheDocument()
    expect(screen.getByText(/Sistem check-in otomatis/)).toBeInTheDocument()
    expect(screen.getByText(/Siapa buka, kapan, dari mana/)).toBeInTheDocument()
    expect(screen.getByText(/Gunakan domain sendiri/)).toBeInTheDocument()
  })

  it('renders the section heading', () => {
    render(<Features />)
    expect(screen.getByText('Semua yang Kamu Butuhkan')).toBeInTheDocument()
  })

  it('renders the section subtitle', () => {
    render(<Features />)
    expect(screen.getByText(/Fitur lengkap untuk membuat, mengirim, dan melacak undangan digital/)).toBeInTheDocument()
  })

  it('renders exactly 6 feature card containers', () => {
    const { container } = render(<Features />)
    // Each feature card has an h3 title
    const cards = container.querySelectorAll('h3')
    expect(cards).toHaveLength(6)
  })
})
