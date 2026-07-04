import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

// Mock lucide-react Check icon
vi.mock('lucide-react', () => ({
  Check: () => <span data-testid="check-icon" />,
}))

import Pricing from '@/components/Pricing'

describe('Pricing Component', () => {
  it('renders all 4 pricing tiers', () => {
    render(<Pricing />)
    expect(screen.getByText('Gratis')).toBeInTheDocument()
    expect(screen.getByText('Basic')).toBeInTheDocument()
    expect(screen.getByText('Premium')).toBeInTheDocument()
    expect(screen.getByText('Enterprise')).toBeInTheDocument()
  })

  it('displays correct prices', () => {
    render(<Pricing />)
    expect(screen.getByText('Rp0')).toBeInTheDocument()
    expect(screen.getByText('Rp49.000')).toBeInTheDocument()
    expect(screen.getByText('Rp149.000')).toBeInTheDocument()
    expect(screen.getByText('Rp499.000')).toBeInTheDocument()
  })

  it('Premium tier has "Paling Populer" badge', () => {
    render(<Pricing />)
    expect(screen.getByText('Paling Populer')).toBeInTheDocument()
  })

  it('renders correct descriptions', () => {
    render(<Pricing />)
    expect(screen.getByText('Coba-coba, tanpa commit')).toBeInTheDocument()
    expect(screen.getByText('Personal, cukup untuk wedding')).toBeInTheDocument()
    expect(screen.getByText('Full fitur, analytics lengkap')).toBeInTheDocument()
    expect(screen.getByText('Untuk wedding organizer & brand')).toBeInTheDocument()
  })

  it('renders CTA buttons', () => {
    render(<Pricing />)
    expect(screen.getByText('Mulai Gratis')).toBeInTheDocument()
    expect(screen.getByText('Pilih Basic')).toBeInTheDocument()
    expect(screen.getByText('Pilih Premium')).toBeInTheDocument()
    expect(screen.getByText('Hubungi Kami')).toBeInTheDocument()
  })

  it('renders feature lists for each plan', () => {
    render(<Pricing />)
    // Free plan features
    expect(screen.getByText('Masa aktif 7 hari')).toBeInTheDocument()
    expect(screen.getByText('5 tema dasar')).toBeInTheDocument()
    expect(screen.getByText('Maks 50 tamu')).toBeInTheDocument()
    
    // Premium features (Unlimited tamu appears in both Premium and Enterprise)
    expect(screen.getAllByText('Unlimited tamu').length).toBeGreaterThanOrEqual(2)
    expect(screen.getByText('Custom domain')).toBeInTheDocument()
    
    // Enterprise features
    expect(screen.getByText('White-label branding')).toBeInTheDocument()
  })

  it('has section heading', () => {
    render(<Pricing />)
    expect(screen.getByText('Pilih Paket yang Pas')).toBeInTheDocument()
  })

  it('renders section with id="pricing"', () => {
    render(<Pricing />)
    const section = document.getElementById('pricing')
    expect(section).toBeInTheDocument()
  })
})
