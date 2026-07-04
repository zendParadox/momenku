'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'gooey-toast'
import {
  LayoutDashboard,
  FileText,
  Settings,
  LogOut,
  Plus,
  Eye,
  Users,
  Mail,
  Loader2,
  ChevronRight,
} from 'lucide-react'
import Link from 'next/link'

interface Invitation {
  id: string
  title: string
  slug: string | null
  status: 'draft' | 'published' | 'archived'
  event_type: string
  view_count: number
  rsvp_count: number
  created_at: string
}

const sidebarLinks = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Template', href: '/dashboard/templates', icon: FileText },
  { label: 'Pengaturan', href: '/dashboard/settings', icon: Settings },
]

export default function DashboardPage() {
  const router = useRouter()
  const supabase = createClient()

  const [invitations, setInvitations] = useState<Invitation[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<{ email?: string; user_metadata?: Record<string, string> } | null>(null)

  useEffect(() => {
    async function fetchUser() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    fetchUser()
  }, [supabase])

  useEffect(() => {
    async function fetchInvitations() {
      setLoading(true)
      const { data, error } = await supabase
        .from('invitations')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        toast.error({ title: 'Gagal memuat undangan', description: error.message })
      } else {
        setInvitations(data || [])
      }
      setLoading(false)
    }

    fetchInvitations()
  }, [supabase])

  async function handleLogout() {
    const { error } = await supabase.auth.signOut()
    if (error) {
      toast.error({ title: 'Gagal logout', description: error.message })
      return
    }
    router.push('/login')
  }

  const totalViews = invitations.reduce((sum, inv) => sum + (inv.view_count || 0), 0)
  const totalRsvps = invitations.reduce((sum, inv) => sum + (inv.rsvp_count || 0), 0)

  const statusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Published
          </span>
        )
      case 'archived':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-medium text-stone-500">
            <span className="h-1.5 w-1.5 rounded-full bg-stone-400" />
            Archived
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            Draft
          </span>
        )
    }
  }

  return (
    <div className="flex min-h-dvh bg-stone-50">
      {/* Sidebar */}
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
        <nav className="flex-1 space-y-1 px-3 py-4">
          {sidebarLinks.map((link) => {
            const Icon = link.icon
            const isActive = link.href === '/dashboard'
            return (
              <Link
                key={link.href}
                href={link.href}
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
          })}
        </nav>

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

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        {/* Top bar */}
        <header className="flex h-16 items-center justify-between border-b border-stone-200 bg-white px-6">
          <div>
            <h1 className="font-[family-name:var(--font-cormorant)] text-xl font-bold text-stone-900">
              Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
                {(user?.user_metadata?.full_name || user?.email || '?')
                  .charAt(0)
                  .toUpperCase()}
              </div>
              <span className="hidden text-sm font-medium text-stone-700 sm:block">
                {user?.user_metadata?.full_name || user?.email || 'User'}
              </span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">
          {/* Stats */}
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-stone-200 bg-white p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
                  <Mail className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-stone-900">
                    {invitations.length}
                  </p>
                  <p className="text-xs text-stone-500">Total Undangan</p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-stone-200 bg-white p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
                  <Eye className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-stone-900">{totalViews}</p>
                  <p className="text-xs text-stone-500">Total Views</p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-stone-200 bg-white p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50">
                  <Users className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-stone-900">{totalRsvps}</p>
                  <p className="text-xs text-stone-500">Total RSVP</p>
                </div>
              </div>
            </div>
          </div>

          {/* Header row */}
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-[family-name:var(--font-cormorant)] text-2xl font-bold text-stone-900">
              Undangan Saya
            </h2>
            <Link
              href="/dashboard/new"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/25 transition-all hover:bg-emerald-700 hover:shadow-xl"
            >
              <Plus className="h-4 w-4" />
              Buat Baru
            </Link>
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
            </div>
          ) : invitations.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-stone-200 bg-white py-20">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
                <Mail className="h-8 w-8 text-emerald-400" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-stone-900">
                Belum ada undangan
              </h3>
              <p className="mt-1 max-w-sm text-center text-sm text-stone-500">
                Mulai buat undangan digital pertama Anda. Pilih dari 500+ template
                yang tersedia.
              </p>
              <Link
                href="/dashboard/new"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/25 transition-all hover:bg-emerald-700 hover:shadow-xl"
              >
                <Plus className="h-4 w-4" />
                Buat Undangan
              </Link>
            </div>
          ) : (
            /* Invitation grid */
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {invitations.map((inv) => (
                <Link
                  key={inv.id}
                  href={`/dashboard/${inv.id}`}
                  className="group rounded-2xl border border-stone-200 bg-white p-5 transition-all hover:border-emerald-200 hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-stone-900 group-hover:text-emerald-700">
                      {inv.title}
                    </h3>
                    <ChevronRight className="h-4 w-4 text-stone-300 transition-colors group-hover:text-emerald-600" />
                  </div>
                  <p className="mt-1 text-xs capitalize text-stone-400">
                    {inv.event_type}
                  </p>
                  <div className="mt-3">{statusBadge(inv.status)}</div>
                  <div className="mt-4 flex items-center gap-4 border-t border-stone-100 pt-3 text-xs text-stone-500">
                    <span className="flex items-center gap-1">
                      <Eye className="h-3.5 w-3.5" />
                      {inv.view_count || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      {inv.rsvp_count || 0}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
