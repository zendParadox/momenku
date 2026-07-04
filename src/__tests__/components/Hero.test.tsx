import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))

import Hero from '@/components/Hero'

describe('Hero Component', () => {
  it('renders the heading text', () => {
    render(<Hero />)
    expect(screen.getByText(/Undangan Digital yang Bikin/)).toBeInTheDocument()
    expect(screen.getByText(/Tamu Terpesona/)).toBeInTheDocument()
  })

  it('renders subtext about AI-powered and 500+ themes', () => {
    render(<Hero />)
    expect(screen.getByText(/AI-powered/)).toBeInTheDocument()
    expect(screen.getByText(/500\+ tema/)).toBeInTheDocument()
  })

  it('renders "Coba Gratis" button linking to /register', () => {
    render(<Hero />)
    const ctaButton = screen.getByText('Coba Gratis')
    expect(ctaButton).toBeInTheDocument()
    const link = ctaButton.closest('a')
    expect(link).toHaveAttribute('href', '/register')
  })

  it('renders "Lihat Contoh" button linking to #templates', () => {
    render(<Hero />)
    const exampleButton = screen.getByText('Lihat Contoh')
    expect(exampleButton).toBeInTheDocument()
    const link = exampleButton.closest('a')
    expect(link).toHaveAttribute('href', '#templates')
  })

  it('displays the stats row with correct values', () => {
    render(<Hero />)
    expect(screen.getByText('500+')).toBeInTheDocument()
    expect(screen.getByText('Tema')).toBeInTheDocument()
    expect(screen.getByText('10rb+')).toBeInTheDocument()
    expect(screen.getByText('Pengguna')).toBeInTheDocument()
    expect(screen.getByText('4.9★')).toBeInTheDocument()
    expect(screen.getByText('Rating')).toBeInTheDocument()
  })
})
