'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'gooey-toast'
import { X, Loader2, Upload, CheckCircle2, AlertCircle, FileSpreadsheet } from 'lucide-react'

interface CsvRow {
  name: string
  phone: string
  email: string
  guest_count: number
}

interface ImportCsvModalProps {
  invitationId: string
  isOpen: boolean
  onClose: () => void
  onImportComplete: () => void
}

function parseCsv(text: string): CsvRow[] {
  const lines = text.trim().split('\n')
  if (lines.length < 2) return []

  const headers = lines[0].split(',').map((h) => h.trim().toLowerCase().replace(/['"]/g, ''))
  const rows: CsvRow[] = []

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map((v) => v.trim().replace(/['"]/g, ''))
    if (values.length === 0 || !values[0]) continue

    const row: Record<string, string> = {}
    headers.forEach((h, idx) => {
      row[h] = values[idx] || ''
    })

    rows.push({
      name: row['name'] || row['nama'] || '',
      phone: row['phone'] || row['no hp'] || row['no. hp'] || row['whatsapp'] || row['wa'] || '',
      email: row['email'] || '',
      guest_count: parseInt(row['guest_count'] || row['jumlah'] || row['count'] || '1', 10) || 1,
    })
  }

  return rows.filter((r) => r.name.trim() !== '')
}

export default function ImportCsvModal({
  invitationId,
  isOpen,
  onClose,
  onImportComplete,
}: ImportCsvModalProps) {
  const supabase = createClient()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [parsedData, setParsedData] = useState<CsvRow[]>([])
  const [importing, setImporting] = useState(false)
  const [importResult, setImportResult] = useState<{ success: number; errors: number } | null>(null)
  const [dragActive, setDragActive] = useState(false)

  if (!isOpen) return null

  function handleFile(file: File) {
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      const data = parseCsv(text)
      if (data.length === 0) {
        toast.error({
          title: 'Tidak ada data ditemukan',
          description: 'Pastikan CSV memiliki kolom name/nama',
        })
        return
      }
      setParsedData(data)
      setImportResult(null)
    }
    reader.readAsText(file)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragActive(false)
    const file = e.dataTransfer.files[0]
    if (file && file.name.endsWith('.csv')) {
      handleFile(file)
    } else {
      toast.error({ title: 'Format file tidak didukung', description: 'Gunakan file .csv' })
    }
  }

  async function handleImport() {
    setImporting(true)
    let success = 0
    let errors = 0

    for (const row of parsedData) {
      try {
        const phoneNorm = row.phone.trim()

        // Check for duplicates by phone number (if phone is provided)
        if (phoneNorm) {
          const { data: existing } = await supabase
            .from('guests')
            .select('id')
            .eq('invitation_id', invitationId)
            .eq('phone', phoneNorm)
            .limit(1)

          if (existing && existing.length > 0) {
            errors++
            continue
          }
        }

        const { error } = await supabase.from('guests').insert({
          invitation_id: invitationId,
          name: row.name.trim(),
          email: row.email.trim() || null,
          phone: phoneNorm || null,
          whatsapp_number: phoneNorm || null,
          guest_count: row.guest_count || 1,
          attendance_status: 'pending',
          invite_sent: false,
        })

        if (error) {
          errors++
        } else {
          success++
        }
      } catch {
        errors++
      }
    }

    setImportResult({ success, errors })
    setImporting(false)

    if (success > 0) {
      toast.success({ title: `${success} tamu berhasil diimport` })
      onImportComplete()
    }
    if (errors > 0) {
      toast.warning({
        title: `${errors} data gagal diimport`,
        description: errors === parsedData.length ? 'Semua data gagal. Periksa format CSV.' : undefined,
      })
    }
  }

  function handleReset() {
    setParsedData([])
    setImportResult(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-stone-900/20 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
              <FileSpreadsheet className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-stone-900">Import CSV</h3>
              <p className="text-xs text-stone-500">
                Format: name/nama, phone/no hp, email (opsional), guest_count/jumlah (opsional)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-stone-400 transition-colors hover:bg-stone-100 hover:text-stone-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Upload area or Preview */}
        {parsedData.length === 0 ? (
          <div
            onDragOver={(e) => {
              e.preventDefault()
              setDragActive(true)
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed py-12 transition-colors ${
              dragActive
                ? 'border-emerald-400 bg-emerald-50'
                : 'border-stone-200 bg-stone-50 hover:border-emerald-300 hover:bg-emerald-50/50'
            }`}
          >
            <Upload className="h-10 w-10 text-stone-300" />
            <p className="mt-3 text-sm font-medium text-stone-600">
              {dragActive ? 'Lepaskan file di sini' : 'Klik atau seret file CSV ke sini'}
            </p>
            <p className="mt-1 text-xs text-stone-400">
              File harus berformat .csv
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleFile(file)
              }}
            />
          </div>
        ) : (
          <div>
            {/* Import result */}
            {importResult && (
              <div className="mb-4 rounded-xl border border-stone-200 bg-stone-50 p-4">
                <div className="flex items-center gap-6">
                  {importResult.success > 0 && (
                    <div className="flex items-center gap-2 text-sm text-emerald-700">
                      <CheckCircle2 className="h-4 w-4" />
                      <span className="font-semibold">{importResult.success}</span> berhasil
                    </div>
                  )}
                  {importResult.errors > 0 && (
                    <div className="flex items-center gap-2 text-sm text-red-600">
                      <AlertCircle className="h-4 w-4" />
                      <span className="font-semibold">{importResult.errors}</span> gagal
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Preview table */}
            <div className="mb-4 max-h-64 overflow-auto rounded-xl border border-stone-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-stone-50 text-xs text-stone-500">
                  <tr>
                    <th className="px-3 py-2 font-medium">#</th>
                    <th className="px-3 py-2 font-medium">Nama</th>
                    <th className="px-3 py-2 font-medium">No. HP</th>
                    <th className="px-3 py-2 font-medium">Email</th>
                    <th className="px-3 py-2 font-medium">Jumlah</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {parsedData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-stone-50">
                      <td className="px-3 py-2 text-stone-400">{idx + 1}</td>
                      <td className="px-3 py-2 text-stone-700">{row.name}</td>
                      <td className="px-3 py-2 text-stone-500">{row.phone || '-'}</td>
                      <td className="px-3 py-2 text-stone-500">{row.email || '-'}</td>
                      <td className="px-3 py-2 text-stone-500">{row.guest_count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="mb-4 text-xs text-stone-500">
              {parsedData.length} data siap diimport
              {parsedData.filter((r) => r.phone).length > 0 &&
                ` • ${parsedData.filter((r) => r.phone).length} memiliki nomor HP`}
            </p>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={handleReset}
                className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm font-medium text-stone-600 transition-colors hover:bg-stone-100"
              >
                Pilih Ulang
              </button>
              {!importResult && (
                <button
                  onClick={handleImport}
                  disabled={importing}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700 disabled:opacity-50"
                >
                  {importing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                  Import Semua
                </button>
              )}
              {importResult && (
                <button
                  onClick={onClose}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-emerald-700"
                >
                  Selesai
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
