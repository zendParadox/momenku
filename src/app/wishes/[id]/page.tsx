'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import WishForm from '@/components/wishes/WishForm'
import WishList from '@/components/wishes/WishList'
import { Loader2, Heart } from 'lucide-react'

interface Wish {
  id: string
  guest_name: string
  message: string
  created_at: string
}

interface InvitationData {
  id: string
  title: string
  sections: Array<{
    type: string
    data: Record<string, unknown>
    visible: boolean
  }>
  theme_overrides: Record<string, string> | null
}

export default function WishesPage() {
  const params = useParams()
  const id = params.id as string

  const [invitation, setInvitation] = useState<InvitationData | null>(null)
  const [wishes, setWishes] = useState<Wish[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    const supabase = createClient()

    // Load invitation
    supabase
      .from('invitations')
      .select('id, title, sections, theme_overrides')
      .eq('id', id)
      .single()
      .then(({ data, error: fetchError }) => {
        if (fetchError || !data) {
          setError('Undangan tidak ditemukan')
          setLoading(false)
          return
        }
        setInvitation(data as InvitationData)

        // Load wishes
        supabase
          .from('wishes')
          .select('*')
          .eq('invitation_id', id)
          .order('created_at', { ascending: false })
          .then(({ data: wishesData }) => {
            setWishes(wishesData || [])
            setLoading(false)
          })
      })
  }, [id])

  // Extract theme overrides
  const themePrimary = invitation?.theme_overrides?.primaryColor || '#059669'
  const themeFontHeading = invitation?.theme_overrides?.fontHeading
    ? `var(--font-${invitation.theme_overrides.fontHeading})`
    : 'var(--font-cormorant)'
  const themeFontBody = invitation?.theme_overrides?.fontBody
    ? `var(--font-${invitation.theme_overrides.fontBody})`
    : 'var(--font-jakarta)'

  // Find wishes section data
  const wishesSection = invitation?.sections?.find(
    (s) => s.type === 'wishes' && s.visible
  )
  const wishesData = wishesSection?.data as
    | { title?: string; showSocialProof?: boolean }
    | undefined

  // Find couple names
  const coupleSection = invitation?.sections?.find(
    (s) => s.type === 'couple' && s.visible
  )
  const coupleData = coupleSection?.data as
    | { groomName?: string; brideName?: string }
    | undefined

  function handleWishSubmitted(wish: Wish) {
    setWishes((prev) => [wish, ...prev])
  }

  if (loading) {
    return (
      <div className="text-center py-20">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3" style={{ color: '#059669' }} />
        <p className="text-sm" style={{ color: '#78716c' }}>
          Memuat ucapan...
        </p>
      </div>
    )
  }

  if (error || !invitation) {
    return (
      <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-stone-100">
        <div className="text-4xl mb-4">😢</div>
        <p className="text-lg font-semibold mb-2" style={{ color: '#1c1917' }}>
          {error || 'Undangan tidak ditemukan'}
        </p>
        <p className="text-sm" style={{ color: '#78716c' }}>
          Pastikan link yang Anda buka sudah benar.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6 sm:p-8">
      {/* Couple names header */}
      {coupleData && (
        <div className="text-center mb-6 pb-6 border-b border-stone-100">
          <p
            className="text-xs tracking-[0.2em] uppercase mb-1"
            style={{ color: themePrimary, fontFamily: themeFontBody }}
          >
            The Wedding of
          </p>
          <h1
            className="text-2xl sm:text-3xl font-bold"
            style={{ color: '#1c1917', fontFamily: themeFontHeading }}
          >
            {coupleData.groomName} & {coupleData.brideName}
          </h1>
        </div>
      )}

      {/* Title */}
      <div className="text-center mb-6">
        <div
          className="w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center"
          style={{ backgroundColor: `${themePrimary}15` }}
        >
          <Heart className="w-6 h-6" style={{ color: themePrimary }} />
        </div>
        <h2
          className="text-2xl font-semibold"
          style={{ color: '#1c1917', fontFamily: themeFontHeading }}
        >
          {wishesData?.title || 'Ucapan & Doa'}
        </h2>
        <div
          className="w-12 h-px mx-auto mt-3"
          style={{ backgroundColor: themePrimary, opacity: 0.5 }}
        />
        {wishesData?.showSocialProof && wishes.length > 0 && (
          <p
            className="text-xs mt-3"
            style={{ color: '#a8a29e', fontFamily: themeFontBody }}
          >
            {wishes.length} orang sudah mengirim ucapan
          </p>
        )}
      </div>

      {/* Wish Form */}
      <div className="mb-6">
        <WishForm
          invitationId={id}
          onWishSubmitted={handleWishSubmitted}
          themePrimary={themePrimary}
          themeFontBody={themeFontBody}
        />
      </div>

      {/* Wishes List */}
      <div className="border-t border-stone-100 pt-6">
        <WishList
          initialWishes={wishes}
          themePrimary={themePrimary}
          themeFontBody={themeFontBody}
        />
      </div>
    </div>
  )
}
