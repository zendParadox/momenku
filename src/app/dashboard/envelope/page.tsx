'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Loader2, ExternalLink, Copy, Gift } from 'lucide-react'
import { toast } from 'gooey-toast'

interface Invitation {
  id: string
  title: string
  slug: string | null
  status: string
}

export default function EnvelopeDashboardPage() {
  const supabase = createClient()
  const [invitations, setInvitations] = useState<Invitation[]>([])
  const [loading, setLoading] = useState(true)

  const baseUrl =
    typeof window !== 'undefined' ? window.location.origin : ''

  useEffect(() => {
    async function fetchInvitations() {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('invitations')
        .select('id, title, slug, status')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      setInvitations(data || [])
      setLoading(false)
    }
    fetchInvitations()
  }, [supabase])

  function getEnvelopeUrl(inv: Invitation): string {
    return inv.slug
      ? `${baseUrl}/envelope/${inv.id}`
      : `${baseUrl}/envelope/${inv.id}`
  }

  async function copyUrl(url: string) {
    try {
      await navigator.clipboard.writeText(url)
      toast.success({
        title: 'URL tersalin!',
        description: 'Link amplop digital telah disalin ke clipboard',
      })
    } catch {
      toast.error({
        title: 'Gagal menyalin',
        description: 'Silakan salin URL secara manual',
      })
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-[family-name:var(--font-cormorant)] text-3xl font-bold text-stone-900">
          Amplop Digital
        </h1>
        <p className="text-sm text-stone-500 mt-1">
          Bagikan link amplop digital untuk menerima hadiah pernikahan
        </p>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
        </div>
      ) : invitations.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-stone-200 bg-white py-20">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-stone-100">
            <Gift className="h-8 w-8 text-stone-300" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-stone-900">
            Belum ada undangan
          </h3>
          <p className="mt-1 max-w-sm text-center text-sm text-stone-500">
            Buat undangan terlebih dahulu untuk mengaktifkan fitur amplop digital.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {invitations.map((inv) => {
            const envelopeUrl = getEnvelopeUrl(inv)
            return (
              <div
                key={inv.id}
                className="rounded-2xl border border-stone-200 bg-white p-5 transition-all hover:border-emerald-200 hover:shadow-md"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-stone-900">{inv.title}</h3>
                  {inv.status === 'published' ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      Live
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700">
                      Draft
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={envelopeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-emerald-700"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Lihat Amplop
                  </a>
                  <button
                    onClick={() => copyUrl(envelopeUrl)}
                    className="flex items-center gap-1.5 rounded-lg border border-stone-200 bg-white px-3 py-2 text-xs font-medium text-stone-600 transition-colors hover:bg-stone-50"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    Salin Link
                  </button>
                </div>

                <p className="mt-3 text-xs text-stone-400 break-all font-mono">
                  {envelopeUrl}
                </p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
