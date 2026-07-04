'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'gooey-toast'
import { Mail, Lock, User, Eye, EyeOff, Loader2 } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  const supabase = createClient()

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()

    // Validation
    if (!fullName.trim()) {
      toast.error({ title: 'Nama lengkap harus diisi' })
      return
    }
    if (!email) {
      toast.error({ title: 'Email harus diisi' })
      return
    }
    if (password.length < 6) {
      toast.error({ title: 'Password minimal 6 karakter' })
      return
    }
    if (password !== confirmPassword) {
      toast.error({ title: 'Konfirmasi password tidak cocok' })
      return
    }

    setLoading(true)
    toast.info({ title: 'Sedang membuat akun...', description: 'Tunggu sebentar' })

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName.trim(),
        },
      },
    })

    if (error) {
      toast.error({
        title: 'Gagal daftar',
        description: error.message,
      })
      setLoading(false)
      return
    }

    toast.success({
      title: 'Berhasil daftar!',
      description: 'Cek email untuk verifikasi akun.',
    })

    // If email confirmation is disabled, user is signed in immediately
    window.location.href = '/dashboard'
  }

  async function handleGoogleRegister() {
    setGoogleLoading(true)
    toast.info({ title: 'Mengarahkan ke Google...', description: 'Silakan pilih akun Google Anda' })

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      toast.error({
        title: 'Gagal daftar dengan Google',
        description: error.message,
      })
      setGoogleLoading(false)
    }
  }

  return (
    <div>
      {/* Mobile logo */}
      <div className="mb-8 text-center lg:hidden">
        <span className="font-[family-name:var(--font-script)] text-3xl text-emerald-600">
          MomenKu
        </span>
      </div>

      {/* Title */}
      <h1 className="font-[family-name:var(--font-cormorant)] text-3xl font-bold text-stone-900">
        Daftar ke MomenKu
      </h1>
      <p className="mt-2 text-sm text-stone-500">
        Sudah punya akun?{' '}
        <Link
          href="/login"
          className="font-medium text-emerald-600 transition-colors hover:text-emerald-700"
        >
          Masuk
        </Link>
      </p>

      {/* Form */}
      <form onSubmit={handleRegister} className="mt-8 space-y-5">
        {/* Full Name */}
        <div>
          <label
            htmlFor="fullName"
            className="mb-1.5 block text-sm font-medium text-stone-700"
          >
            Nama Lengkap
          </label>
          <div className="relative">
            <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Nama lengkap"
              autoComplete="name"
              className="h-11 w-full rounded-xl border border-stone-200 bg-stone-50 pl-10 pr-4 text-sm text-stone-900 outline-none transition-colors placeholder:text-stone-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-sm font-medium text-stone-700"
          >
            Email
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              autoComplete="email"
              className="h-11 w-full rounded-xl border border-stone-200 bg-stone-50 pl-10 pr-4 text-sm text-stone-900 outline-none transition-colors placeholder:text-stone-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="mb-1.5 block text-sm font-medium text-stone-700"
          >
            Password
          </label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimal 6 karakter"
              autoComplete="new-password"
              className="h-11 w-full rounded-xl border border-stone-200 bg-stone-50 pl-10 pr-11 text-sm text-stone-900 outline-none transition-colors placeholder:text-stone-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 transition-colors hover:text-stone-600"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label
            htmlFor="confirmPassword"
            className="mb-1.5 block text-sm font-medium text-stone-700"
          >
            Konfirmasi Password
          </label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            <input
              id="confirmPassword"
              type={showConfirm ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Ulangi password"
              autoComplete="new-password"
              className="h-11 w-full rounded-xl border border-stone-200 bg-stone-50 pl-10 pr-11 text-sm text-stone-900 outline-none transition-colors placeholder:text-stone-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 transition-colors hover:text-stone-600"
              tabIndex={-1}
            >
              {showConfirm ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="flex h-11 w-full items-center justify-center rounded-xl bg-emerald-600 text-sm font-semibold text-white shadow-lg shadow-emerald-600/25 transition-all hover:bg-emerald-700 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            'Daftar'
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-stone-200" />
        <span className="text-xs font-medium text-stone-400">atau</span>
        <div className="h-px flex-1 bg-stone-200" />
      </div>

      {/* Google OAuth */}
      <button
        type="button"
        onClick={handleGoogleRegister}
        disabled={googleLoading}
        className="flex h-11 w-full items-center justify-center gap-2.5 rounded-xl border border-stone-200 bg-white text-sm font-medium text-stone-700 transition-all hover:border-stone-300 hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {googleLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <svg className="h-4 w-4" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
        )}
        Daftar dengan Google
      </button>
    </div>
  )
}
