import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Footer from '@/components/Footer'

describe('Footer Component', () => {
  it('renders the "MomenKu" brand', () => {
    render(<Footer />)
    expect(screen.getByText('MomenKu')).toBeInTheDocument()
  })

  it('renders all 4 link categories', () => {
    render(<Footer />)
    expect(screen.getByText('Product')).toBeInTheDocument()
    expect(screen.getByText('Company')).toBeInTheDocument()
    expect(screen.getByText('Resources')).toBeInTheDocument()
    expect(screen.getByText('Legal')).toBeInTheDocument()
  })

  it('renders Product links', () => {
    render(<Footer />)
    expect(screen.getByText('Fitur')).toBeInTheDocument()
    expect(screen.getByText('Template')).toBeInTheDocument()
    expect(screen.getByText('Harga')).toBeInTheDocument()
    expect(screen.getByText('Blog')).toBeInTheDocument()
    expect(screen.getByText('Changelog')).toBeInTheDocument()
  })

  it('renders Company links', () => {
    render(<Footer />)
    expect(screen.getByText('Tentang')).toBeInTheDocument()
    expect(screen.getByText('Karir')).toBeInTheDocument()
    expect(screen.getByText('Kontak')).toBeInTheDocument()
    expect(screen.getByText('Press Kit')).toBeInTheDocument()
  })

  it('renders Resources links', () => {
    render(<Footer />)
    expect(screen.getByText('Dokumentasi')).toBeInTheDocument()
    expect(screen.getByText('Tutorial')).toBeInTheDocument()
    expect(screen.getByText('API')).toBeInTheDocument()
    expect(screen.getByText('Status')).toBeInTheDocument()
  })

  it('renders Legal links', () => {
    render(<Footer />)
    expect(screen.getByText('Privacy Policy')).toBeInTheDocument()
    expect(screen.getByText('Terms of Service')).toBeInTheDocument()
    expect(screen.getByText('Cookie Policy')).toBeInTheDocument()
  })

  it('renders social media links', () => {
    render(<Footer />)
    expect(screen.getByText('Twitter')).toBeInTheDocument()
    expect(screen.getByText('Instagram')).toBeInTheDocument()
    expect(screen.getByText('YouTube')).toBeInTheDocument()
  })

  it('renders copyright text', () => {
    render(<Footer />)
    expect(screen.getByText(/© 2026 MomenKu/)).toBeInTheDocument()
  })

  it('renders brand tagline', () => {
    render(<Footer />)
    expect(screen.getByText(/Undangan digital yang bikin tamu terpesona/)).toBeInTheDocument()
  })
})
