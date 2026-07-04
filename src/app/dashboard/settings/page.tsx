'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'gooey-toast'
import { User, Mail, Shield, CreditCard, Trash2, Loader2, Save } from 'lucide-react'

export default function SettingsPage() {
  const supabase = createClient()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [tier, setTier] = useState('free')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function fetchUser() {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error || !user) {
        toast.error({ title: 'Gagal memuat profil', description: error?.message || 'User not found' })
        setLoading(false)
        return
      }
      setEmail(user.email || '')
      setFullName(user.user_metadata?.full_name || '')

      // Fetch tier from profiles table
      const { data: profile } = await supabase
        .from('profiles')
        .select('tier')
        .eq('id', user.id)
        .single()

      if (profile?.tier) {
        setTier(profile.tier)
      }
      setLoading(false)
    }

    fetchUser()
  }, [supabase])

  async function handleSaveProfile() {
    setSaving(true)
    const { error } = await supabase.auth.updateUser({
      data: { full_name: fullName },
    })
    setSaving(false)

    if (error) {
      toast.error({ title: 'Gagal menyimpan', description: error.message })
    } else {
      toast.success({ title: 'Profil berhasil diperbarui' })
    }
  }

  const tierLabels: Record<string, { label: string; color: string }> = {
    free: { label: 'Gratis', color: 'bg-stone-100 text-stone-600' },
    basic: { label: 'Basic', color: 'bg-blue-100 text-blue-700' },
    premium: { label: 'Premium', color: 'bg-emerald-100 text-emerald-700' },
    enterprise: { label: 'Enterprise', color: 'bg-amber-100 text-amber-700' },
  }

  const currentTier = tierLabels[tier] || tierLabels.free
  const initials = fullName.charAt(0).toUpperCase() || email.charAt(0).toUpperCase()

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      {/* Header */}
      <div>
        <h2 className="font-[family-name:var(--font-cormorant)] text-2xl font-bold text-stone-900">
          Pengaturan
        </h2>
        <p className="mt-1 text-sm text-stone-500">
          Kelola profil dan akun Anda
        </p>
      </div>

      {/* Profile Section */}
      <div className="rounded-2xl border border-stone-200 bg-white p-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
            <User className="h-5 w-5 text-emerald-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-stone-900">Profil</h3>
            <p className="text-xs text-stone-500">Informasi dasar akun Anda</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-xl font-bold text-emerald-700">
              {initials}
            </div>
            <div>
              <p className="text-sm font-medium text-stone-700">{fullName || 'User'}</p>
              <p className="text-xs text-stone-400">Avatar diambil dari inisial nama</p>
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="mb-1 block text-xs font-medium text-stone-600">Nama Lengkap</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm text-stone-700 focus:border-emerald-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-100"
              placeholder="Masukkan nama lengkap"
            />
          </div>

          {/* Email */}
          <div>
            <label className="mb-1 block text-xs font-medium text-stone-600">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
              <input
                type="email"
                value={email}
                readOnly
                className="w-full rounded-xl border border-stone-200 bg-stone-100 py-2.5 pl-10 pr-4 text-sm text-stone-500"
              />
            </div>
          </div>

          {/* Save button */}
          <button
            onClick={handleSaveProfile}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Simpan Perubahan
          </button>
        </div>
      </div>

      {/* Password Section */}
      <div className="rounded-2xl border border-stone-200 bg-white p-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
            <Shield className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-stone-900">Keamanan</h3>
            <p className="text-xs text-stone-500">Ubah kata sandi Anda</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-stone-600">Kata Sandi Saat Ini</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm text-stone-700 focus:border-emerald-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-100"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-stone-600">Kata Sandi Baru</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm text-stone-700 focus:border-emerald-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-100"
            />
          </div>
          <button
            onClick={() => toast.info({ title: 'Fitur segera hadir', description: 'Ubah kata sandi akan tersedia di pembaruan berikutnya.' })}
            className="inline-flex items-center gap-2 rounded-xl border border-stone-200 bg-stone-50 px-5 py-2.5 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-100"
          >
            <Shield className="h-4 w-4" />
            Ubah Kata Sandi
          </button>
        </div>
      </div>

      {/* Subscription Section */}
      <div className="rounded-2xl border border-stone-200 bg-white p-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50">
            <CreditCard className="h-5 w-5 text-amber-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-stone-900">Langganan</h3>
            <p className="text-xs text-stone-500">Paket saat ini Anda</p>
          </div>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-stone-100 bg-stone-50 p-4">
          <div>
            <p className="text-xs text-stone-500">Paket Aktif</p>
            <p className="mt-1 text-sm font-semibold text-stone-900 capitalize">{tier}</p>
          </div>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${currentTier.color}`}>
            {currentTier.label}
          </span>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rounded-2xl border border-red-200 bg-white p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50">
            <Trash2 className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-red-900">Zona Bahaya</h3>
            <p className="text-xs text-stone-500">Tindakan yang tidak dapat dibatalkan</p>
          </div>
        </div>

        <button
          onClick={() => toast.info({ title: 'Fitur segera hadir', description: 'Hapus akun akan tersedia di pembaruan berikutnya.' })}
          className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-5 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-100"
        >
          <Trash2 className="h-4 w-4" />
          Hapus Akun
        </button>
      </div>
    </div>
  )
}
