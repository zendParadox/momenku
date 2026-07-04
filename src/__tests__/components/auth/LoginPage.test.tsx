import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock gooey-toast
vi.mock('gooey-toast', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

// Mock lucide-react icons
vi.mock('lucide-react', () => ({
  Mail: () => <span data-testid="icon-mail" />,
  Lock: () => <span data-testid="icon-lock" />,
  Eye: () => <span data-testid="icon-eye" />,
  EyeOff: () => <span data-testid="icon-eyeoff" />,
  Loader2: () => <span data-testid="icon-loader" />,
}))

// Mock Supabase
vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn(() => ({
    auth: {
      signInWithPassword: vi.fn().mockResolvedValue({ data: {}, error: null }),
      signInWithOAuth: vi.fn().mockResolvedValue({ data: {}, error: null }),
    },
  })),
}))

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    prefetch: vi.fn(),
  })),
}))

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

import LoginPage from '@/app/(auth)/login/page'

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the page title', () => {
    render(<LoginPage />)
    expect(screen.getByText('Masuk ke MomenKu')).toBeInTheDocument()
  })

  it('renders email and password inputs', () => {
    render(<LoginPage />)
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
  })

  it('renders the "Masuk" submit button', () => {
    render(<LoginPage />)
    expect(screen.getByRole('button', { name: 'Masuk' })).toBeInTheDocument()
  })

  it('renders Google login button', () => {
    render(<LoginPage />)
    expect(screen.getByText('Masuk dengan Google')).toBeInTheDocument()
  })

  it('has link to register page', () => {
    render(<LoginPage />)
    const registerLink = screen.getByText('Daftar gratis')
    expect(registerLink).toHaveAttribute('href', '/register')
  })

  it('has link to login page from register text', () => {
    render(<LoginPage />)
    expect(screen.getByText('Belum punya akun?')).toBeInTheDocument()
  })

  it('toggle password visibility shows/hides password', () => {
    render(<LoginPage />)
    const passwordInput = screen.getByLabelText('Password')
    expect(passwordInput).toHaveAttribute('type', 'password')

    // Find and click the eye toggle button
    const toggleButton = passwordInput.closest('.relative')?.querySelector('button[type="button"]')
    expect(toggleButton).toBeInTheDocument()
    
    fireEvent.click(toggleButton!)
    expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'text')
  })

  it('renders email input with correct placeholder', () => {
    render(<LoginPage />)
    expect(screen.getByPlaceholderText('nama@email.com')).toBeInTheDocument()
  })

  it('renders password input with correct placeholder', () => {
    render(<LoginPage />)
    expect(screen.getByPlaceholderText('Masukkan password')).toBeInTheDocument()
  })

  it('allows typing in email input', () => {
    render(<LoginPage />)
    const emailInput = screen.getByLabelText('Email')
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    expect(emailInput).toHaveValue('test@example.com')
  })

  it('allows typing in password input', () => {
    render(<LoginPage />)
    const passwordInput = screen.getByLabelText('Password')
    fireEvent.change(passwordInput, { target: { value: 'secret123' } })
    expect(passwordInput).toHaveValue('secret123')
  })
})
