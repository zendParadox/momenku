'use client'

import { useState } from 'react'
import { toast } from 'gooey-toast'
import {
  Pencil,
  Trash2,
  MessageCircle,
  QrCode,
  ArrowUpDown,
  ChevronUp,
  ChevronDown,
} from 'lucide-react'
import QrCodeComponent from './QrCode'

export interface Guest {
  id: string
  invitation_id: string
  name: string
  email: string | null
  phone: string | null
  whatsapp_number: string | null
  attendance_status: 'pending' | 'attending' | 'not_attending' | 'maybe'
  guest_count: number
  companion_names: string | null
  invite_sent: boolean
  invite_sent_at: string | null
  qr_code: string
  created_at: string
  updated_at: string
}

interface GuestTableProps {
  guests: Guest[]
  onEdit: (guest: Guest) => void
  onDelete: (guest: Guest) => void
  onSendWa: (guest: Guest) => void
  onQrClick: (guest: Guest) => void
}

type SortKey = 'name' | 'attendance_status' | 'guest_count'
type SortDir = 'asc' | 'desc'

function statusBadge(status: Guest['attendance_status']) {
  switch (status) {
    case 'attending':
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Hadir
        </span>
      )
    case 'not_attending':
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-600">
          <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
          Tidak Hadir
        </span>
      )
    case 'maybe':
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-600">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
          Mungkin
        </span>
      )
    default:
      return (
        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
          Belum RSVP
        </span>
      )
  }
}

function SortButton({
  label,
  active,
  dir,
  onClick,
}: {
  label: string
  active: boolean
  dir: SortDir
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1 text-xs font-medium transition-colors ${
        active ? 'text-emerald-700' : 'text-stone-400 hover:text-stone-600'
      }`}
    >
      {label}
      {active ? (
        dir === 'asc' ? (
          <ChevronUp className="h-3 w-3" />
        ) : (
          <ChevronDown className="h-3 w-3" />
        )
      ) : (
        <ArrowUpDown className="h-3 w-3" />
      )}
    </button>
  )
}

export default function GuestTable({
  guests,
  onEdit,
  onDelete,
  onSendWa,
  onQrClick,
}: GuestTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('name')
  const [sortDir, setSortDir] = useState<SortDir>('asc')

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  function handleDelete(guest: Guest) {
    toast.warning({
      title: `Hapus ${guest.name}?`,
      description: 'Data tamu akan dihapus permanen.',
      duration: 5000,
    })
    // Small delay to let toast appear, then call parent
    setTimeout(() => onDelete(guest), 300)
  }

  const sortedGuests = [...guests].sort((a, b) => {
    const dir = sortDir === 'asc' ? 1 : -1
    switch (sortKey) {
      case 'name':
        return a.name.localeCompare(b.name) * dir
      case 'attendance_status': {
        const order: Record<string, number> = {
          attending: 0,
          maybe: 1,
          pending: 2,
          not_attending: 3,
        }
        return ((order[a.attendance_status] ?? 4) - (order[b.attendance_status] ?? 4)) * dir
      }
      case 'guest_count':
        return (a.guest_count - b.guest_count) * dir
      default:
        return 0
    }
  })

  if (guests.length === 0) {
    return null
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-stone-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-stone-200 bg-stone-50">
          <tr>
            <th className="px-4 py-3">
              <SortButton
                label="Nama"
                active={sortKey === 'name'}
                dir={sortDir}
                onClick={() => toggleSort('name')}
              />
            </th>
            <th className="px-4 py-3 text-xs font-medium text-stone-500">No. HP</th>
            <th className="px-4 py-3">
              <SortButton
                label="Status RSVP"
                active={sortKey === 'attendance_status'}
                dir={sortDir}
                onClick={() => toggleSort('attendance_status')}
              />
            </th>
            <th className="px-4 py-3">
              <SortButton
                label="Jumlah"
                active={sortKey === 'guest_count'}
                dir={sortDir}
                onClick={() => toggleSort('guest_count')}
              />
            </th>
            <th className="px-4 py-3 text-xs font-medium text-stone-500">Undangan</th>
            <th className="px-4 py-3 text-xs font-medium text-stone-500">QR</th>
            <th className="px-4 py-3 text-xs font-medium text-stone-500">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {sortedGuests.map((guest) => (
            <tr key={guest.id} className="transition-colors hover:bg-stone-50/50">
              <td className="px-4 py-3">
                <div>
                  <p className="font-medium text-stone-900">{guest.name}</p>
                  {guest.email && (
                    <p className="text-xs text-stone-400">{guest.email}</p>
                  )}
                </div>
              </td>
              <td className="px-4 py-3 text-stone-500">
                {guest.phone || guest.whatsapp_number || (
                  <span className="text-stone-300">-</span>
                )}
              </td>
              <td className="px-4 py-3">{statusBadge(guest.attendance_status)}</td>
              <td className="px-4 py-3 text-stone-500">{guest.guest_count}</td>
              <td className="px-4 py-3">
                {guest.invite_sent ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                    Sudah
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-medium text-stone-400">
                    Belum
                  </span>
                )}
              </td>
              <td className="px-4 py-3">
                <button
                  onClick={() => onQrClick(guest)}
                  className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-700"
                >
                  <QrCode className="h-3.5 w-3.5" />
                  Lihat
                </button>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onEdit(guest)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-stone-400 transition-colors hover:bg-emerald-50 hover:text-emerald-600"
                    title="Edit"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(guest)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-stone-400 transition-colors hover:bg-red-50 hover:text-red-600"
                    title="Hapus"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                  {(guest.phone || guest.whatsapp_number) && (
                    <button
                      onClick={() => onSendWa(guest)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-stone-400 transition-colors hover:bg-emerald-50 hover:text-emerald-600"
                      title="Kirim WhatsApp"
                    >
                      <MessageCircle className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function QrModal({
  guest,
  invitationSlug,
  isOpen,
  onClose,
}: {
  guest: Guest | null
  invitationSlug: string
  isOpen: boolean
  onClose: () => void
}) {
  if (!isOpen || !guest) return null

  const url = `https://momenku-two.vercel.app/guest/${guest.qr_code}`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-stone-900/20 backdrop-blur-sm" onClick={onClose} />
      <div className="relative rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 text-center">
          <h3 className="text-sm font-semibold text-stone-900">QR Code</h3>
          <p className="text-xs text-stone-500">{guest.name}</p>
        </div>
        <div className="flex justify-center">
          <QrCodeComponent value={url} size={200} showDownload />
        </div>
        <p className="mt-3 max-w-xs break-all text-center text-[11px] text-stone-400">
          {url}
        </p>
        <button
          onClick={onClose}
          className="mt-4 w-full rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-100"
        >
          Tutup
        </button>
      </div>
    </div>
  )
}
