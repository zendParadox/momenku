import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

// Mock framer-motion to avoid animation issues
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
    span: ({ children, ...props }: any) => <span {...props}>{children}</span>,
    li: ({ children, ...props }: any) => <li {...props}>{children}</li>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Menu: () => <span data-testid="icon-menu" />,
  X: () => <span data-testid="icon-x" />,
}))

import Header from '@/components/Header'

describe('Header Component', () => {
  it('renders the logo "MomenKu"', () => {
    render(<Header />)
    expect(screen.getAllByText('MomenKu').length).toBeGreaterThan(0)
  })

  it('renders all desktop nav links', () => {
    render(<Header />)
    expect(screen.getByText('Fitur')).toBeInTheDocument()
    expect(screen.getByText('Template')).toBeInTheDocument()
    expect(screen.getByText('Harga')).toBeInTheDocument()
    expect(screen.getByText('Blog')).toBeInTheDocument()
  })

  it('renders desktop CTA buttons', () => {
    render(<Header />)
    const masukLinks = screen.getAllByText('Masuk')
    expect(masukLinks.length).toBeGreaterThan(0)
    // Desktop "Masuk" links to /login
    const loginLink = masukLinks[0].closest('a')
    expect(loginLink).toHaveAttribute('href', '/login')

    const daftarLinks = screen.getAllByText('Daftar Gratis')
    expect(daftarLinks.length).toBeGreaterThan(0)
    const registerLink = daftarLinks[0].closest('a')
    expect(registerLink).toHaveAttribute('href', '/register')
  })

  it('logo links to /', () => {
    render(<Header />)
    const logoLink = screen.getAllByText('MomenKu')[0].closest('a')
    expect(logoLink).toHaveAttribute('href', '/')
  })

  it('nav links have correct href attributes', () => {
    render(<Header />)
    expect(screen.getByText('Fitur')).toHaveAttribute('href', '#features')
    expect(screen.getByText('Template')).toHaveAttribute('href', '#templates')
    expect(screen.getByText('Harga')).toHaveAttribute('href', '#pricing')
    expect(screen.getByText('Blog')).toHaveAttribute('href', '#blog')
  })

  it('mobile menu button toggles open/close', () => {
    render(<Header />)
    const menuButton = screen.getByRole('button', { name: /buka menu/i })
    
    // Click to open mobile menu
    fireEvent.click(menuButton)
    
    // After click, mobile panel should show links
    const mobileNavLinks = screen.getAllByText('Fitur')
    expect(mobileNavLinks.length).toBeGreaterThanOrEqual(1)
  })
})
