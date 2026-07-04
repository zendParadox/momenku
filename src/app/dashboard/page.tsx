'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'gooey-toast'
import {
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

export default function DashboardPage() {
  const router = useRouter()
  const supabase = createClient()

  const [invitations, setInvitations] = useState<Invitation[]>([])
  const [loading, setLoading] = useState(true)
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    async function ensureProfileAndFetch() {
      setLoading(true)

      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) {
        toast.error({ title: 'Sesi habis', description: 'Silakan login kembali' })
        router.push('/login')
        return
      }

      // Check if profile exists, create if not
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single()

      if (!profile) {
        // Profile doesn't exist — create it
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            full_name: user.user_metadata?.full_name || '',
            avatar_url: user.user_metadata?.avatar_url || '',
          })

        if (insertError) {
          console.error('Failed to create profile:', insertError)
          // If RLS blocks insert, the profile might be created by trigger
          // Just wait and retry
          if (retryCount < 2) {
            setRetryCount((c) => c + 1)
            setLoading(false)
            return
          }
        }
      }

      // Now fetch invitations
      const { data, error } = await supabase
        .from('invitations')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        if (error.code === '42501' || error.message.includes('permission')) {
          // RLS error — profile might still be missing
          toast.error({
            title: 'Gagal memuat undangan',
            description: 'Mencoba memperbaiki akses...',
          })
          // Try to create profile again
          await supabase
            .from('profiles')
            .insert({
              id: user.id,
              full_name: user.user_metadata?.full_name || '',
              avatar_url: user.user_metadata?.avatar_url || '',
            })
            .select()
          // Retry fetch
          const { data: retryData } = await supabase
            .from('invitations')
            .select('*')
            .order('created_at', { ascending: false })
          setInvitations(retryData || [])
        } else {
          toast.error({ title: 'Gagal memuat undangan', description: error.message })
        }
      } else {
        setInvitations(data || [])
      }
      setLoading(false)
    }

    ensureProfileAndFetch()
  }, [supabase, router, retryCount])

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
    <>
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
          href="/dashboard/editor/new"
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
            href="/dashboard/editor/new"
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
              href={`/dashboard/editor/${inv.id}`}
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
    </>
  )
}
