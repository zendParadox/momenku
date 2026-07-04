import type { Metadata } from 'next'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'MomenKu — Masuk atau Daftar',
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-dvh">
      {/* Left side — branding */}
      <div className="hidden relative w-1/2 items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-600 to-emerald-700 lg:flex">
        {/* Decorative circles */}
        <div className="pointer-events-none absolute -left-20 -top-20 h-[400px] w-[400px] rounded-full bg-emerald-500/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-16 h-[360px] w-[360px] rounded-full bg-emerald-400/20 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-md px-8 text-center">
          <span className="font-[family-name:var(--font-script)] text-5xl text-white">
            MomenKu
          </span>
          <h2 className="mt-4 font-[family-name:var(--font-cormorant)] text-3xl font-bold text-white">
            Undangan Digital yang Bikin
            <br />
            Tamu Terpesona
          </h2>
          <p className="mt-4 text-base leading-relaxed text-emerald-100">
            Buat undangan website custom dalam 10 menit. AI-powered, 500+ tema,
            real-time analytics.
          </p>

          <div className="mt-10 flex items-center justify-center gap-8">
            <div className="text-center">
              <span className="block text-2xl font-bold text-white">500+</span>
              <span className="text-sm text-emerald-200">Tema</span>
            </div>
            <div className="h-8 w-px bg-emerald-400/40" />
            <div className="text-center">
              <span className="block text-2xl font-bold text-white">10rb+</span>
              <span className="text-sm text-emerald-200">Pengguna</span>
            </div>
            <div className="h-8 w-px bg-emerald-400/40" />
            <div className="text-center">
              <span className="block text-2xl font-bold text-white">4.9★</span>
              <span className="text-sm text-emerald-200">Rating</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side — form */}
      <div className="flex w-full items-center justify-center bg-white px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-md">
          <Suspense>{children}</Suspense>
        </div>
      </div>
    </div>
  )
}
