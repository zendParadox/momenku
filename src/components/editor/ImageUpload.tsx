'use client'

import { useState, useRef, useCallback } from 'react'
import { uploadImage, type UploadResult } from '@/lib/upload'
import { ImagePlus, X, Loader2 } from 'lucide-react'
import { toast } from 'gooey-toast'

interface ImageUploadProps {
  onUpload: (url: string) => void
  currentImage?: string
  className?: string
}

export default function ImageUpload({
  onUpload,
  currentImage,
  className = '',
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [preview, setPreview] = useState<string | null>(currentImage ?? null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback(
    async (file: File) => {
      try {
        setIsUploading(true)
        setProgress(0)

        const result: UploadResult = await uploadImage(file, setProgress)
        setPreview(result.url)
        onUpload(result.url)

        toast.success({ title: 'Gambar berhasil diunggah' })
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Gagal mengunggah gambar'
        toast.error({ title: message })
      } finally {
        setIsUploading(false)
        setProgress(0)
      }
    },
    [onUpload],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files[0]
      if (file && file.type.startsWith('image/')) {
        handleFile(file)
      }
    },
    [handleFile],
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) handleFile(file)
      // Reset input so same file can be re-selected
      e.target.value = ''
    },
    [handleFile],
  )

  const handleRemove = useCallback(() => {
    setPreview(null)
    onUpload('')
  }, [onUpload])

  // Show preview if we have an image
  if (preview && !isUploading) {
    return (
      <div className={`relative group ${className}`}>
        <div className="relative rounded-xl overflow-hidden border border-stone-200 bg-stone-50">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-32 object-cover"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
            <button
              onClick={handleRemove}
              className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 rounded-full p-2 hover:bg-white shadow-lg"
              title="Hapus gambar"
            >
              <X className="w-4 h-4 text-stone-700" />
            </button>
          </div>
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="mt-2 w-full text-[10px] text-stone-400 hover:text-emerald-600 font-[family-name:var(--font-jakarta)] transition-colors"
        >
          Ganti gambar
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleInputChange}
          className="hidden"
        />
      </div>
    )
  }

  // Show upload zone
  return (
    <div className={className}>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`
          relative rounded-xl border-2 border-dashed cursor-pointer
          transition-all duration-200 p-4 text-center
          ${
            isDragging
              ? 'border-emerald-400 bg-emerald-50'
              : 'border-stone-200 hover:border-emerald-300 hover:bg-stone-50'
          }
          ${isUploading ? 'pointer-events-none' : ''}
        `}
      >
        {isUploading ? (
          <div className="space-y-2">
            <Loader2 className="w-6 h-6 text-emerald-500 mx-auto animate-spin" />
            <p className="text-xs text-stone-500 font-[family-name:var(--font-jakarta)]">
              Memproses gambar...
            </p>
            {/* Progress bar */}
            <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${progress}%`,
                  background: 'linear-gradient(90deg, #059669, #10b981)',
                }}
              />
            </div>
            <p className="text-[10px] text-stone-400 font-[family-name:var(--font-jakarta)]">
              {progress}%
            </p>
          </div>
        ) : (
          <div className="space-y-1.5">
            <ImagePlus className="w-6 h-6 text-stone-300 mx-auto" />
            <p className="text-xs text-stone-500 font-[family-name:var(--font-jakarta)]">
              Seret & lepas gambar atau klik untuk memilih
            </p>
            <p className="text-[10px] text-stone-400 font-[family-name:var(--font-jakarta)]">
              JPG, PNG, WebP, GIF · Maks 5MB
            </p>
          </div>
        )}
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
      />
    </div>
  )
}
