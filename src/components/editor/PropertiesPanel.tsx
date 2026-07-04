'use client'

import { useEditorStore } from '@/lib/editor-store'
import type { SectionType } from '@/types/editor'
import { Trash2 } from 'lucide-react'
import ImageUpload from '@/components/editor/ImageUpload'
import ImageGallery from '@/components/editor/ImageGallery'

function FieldGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-stone-600 text-xs font-medium font-[family-name:var(--font-jakarta)]">
        {label}
      </label>
      {children}
    </div>
  )
}

function TextInput({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2 rounded-lg border border-stone-200 text-stone-800 text-sm font-[family-name:var(--font-jakarta)] focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-300 transition-all"
    />
  )
}

function Textarea({
  value,
  onChange,
  rows = 3,
}: {
  value: string
  onChange: (v: string) => void
  rows?: number
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      className="w-full px-3 py-2 rounded-lg border border-stone-200 text-stone-800 text-sm font-[family-name:var(--font-jakarta)] focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-emerald-300 transition-all resize-none"
    />
  )
}

function RangeInput({
  value,
  onChange,
  min = 0,
  max = 1,
  step = 0.05,
  label,
}: {
  value: number
  onChange: (v: number) => void
  min?: number
  max?: number
  step?: number
  label?: string
}) {
  return (
    <div>
      {label && (
        <div className="flex justify-between mb-1">
          <span className="text-xs text-stone-500 font-[family-name:var(--font-jakarta)]">{label}</span>
          <span className="text-xs text-stone-400 font-[family-name:var(--font-jakarta)]">
            {Math.round(value * 100)}%
          </span>
        </div>
      )}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1.5 bg-stone-200 rounded-full appearance-none cursor-pointer accent-emerald-500"
      />
    </div>
  )
}

function HeroProperties({ sectionId, data }: { sectionId: string; data: any }) {
  const { updateSection, updateSectionMeta } = useEditorStore()
  const update = (k: string, v: any) => updateSection(sectionId, { [k]: v })

  return (
    <div className="space-y-4">
      <FieldGroup label="Judul">
        <TextInput value={data.title} onChange={(v) => update('title', v)} placeholder="The Wedding of" />
      </FieldGroup>
      <FieldGroup label="Subjudul">
        <TextInput value={data.subtitle} onChange={(v) => update('subtitle', v)} placeholder="Rina & Budi" />
      </FieldGroup>
      <FieldGroup label="Gambar Latar">
        <ImageUpload
          currentImage={data.backgroundImage}
          onUpload={(url) => update('backgroundImage', url)}
        />
      </FieldGroup>
      <RangeInput
        label="Opacity Overlay"
        value={data.overlayOpacity}
        onChange={(v) => update('overlayOpacity', v)}
      />
      <FieldGroup label="Warna Background">
        <input
          type="color"
          value="#059669"
          onChange={(e) => updateSectionMeta(sectionId, { backgroundColor: e.target.value })}
          className="w-full h-10 rounded-lg border border-stone-200 cursor-pointer"
        />
      </FieldGroup>
    </div>
  )
}

function CoupleProperties({ sectionId, data }: { sectionId: string; data: any }) {
  const update = (k: string, v: any) =>
    useEditorStore.getState().updateSection(sectionId, { [k]: v })

  return (
    <div className="space-y-4">
      <FieldGroup label="Nama Mempelai Pria">
        <TextInput value={data.groomName} onChange={(v) => update('groomName', v)} />
      </FieldGroup>
      <FieldGroup label="Orang Tua Pria">
        <TextInput value={data.groomParents} onChange={(v) => update('groomParents', v)} />
      </FieldGroup>
      <FieldGroup label="Nama Mempelai Wanita">
        <TextInput value={data.brideName} onChange={(v) => update('brideName', v)} />
      </FieldGroup>
      <FieldGroup label="Orang Tua Wanita">
        <TextInput value={data.brideParents} onChange={(v) => update('brideParents', v)} />
      </FieldGroup>
      <FieldGroup label="Foto Pasangan">
        <ImageUpload
          currentImage={data.photo}
          onUpload={(url) => update('photo', url)}
        />
      </FieldGroup>
    </div>
  )
}

function StoryProperties({ sectionId, data }: { sectionId: string; data: any }) {
  const update = (k: string, v: any) =>
    useEditorStore.getState().updateSection(sectionId, { [k]: v })

  const updateItem = (idx: number, k: string, v: any) => {
    const items = [...data.items]
    items[idx] = { ...items[idx], [k]: v }
    update('items', items)
  }

  const addItem = () => {
    update('items', [...data.items, { year: '', title: '', description: '', image: '' }])
  }

  const removeItem = (idx: number) => {
    update(
      'items',
      data.items.filter((_: any, i: number) => i !== idx)
    )
  }

  return (
    <div className="space-y-4">
      <FieldGroup label="Judul">
        <TextInput value={data.title} onChange={(v) => update('title', v)} />
      </FieldGroup>
      <div className="space-y-3">
        {data.items.map((item: any, idx: number) => (
          <div key={idx} className="p-3 bg-stone-50 rounded-lg space-y-2 relative">
            <button
              onClick={() => removeItem(idx)}
              className="absolute top-2 right-2 text-red-400 hover:text-red-600"
            >
              <Trash2 className="w-3 h-3" />
            </button>
            <TextInput value={item.year} onChange={(v) => updateItem(idx, 'year', v)} placeholder="Tahun" />
            <TextInput value={item.title} onChange={(v) => updateItem(idx, 'title', v)} placeholder="Judul" />
            <Textarea value={item.description} onChange={(v) => updateItem(idx, 'description', v)} rows={2} />
            <ImageUpload
              currentImage={item.image}
              onUpload={(url) => updateItem(idx, 'image', url)}
            />
          </div>
        ))}
      </div>
      <button
        onClick={addItem}
        className="w-full py-2 rounded-lg border border-dashed border-stone-300 text-stone-500 text-xs font-[family-name:var(--font-jakarta)] hover:border-emerald-300 hover:text-emerald-600 transition-colors"
      >
        + Tambah Item
      </button>
    </div>
  )
}

function GalleryProperties({ sectionId, data }: { sectionId: string; data: any }) {
  const update = (k: string, v: any) =>
    useEditorStore.getState().updateSection(sectionId, { [k]: v })

  return (
    <div className="space-y-4">
      <FieldGroup label="Judul">
        <TextInput value={data.title} onChange={(v) => update('title', v)} />
      </FieldGroup>
      <FieldGroup label="Jumlah Kolom">
        <div className="flex gap-2">
          {[2, 3, 4].map((n) => (
            <button
              key={n}
              onClick={() => update('columns', n)}
              className={`flex-1 py-2 rounded-lg text-xs font-[family-name:var(--font-jakarta)] border transition-all ${
                data.columns === n
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-white text-stone-600 border-stone-200 hover:border-emerald-300'
              }`}
            >
              {n} Kolom
            </button>
          ))}
        </div>
      </FieldGroup>
      <FieldGroup label="Gambar Galeri">
        <ImageGallery
          images={data.images}
          onChange={(images) => update('images', images)}
          maxImages={20}
        />
      </FieldGroup>
    </div>
  )
}

function EventsProperties({ sectionId, data }: { sectionId: string; data: any }) {
  const update = (k: string, v: any) =>
    useEditorStore.getState().updateSection(sectionId, { [k]: v })

  const updateItem = (idx: number, k: string, v: any) => {
    const items = [...data.items]
    items[idx] = { ...items[idx], [k]: v }
    update('items', items)
  }

  const addItem = () => {
    update('items', [
      ...data.items,
      { name: '', date: '', time: '', location: '', address: '' },
    ])
  }

  const removeItem = (idx: number) => {
    update(
      'items',
      data.items.filter((_: any, i: number) => i !== idx)
    )
  }

  return (
    <div className="space-y-4">
      <FieldGroup label="Judul">
        <TextInput value={data.title} onChange={(v) => update('title', v)} />
      </FieldGroup>
      <div className="space-y-3">
        {data.items.map((item: any, idx: number) => (
          <div key={idx} className="p-3 bg-stone-50 rounded-lg space-y-2 relative">
            <button
              onClick={() => removeItem(idx)}
              className="absolute top-2 right-2 text-red-400 hover:text-red-600"
            >
              <Trash2 className="w-3 h-3" />
            </button>
            <TextInput value={item.name} onChange={(v) => updateItem(idx, 'name', v)} placeholder="Nama Acara" />
            <TextInput value={item.date} onChange={(v) => updateItem(idx, 'date', v)} placeholder="Tanggal" />
            <TextInput value={item.time} onChange={(v) => updateItem(idx, 'time', v)} placeholder="Waktu" />
            <TextInput value={item.location} onChange={(v) => updateItem(idx, 'location', v)} placeholder="Lokasi" />
            <TextInput value={item.address} onChange={(v) => updateItem(idx, 'address', v)} placeholder="Alamat" />
          </div>
        ))}
      </div>
      <button
        onClick={addItem}
        className="w-full py-2 rounded-lg border border-dashed border-stone-300 text-stone-500 text-xs font-[family-name:var(--font-jakarta)] hover:border-emerald-300 hover:text-emerald-600 transition-colors"
      >
        + Tambah Acara
      </button>
    </div>
  )
}

function RsvpProperties({ sectionId, data }: { sectionId: string; data: any }) {
  const update = (k: string, v: any) =>
    useEditorStore.getState().updateSection(sectionId, { [k]: v })

  const FIELD_OPTIONS = ['name', 'email', 'attendance', 'guests', 'message']

  return (
    <div className="space-y-4">
      <FieldGroup label="Judul">
        <TextInput value={data.title} onChange={(v) => update('title', v)} />
      </FieldGroup>
      <FieldGroup label="Deskripsi">
        <Textarea value={data.description} onChange={(v) => update('description', v)} />
      </FieldGroup>
      <FieldGroup label="Field Form">
        <div className="space-y-1.5">
          {FIELD_OPTIONS.map((f) => (
            <label key={f} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={data.fields.includes(f)}
                onChange={(e) => {
                  const fields = e.target.checked
                    ? [...data.fields, f]
                    : data.fields.filter((x: string) => x !== f)
                  update('fields', fields)
                }}
                className="w-3.5 h-3.5 rounded border-stone-300 text-emerald-600 focus:ring-emerald-300"
              />
              <span className="text-xs text-stone-600 font-[family-name:var(--font-jakarta)] capitalize">
                {f}
              </span>
            </label>
          ))}
        </div>
      </FieldGroup>
    </div>
  )
}

function WishesProperties({ sectionId, data }: { sectionId: string; data: any }) {
  const update = (k: string, v: any) =>
    useEditorStore.getState().updateSection(sectionId, { [k]: v })

  return (
    <div className="space-y-4">
      <FieldGroup label="Judul">
        <TextInput value={data.title} onChange={(v) => update('title', v)} />
      </FieldGroup>
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={data.showSocialProof}
          onChange={(e) => update('showSocialProof', e.target.checked)}
          className="w-3.5 h-3.5 rounded border-stone-300 text-emerald-600 focus:ring-emerald-300"
        />
        <span className="text-xs text-stone-600 font-[family-name:var(--font-jakarta)]">
          Tampilkan social proof
        </span>
      </label>
    </div>
  )
}

function GiftsProperties({ sectionId, data }: { sectionId: string; data: any }) {
  const update = (k: string, v: any) =>
    useEditorStore.getState().updateSection(sectionId, { [k]: v })

  const updateItem = (idx: number, k: string, v: any) => {
    const items = [...data.items]
    items[idx] = { ...items[idx], [k]: v }
    update('items', items)
  }

  const addItem = () => {
    update('items', [...data.items, { name: '', bank: '', number: '', nameAccount: '' }])
  }

  const removeItem = (idx: number) => {
    update(
      'items',
      data.items.filter((_: any, i: number) => i !== idx)
    )
  }

  return (
    <div className="space-y-4">
      <FieldGroup label="Judul">
        <TextInput value={data.title} onChange={(v) => update('title', v)} />
      </FieldGroup>
      <div className="space-y-3">
        {data.items.map((item: any, idx: number) => (
          <div key={idx} className="p-3 bg-stone-50 rounded-lg space-y-2 relative">
            <button
              onClick={() => removeItem(idx)}
              className="absolute top-2 right-2 text-red-400 hover:text-red-600"
            >
              <Trash2 className="w-3 h-3" />
            </button>
            <TextInput value={item.name} onChange={(v) => updateItem(idx, 'name', v)} placeholder="Nama Bank" />
            <TextInput value={item.bank} onChange={(v) => updateItem(idx, 'bank', v)} placeholder="Bank" />
            <TextInput value={item.number} onChange={(v) => updateItem(idx, 'number', v)} placeholder="Nomor Rekening" />
            <TextInput value={item.nameAccount} onChange={(v) => updateItem(idx, 'nameAccount', v)} placeholder="Nama Pemilik" />
          </div>
        ))}
      </div>
      <button
        onClick={addItem}
        className="w-full py-2 rounded-lg border border-dashed border-stone-300 text-stone-500 text-xs font-[family-name:var(--font-jakarta)] hover:border-emerald-300 hover:text-emerald-600 transition-colors"
      >
        + Tambah Rekening
      </button>
    </div>
  )
}

function FooterProperties({ sectionId, data }: { sectionId: string; data: any }) {
  const update = (k: string, v: any) =>
    useEditorStore.getState().updateSection(sectionId, { [k]: v })

  return (
    <div className="space-y-4">
      <FieldGroup label="Pesan Penutup">
        <Textarea value={data.message} onChange={(v) => update('message', v)} rows={4} />
      </FieldGroup>
      <FieldGroup label="Nama Pasangan">
        <TextInput value={data.coupleNames} onChange={(v) => update('coupleNames', v)} />
      </FieldGroup>
    </div>
  )
}

function CustomProperties({ sectionId, data }: { sectionId: string; data: any }) {
  const update = (k: string, v: any) =>
    useEditorStore.getState().updateSection(sectionId, { [k]: v })

  return (
    <div className="space-y-4">
      <FieldGroup label="HTML">
        <textarea
          value={data.html}
          onChange={(e) => update('html', e.target.value)}
          rows={8}
          className="w-full px-3 py-2 rounded-lg border border-stone-200 text-stone-800 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-300 resize-none"
          placeholder="<div>Custom HTML</div>"
        />
      </FieldGroup>
      <FieldGroup label="CSS">
        <textarea
          value={data.css}
          onChange={(e) => update('css', e.target.value)}
          rows={5}
          className="w-full px-3 py-2 rounded-lg border border-stone-200 text-stone-800 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-300 resize-none"
          placeholder=".custom { color: red; }"
        />
      </FieldGroup>
    </div>
  )
}

function CountdownProperties({ sectionId, data }: { sectionId: string; data: any }) {
  const update = (k: string, v: any) => useEditorStore.getState().updateSection(sectionId, { [k]: v })

  return (
    <div className="space-y-4">
      <FieldGroup label="Judul">
        <TextInput value={data.title} onChange={(v) => update('title', v)} placeholder="Hitung Mundur" />
      </FieldGroup>
      <FieldGroup label="Tanggal Acara">
        <input
          type="datetime-local"
          value={data.eventDate}
          onChange={(e) => update('eventDate', e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-stone-200 text-stone-800 text-sm font-[family-name:var(--font-jakarta)] focus:outline-none focus:ring-2 focus:ring-emerald-300 transition-all"
        />
      </FieldGroup>
    </div>
  )
}

function MapsProperties({ sectionId, data }: { sectionId: string; data: any }) {
  const update = (k: string, v: any) => useEditorStore.getState().updateSection(sectionId, { [k]: v })

  return (
    <div className="space-y-4">
      <FieldGroup label="Judul">
        <TextInput value={data.title} onChange={(v) => update('title', v)} placeholder="Lokasi Acara" />
      </FieldGroup>
      <FieldGroup label="Alamat">
        <TextInput value={data.address} onChange={(v) => update('address', v)} placeholder="Jl. Sudirman No. 123, Jakarta" />
      </FieldGroup>
      <FieldGroup label="URL Google Maps">
        <TextInput
          value={data.mapsUrl}
          onChange={(v) => update('mapsUrl', v)}
          placeholder="https://www.google.com/maps/embed?..."
        />
        <p className="text-[10px] text-stone-400 font-[family-name:var(--font-jakarta)]">
          Paste URL embed dari Google Maps (bagikan &gt; sematkan peta)
        </p>
      </FieldGroup>
    </div>
  )
}

function MusicProperties({ sectionId, data }: { sectionId: string; data: any }) {
  const update = (k: string, v: any) => useEditorStore.getState().updateSection(sectionId, { [k]: v })

  return (
    <div className="space-y-4">
      <FieldGroup label="Judul">
        <TextInput value={data.title} onChange={(v) => update('title', v)} placeholder="Musik Latar" />
      </FieldGroup>
      <FieldGroup label="URL Musik">
        <TextInput
          value={data.musicUrl}
          onChange={(v) => update('musicUrl', v)}
          placeholder="https://example.com/song.mp3"
        />
        <p className="text-[10px] text-stone-400 font-[family-name:var(--font-jakarta)]">
          URL file audio (MP3, OGG, dll.)
        </p>
      </FieldGroup>
    </div>
  )
}

const PROPERTIES_MAP: Record<
  SectionType,
  React.ComponentType<{ sectionId: string; data: any }>
> = {
  hero: HeroProperties,
  couple: CoupleProperties,
  story: StoryProperties,
  gallery: GalleryProperties,
  events: EventsProperties,
  rsvp: RsvpProperties,
  wishes: WishesProperties,
  gifts: GiftsProperties,
  footer: FooterProperties,
  custom: CustomProperties,
  countdown: CountdownProperties,
  maps: MapsProperties,
  music: MusicProperties,
}

export default function PropertiesPanel() {
  const { sections, selectedSectionId, removeSection, updateSectionMeta } = useEditorStore()
  const selected = sections.find((s) => s.id === selectedSectionId)

  if (!selected) {
    return (
      <div className="w-72 bg-white border-l border-stone-200 flex flex-col h-full">
        <div className="p-4 border-b border-stone-100">
          <h3 className="font-[family-name:var(--font-jakarta)] text-sm font-semibold text-stone-800">
            Properties
          </h3>
        </div>
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <div className="w-12 h-12 rounded-2xl bg-stone-100 flex items-center justify-center mx-auto mb-3">
              <svg
                className="w-6 h-6 text-stone-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                />
              </svg>
            </div>
            <p className="text-stone-400 text-xs font-[family-name:var(--font-jakarta)]">
              Pilih section untuk mengedit
            </p>
          </div>
        </div>
      </div>
    )
  }

  const PropertiesComponent = PROPERTIES_MAP[selected.type]

  return (
    <div className="w-72 bg-white border-l border-stone-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-stone-100">
        <div className="flex items-center justify-between">
          <h3 className="font-[family-name:var(--font-jakarta)] text-sm font-semibold text-stone-800 capitalize">
            {selected.type} Section
          </h3>
          <span className="text-[10px] text-stone-400 font-[family-name:var(--font-jakarta)] bg-stone-100 px-2 py-0.5 rounded-full">
            {selected.type}
          </span>
        </div>
      </div>

      {/* Properties form */}
      <div className="flex-1 overflow-y-auto p-4">
        {PropertiesComponent && (
          <PropertiesComponent sectionId={selected.id} data={selected.data} />
        )}

        {/* Section spacing */}
        <div className="mt-6 pt-4 border-t border-stone-100">
          <p className="text-[10px] uppercase tracking-wider text-stone-400 font-[family-name:var(--font-jakarta)] font-semibold mb-3">
            Spacing
          </p>
          <div className="grid grid-cols-2 gap-2">
            {(['top', 'bottom', 'left', 'right'] as const).map((dir) => (
              <div key={dir}>
                <label className="text-[10px] text-stone-400 font-[family-name:var(--font-jakarta)] capitalize block mb-1">
                  {dir}
                </label>
                <input
                  type="number"
                  value={selected.padding[dir]}
                  onChange={(e) =>
                    updateSectionMeta(selected.id, {
                      padding: { ...selected.padding, [dir]: parseInt(e.target.value) || 0 },
                    })
                  }
                  className="w-full px-2 py-1.5 rounded-lg border border-stone-200 text-stone-800 text-xs font-[family-name:var(--font-jakarta)] focus:outline-none focus:ring-2 focus:ring-emerald-300"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Font selector */}
        <div className="mt-4 pt-4 border-t border-stone-100">
          <FieldGroup label="Font Family">
            <div className="flex gap-1.5">
              {[
                { value: 'jakarta', label: 'Jakarta' },
                { value: 'cormorant', label: 'Cormorant' },
                { value: 'script', label: 'Script' },
              ].map((f) => (
                <button
                  key={f.value}
                  onClick={() => updateSectionMeta(selected.id, { fontFamily: f.value as any })}
                  className={`flex-1 py-1.5 rounded-lg text-[10px] font-[family-name:var(--font-jakarta)] border transition-all ${
                    selected.fontFamily === f.value
                      ? 'bg-emerald-600 text-white border-emerald-600'
                      : 'bg-white text-stone-600 border-stone-200 hover:border-emerald-300'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </FieldGroup>
        </div>
      </div>

      {/* Delete button */}
      <div className="p-4 border-t border-stone-100">
        <button
          onClick={() => removeSection(selected.id)}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-red-200 text-red-500 text-xs font-medium font-[family-name:var(--font-jakarta)] hover:bg-red-50 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Hapus Section
        </button>
      </div>
    </div>
  )
}
