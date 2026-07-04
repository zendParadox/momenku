'use client'

import { useState, useRef, useCallback } from 'react'
import { uploadImage } from '@/lib/upload'
import { ImagePlus, X, GripVertical, Loader2 } from 'lucide-react'
import { toast } from 'gooey-toast'

interface ImageGalleryProps {
  images: string[]
  onChange: (images: string[]) => void
  maxImages?: number
}

export default function ImageGallery({
  images,
  onChange,
  maxImages = 20,
}: ImageGalleryProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [overIndex, setOverIndex] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFiles = useCallback(
    async (files: FileList) => {
      const remaining = maxImages - images.length
      if (remaining <= 0) {
        toast.error({
          title: `Maksimal ${maxImages} gambar`,
        })
        return
      }

      const toUpload = Array.from(files).slice(0, remaining)
      if (toUpload.length < files.length) {
        toast.info({
          title: `Hanya ${toUpload.length} gambar yang akan diunggah`,
          description: `Maksimal ${maxImages} gambar`,
        })
      }

      setIsUploading(true)
      setProgress(0)

      try {
        const newUrls: string[] = []
        for (let i = 0; i < toUpload.length; i++) {
          const file = toUpload[i]
          if (!file.type.startsWith('image/')) continue

          const result = await uploadImage(file, (p) => {
            // Scale progress across all files
            const base = (i / toUpload.length) * 100
            const step = p / toUpload.length
            setProgress(Math.round(base + step))
          })
          newUrls.push(result.url)
        }

        if (newUrls.length > 0) {
          onChange([...images, ...newUrls])
          toast.success({
            title: `${newUrls.length} gambar berhasil diunggah`,
          })
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Gagal mengunggah gambar'
        toast.error({ title: message })
      } finally {
        setIsUploading(false)
        setProgress(0)
      }
    },
    [images, onChange, maxImages],
  )

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) handleFiles(e.target.files)
      e.target.value = ''
    },
    [handleFiles],
  )

  const handleRemove = useCallback(
    (index: number) => {
      const next = images.filter((_, i) => i !== index)
      onChange(next)
    },
    [images, onChange],
  )

  // ─── Drag & Drop reorder ──────────────────────────────

  const handleDragStart = useCallback(
    (e: React.DragEvent, index: number) => {
      setDragIndex(index)
      e.dataTransfer.effectAllowed = 'move'
      // Set a transparent drag image
      const el = e.currentTarget as HTMLElement
      e.dataTransfer.setDragImage(el, 0, 0)
    },
    [],
  )

  const handleDragOverItem = useCallback(
    (e: React.DragEvent, index: number) => {
      e.preventDefault()
      e.dataTransfer.dropEffect = 'move'
      setOverIndex(index)
    },
    [],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent, dropIndex: number) => {
      e.preventDefault()
      if (dragIndex === null || dragIndex === dropIndex) {
        setDragIndex(null)
        setOverIndex(null)
        return
      }

      const next = [...images]
      const [moved] = next.splice(dragIndex, 1)
      next.splice(dropIndex, 0, moved)
      onChange(next)
      setDragIndex(null)
      setOverIndex(null)
    },
    [dragIndex, images, onChange],
  )

  const handleDragEnd = useCallback(() => {
    setDragIndex(null)
    setOverIndex(null)
  }, [])

  return (
    <div className="space-y-2">
      {/* Thumbnail grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {images.map((url, index) => (
            <div
              key={`${url}-${index}`}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={(e) => handleDragOverItem(e, index)}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
              className={`
                relative group rounded-xl overflow-hidden border bg-stone-50
                cursor-grab active:cursor-grabbing
                transition-all duration-150
                ${
                  dragIndex === index
                    ? 'opacity-40 scale-95 border-stone-300'
                    : overIndex === index
                      ? 'border-emerald-400 ring-2 ring-emerald-200'
                      : 'border-stone-200 hover:border-stone-300'
                }
              `}
            >
              <img
                src={url}
                alt={`Galeri ${index + 1}`}
                className="w-full aspect-square object-cover"
              />

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors">
                {/* Drag handle */}
                <div className="absolute top-1 left-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-white/90 rounded-md p-0.5 shadow">
                    <GripVertical className="w-3 h-3 text-stone-500" />
                  </div>
                </div>

                {/* Delete button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRemove(index)
                  }}
                  className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full p-1 hover:bg-white shadow"
                  title="Hapus gambar"
                >
                  <X className="w-3 h-3 text-stone-600" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload progress */}
      {isUploading && (
        <div className="rounded-xl border border-stone-200 bg-stone-50 p-3 space-y-2">
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 text-emerald-500 animate-spin" />
            <span className="text-xs text-stone-500 font-[family-name:var(--font-jakarta)]">
              Mengunggah gambar...
            </span>
          </div>
          <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #059669, #10b981)',
              }}
            />
          </div>
        </div>
      )}

      {/* Add button */}
      {images.length < maxImages && !isUploading && (
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full py-3 rounded-xl border border-dashed border-stone-200 text-stone-400 text-xs font-[family-name:var(--font-jakarta)] hover:border-emerald-300 hover:text-emerald-600 hover:bg-emerald-50/50 transition-all flex items-center justify-center gap-1.5"
        >
          <ImagePlus className="w-4 h-4" />
          Tambah Gambar
        </button>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleInputChange}
        className="hidden"
      />

      {/* Counter */}
      <p className="text-[10px] text-stone-400 font-[family-name:var(--font-jakarta)] text-center">
        {images.length} / {maxImages} gambar
      </p>
    </div>
  )
}
