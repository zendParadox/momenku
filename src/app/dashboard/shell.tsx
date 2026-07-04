'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'gooey-toast'
import Link from 'next/link'
import {
  LayoutDashboard,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  Plus,
  Users,
} from 'lucide-react'
import type { User } from '@supabase/supabase-js'

const sidebarLinks = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Template', href: '/dashboard/templates', icon: FileText },
  { label: 'Statistik RSVP', href: '/dashboard/rsvp', icon: Users },
  { label: 'Pengaturan', href: '/dashboard/settings', icon: Settings },
]

export default function DashboardShell({
  children,
  user,
}: {
  children: React.ReactNode
  user: User
}) {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()
  const [mobileOpen, setMobileOpen] = useState(false)

  async function handleLogout() {
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast.error({ title: 'Gagal logout', description: error.message })
      return
    }
    window.location.href = '/login'
  }

  const userName = user.user_metadata?.full_name || user.email || 'User'
  const initials = userName.charAt(0).toUpperCase()

  function NavLink({ link }: { link: (typeof sidebarLinks)[0] }) {
    const Icon = link.icon
    const isActive = pathname === link.href
    return (
      <Link
        href={link.href}
        onClick={() => setMobileOpen(false)}
        className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
          isActive
            ? 'bg-emerald-50 text-emerald-700'
            : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
        }`}
      >
        <Icon className="h-4 w-4" />
        {link.label}
      </Link>
    )
  }

  return (
    <div className="flex min-h-dvh bg-stone-50">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 flex-col border-r border-stone-200 bg-white lg:flex">
        {/* Logo */}
        <div className="flex h-16 items-center border-b border-stone-200 px-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-[family-name:var(--font-script)] text-xl text-emerald-600">
              MomenKu
            </span>
          </Link>
        </div>

        {/* Nav */}
        <div className="flex-1 px-3 py-4">
          <Link
            href="/dashboard/editor/new"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/25 transition-all hover:bg-emerald-700 hover:shadow-xl"
          >
            <Plus className="h-4 w-4" />
            Buat Undangan
          </Link>
          <nav className="mt-4 space-y-1">
            {sidebarLinks.map((link) => (
              <NavLink key={link.href} link={link} />
            ))}
          </nav>
        </div>

        {/* Logout */}
        <div className="border-t border-stone-200 p-3">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-stone-500 transition-colors hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="h-4 w-4" />
            Keluar
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-stone-900/20 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-stone-200 bg-white transition-transform duration-200 lg:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-stone-200 px-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-[family-name:var(--font-script)] text-xl text-emerald-600">
              MomenKu
            </span>
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-stone-500 hover:bg-stone-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 px-3 py-4">
          <Link
            href="/dashboard/editor/new"
            onClick={() => setMobileOpen(false)}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/25 transition-all hover:bg-emerald-700 hover:shadow-xl"
          >
            <Plus className="h-4 w-4" />
            Buat Undangan
          </Link>
          <nav className="mt-4 space-y-1">
            {sidebarLinks.map((link) => (
              <NavLink key={link.href} link={link} />
            ))}
          </nav>
        </div>

        <div className="border-t border-stone-200 p-3">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-stone-500 transition-colors hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="h-4 w-4" />
            Keluar
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        {/* Top bar */}
        <header className="flex h-16 items-center justify-between border-b border-stone-200 bg-white px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-stone-600 hover:bg-stone-100 lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </button>
            <h1 className="font-[family-name:var(--font-cormorant)] text-xl font-bold text-stone-900">
              Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
                {initials}
              </div>
              <span className="hidden text-sm font-medium text-stone-700 sm:block">
                {userName}
              </span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
    </div>
  )
}
