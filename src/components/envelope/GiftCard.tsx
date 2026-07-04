'use client'

import { useState } from 'react'
import { toast } from 'gooey-toast'
import { Copy, Check } from 'lucide-react'

interface GiftCardProps {
  bank: string
  accountNumber: string
  accountName: string
  logoColor?: string
}

const BANK_COLORS: Record<string, string> = {
  BCA: '#0066b2',
  Mandiri: '#ff0000',
  BRI: '#004c99',
  BNI: '#e31937',
  BSI: '#00843d',
  BTN: '#ff6600',
  CIMB: '#8b0000',
  Danamon: '#0066b2',
  Permata: '#003366',
  'Bank Jago': '#00b16a',
  GoPay: '#00aa13',
  OVO: '#4c3494',
  Dana: '#108ee9',
  ShopeePay: '#ee4d2d',
  LinkAja: '#e01e1e',
}

function getBankColor(bank: string): string {
  const normalized = bank.toUpperCase()
  return BANK_COLORS[normalized] || BANK_COLORS[bank] || '#059669'
}

export default function GiftCard({
  bank,
  accountNumber,
  accountName,
  logoColor,
}: GiftCardProps) {
  const [copied, setCopied] = useState(false)
  const color = logoColor || getBankColor(bank)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(accountNumber)
      setCopied(true)
      toast.success({
        title: 'Berhasil disalin!',
        description: `Nomor rekening ${bank} telah tersalin`,
      })
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error({
        title: 'Gagal menyalin',
        description: 'Silakan salin nomor rekening secara manual',
      })
    }
  }

  return (
    <div className="rounded-2xl border border-stone-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Bank header */}
      <div
        className="px-5 py-4 flex items-center gap-3"
        style={{
          background: `linear-gradient(135deg, ${color}15, ${color}08)`,
        }}
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm"
          style={{ backgroundColor: color }}
        >
          {bank.slice(0, 2).toUpperCase()}
        </div>
        <div>
          <p className="text-sm font-semibold text-stone-800">{bank}</p>
          <p className="text-xs text-stone-500">a.n. {accountName}</p>
        </div>
      </div>

      {/* Account number */}
      <div className="px-5 py-4 flex items-center justify-between">
        <span className="font-mono text-lg tracking-wider text-stone-800">
          {accountNumber.replace(/(.{4})/g, '$1 ').trim()}
        </span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-all"
          style={{
            color: copied ? '#059669' : color,
            backgroundColor: copied ? '#ecfdf5' : `${color}10`,
          }}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5" />
              Tersalin!
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              Salin
            </>
          )}
        </button>
      </div>
    </div>
  )
}
