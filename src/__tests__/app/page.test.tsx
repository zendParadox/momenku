import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'

// Mock all the landing page components
vi.mock('@/components/Header', () => ({
  default: () => <header data-testid="header">Header</header>,
}))
vi.mock('@/components/Hero', () => ({
  default: () => <section data-testid="hero">Hero</section>,
}))
vi.mock('@/components/Features', () => ({
  default: () => <section data-testid="features">Features</section>,
}))
vi.mock('@/components/Testimonials', () => ({
  default: () => <section data-testid="testimonials">Testimonials</section>,
}))
vi.mock('@/components/Pricing', () => ({
  default: () => <section data-testid="pricing">Pricing</section>,
}))
vi.mock('@/components/CTA', () => ({
  default: () => <section data-testid="cta">CTA</section>,
}))
vi.mock('@/components/Footer', () => ({
  default: () => <footer data-testid="footer">Footer</footer>,
}))

import Home from '@/app/page'

describe('Landing Page (app/page.tsx)', () => {
  it('renders all major sections', () => {
    render(<Home />)
    expect(screen.getByTestId('header')).toBeInTheDocument()
    expect(screen.getByTestId('hero')).toBeInTheDocument()
    expect(screen.getByTestId('features')).toBeInTheDocument()
    expect(screen.getByTestId('testimonials')).toBeInTheDocument()
    expect(screen.getByTestId('pricing')).toBeInTheDocument()
    expect(screen.getByTestId('cta')).toBeInTheDocument()
    expect(screen.getByTestId('footer')).toBeInTheDocument()
  })

  it('renders a main element', () => {
    const { container } = render(<Home />)
    expect(container.querySelector('main')).toBeInTheDocument()
  })

  it('sections are in correct order', () => {
    const { container } = render(<Home />)
    const main = container.querySelector('main')!
    const children = Array.from(main.children).filter(
      (el) => el.getAttribute('data-testid')
    )
    const testIds = children.map((el) => el.getAttribute('data-testid'))
    expect(testIds).toEqual([
      'header',
      'hero',
      'features',
      'testimonials',
      'pricing',
      'cta',
      'footer',
    ])
  })
})
