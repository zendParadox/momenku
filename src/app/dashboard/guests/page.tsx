'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'gooey-toast'
import {
  Users,
  UserCheck,
  Clock,
  UserX,
  Plus,
  Upload,
  Search,
  Loader2,
  Users2,
  ChevronDown,
} from 'lucide-react'
import type { Guest } from '@/components/guests/GuestTable'
import GuestTable, { QrModal } from '@/components/guests/GuestTable'
import AddGuestModal from '@/components/guests/AddGuestModal'
import EditGuestModal from '@/components/guests/EditGuestModal'
import ImportCsvModal from '@/components/guests/ImportCsvModal'
import SendWaModal from '@/components/guests/SendWaModal'

interface Invitation {
  id: string
  title: string
  slug: string | null
}

type StatusFilter = 'all' | 'pending' | 'attending' | 'not_attending' | 'maybe'

export default function GuestsPage() {
  const supabase = createClient()

  const [invitations, setInvitations] = useState<Invitation[]>([])
  const [selectedInvitationId, setSelectedInvitationId] = useState<string>('')
  const [selectedInvitation, setSelectedInvitation] = useState<Invitation | null>(null)
  const [guests, setGuests] = useState<Guest[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')

  // Modal states
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [importModalOpen, setImportModalOpen] = useState(false)
  const [waModalOpen, setWaModalOpen] = useState(false)
  const [qrModalOpen, setQrModalOpen] = useState(false)
  const [editingGuest, setEditingGuest] = useState<Guest | null>(null)
  const [waGuest, setWaGuest] = useState<Guest | null>(null)
  const [qrGuest, setQrGuest] = useState<Guest | null>(null)

  // Fetch invitations
  useEffect(() => {
    async function fetchInvitations() {
      const { data, error } = await supabase
        .from('invitations')
        .select('id, title, slug')
        .order('created_at', { ascending: false })

      if (error) {
        toast.error({ title: 'Gagal memuat undangan', description: error.message })
        return
      }

      setInvitations(data || [])
      if (data && data.length > 0) {
        setSelectedInvitationId(data[0].id)
        setSelectedInvitation(data[0])
      } else {
        setLoading(false)
      }
    }
    fetchInvitations()
  }, [supabase])

  // Fetch guests when invitation changes
  const fetchGuests = useCallback(async () => {
    if (!selectedInvitationId) return

    setLoading(true)
    const { data, error } = await supabase
      .from('guests')
      .select('*')
      .eq('invitation_id', selectedInvitationId)
      .order('created_at', { ascending: false })

    setLoading(false)

    if (error) {
      toast.error({ title: 'Gagal memuat tamu', description: error.message })
      return
    }

    setGuests(data || [])
  }, [supabase, selectedInvitationId])

  useEffect(() => {
    if (selectedInvitationId) {
      fetchGuests()
    }
  }, [selectedInvitationId, fetchGuests])

  // Stats
  const totalCount = guests.length
  const attendingCount = guests.filter((g) => g.attendance_status === 'attending').length
  const pendingCount = guests.filter((g) => g.attendance_status === 'pending').length
  const notAttendingCount = guests.filter((g) => g.attendance_status === 'not_attending').length
  const maybeCount = guests.filter((g) => g.attendance_status === 'maybe').length

  // Filter
  const filteredGuests = guests.filter((guest) => {
    const matchesSearch = guest.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || guest.attendance_status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Handlers
  function handleInvitationChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const id = e.target.value
    setSelectedInvitationId(id)
    const inv = invitations.find((i) => i.id === id)
    setSelectedInvitation(inv || null)
  }

  function handleEdit(guest: Guest) {
    setEditingGuest(guest)
    setEditModalOpen(true)
  }

  async function handleDelete(guest: Guest) {
    const { error } = await supabase.from('guests').delete().eq('id', guest.id)
    if (error) {
      toast.error({ title: 'Gagal menghapus tamu', description: error.message })
      return
    }
    toast.success({ title: `${guest.name} berhasil dihapus` })
    fetchGuests()
  }

  function handleSendWa(guest: Guest) {
    setWaGuest(guest)
    setWaModalOpen(true)
  }

  function handleQrClick(guest: Guest) {
    setQrGuest(guest)
    setQrModalOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-[family-name:var(--font-cormorant)] text-2xl font-bold text-stone-900">
            Manajemen Tamu
          </h2>
          <p className="mt-1 text-sm text-stone-500">Kelola daftar tamu undangan Anda</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setImportModalOpen(true)}
            disabled={!selectedInvitationId}
            className="inline-flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-medium text-stone-600 transition-all hover:bg-stone-50 disabled:opacity-50"
          >
            <Upload className="h-4 w-4" />
            Import CSV
          </button>
          <button
            onClick={() => setAddModalOpen(true)}
            disabled={!selectedInvitationId}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/25 transition-all hover:bg-emerald-700 hover:shadow-xl disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            Tambah Tamu
          </button>
        </div>
      </div>

      {/* Invitation Selector */}
      {invitations.length > 0 && (
        <div className="rounded-2xl border border-stone-200 bg-white p-4">
          <label className="mb-2 block text-xs font-medium text-stone-500">Pilih Undangan</label>
          <div className="relative">
            <select
              value={selectedInvitationId}
              onChange={handleInvitationChange}
              className="w-full appearance-none rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 pr-10 text-sm text-stone-700 focus:border-emerald-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-100"
            >
              {invitations.map((inv) => (
                <option key={inv.id} value={inv.id}>
                  {inv.title}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          </div>
        </div>
      )}

      {/* No invitations */}
      {!loading && invitations.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-stone-200 bg-white py-16">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-stone-100">
            <Users2 className="h-8 w-8 text-stone-300" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-stone-900">Belum ada undangan</h3>
          <p className="mt-1 max-w-sm text-center text-sm text-stone-500">
            Buat undangan terlebih dahulu untuk mulai mengelola tamu.
          </p>
        </div>
      )}

      {/* Stats */}
      {selectedInvitationId && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-2xl border border-stone-200 bg-white p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-stone-100">
                <Users className="h-4.5 w-4.5 text-stone-600" />
              </div>
              <div>
                <p className="text-xl font-bold text-stone-900">{totalCount}</p>
                <p className="text-[11px] text-stone-500">Total Tamu</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-stone-200 bg-white p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50">
                <UserCheck className="h-4.5 w-4.5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xl font-bold text-emerald-700">{attendingCount}</p>
                <p className="text-[11px] text-stone-500">Hadir</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-stone-200 bg-white p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50">
                <Clock className="h-4.5 w-4.5 text-amber-600" />
              </div>
              <div>
                <p className="text-xl font-bold text-amber-700">{pendingCount}</p>
                <p className="text-[11px] text-stone-500">Belum RSVP</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl border border-stone-200 bg-white p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50">
                <UserX className="h-4.5 w-4.5 text-red-600" />
              </div>
              <div>
                <p className="text-xl font-bold text-red-600">{notAttendingCount + maybeCount}</p>
                <p className="text-[11px] text-stone-500">Tidak / Mungkin</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search & Filter */}
      {selectedInvitationId && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-stone-200 bg-white py-2.5 pl-10 pr-4 text-sm text-stone-700 focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-100"
              placeholder="Cari tamu..."
            />
          </div>
          <div className="flex items-center gap-2">
            {(
              [
                { key: 'all', label: 'Semua' },
                { key: 'pending', label: 'Pending' },
                { key: 'attending', label: 'Hadir' },
                { key: 'not_attending', label: 'Tidak Hadir' },
                { key: 'maybe', label: 'Mungkin' },
              ] as const
            ).map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setStatusFilter(key)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                  statusFilter === key
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white text-stone-500 hover:bg-stone-50 hover:text-stone-700'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Guest Table */}
      {loading && selectedInvitationId ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
        </div>
      ) : selectedInvitationId && filteredGuests.length === 0 && guests.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-stone-200 bg-white py-16">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
            <Users className="h-8 w-8 text-emerald-300" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-stone-900">Belum ada tamu</h3>
          <p className="mt-1 max-w-sm text-center text-sm text-stone-500">
            Tambahkan tamu secara manual atau import dari file CSV.
          </p>
          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={() => setImportModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-medium text-stone-600 transition-all hover:bg-stone-50"
            >
              <Upload className="h-4 w-4" />
              Import CSV
            </button>
            <button
              onClick={() => setAddModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/25 transition-all hover:bg-emerald-700 hover:shadow-xl"
            >
              <Plus className="h-4 w-4" />
              Tambah Tamu
            </button>
          </div>
        </div>
      ) : selectedInvitationId && filteredGuests.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-stone-200 bg-white py-12">
          <p className="text-sm text-stone-500">Tidak ada tamu yang cocok dengan pencarian</p>
        </div>
      ) : selectedInvitationId ? (
        <GuestTable
          guests={filteredGuests}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onSendWa={handleSendWa}
          onQrClick={handleQrClick}
        />
      ) : null}

      {/* Modals */}
      {selectedInvitationId && (
        <>
          <AddGuestModal
            invitationId={selectedInvitationId}
            isOpen={addModalOpen}
            onClose={() => setAddModalOpen(false)}
            onGuestAdded={fetchGuests}
          />
          {editingGuest && (
            <EditGuestModal
              guest={editingGuest}
              isOpen={editModalOpen}
              onClose={() => {
                setEditModalOpen(false)
                setEditingGuest(null)
              }}
              onGuestUpdated={fetchGuests}
            />
          )}
          <ImportCsvModal
            invitationId={selectedInvitationId}
            isOpen={importModalOpen}
            onClose={() => setImportModalOpen(false)}
            onImportComplete={fetchGuests}
          />
          {waGuest && selectedInvitation && (
            <SendWaModal
              guest={waGuest}
              invitationTitle={selectedInvitation.title}
              invitationSlug={selectedInvitation.slug || selectedInvitation.id}
              isOpen={waModalOpen}
              onClose={() => {
                setWaModalOpen(false)
                setWaGuest(null)
              }}
            />
          )}
          <QrModal
            guest={qrGuest}
            invitationSlug={selectedInvitation?.slug || selectedInvitationId}
            isOpen={qrModalOpen}
            onClose={() => {
              setQrModalOpen(false)
              setQrGuest(null)
            }}
          />
        </>
      )}
    </div>
  )
}
