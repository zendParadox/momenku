'use client'

/**
 * Media Upload Utility — Cloudflare R2 ready with local fallback.
 *
 * Currently stores images as base64 data URLs in IndexedDB.
 * To swap to R2, replace the IndexedDB write with a fetch to your
 * /api/upload endpoint and return the resulting URL instead.
 */

const DB_NAME = 'momenku-media'
const DB_VERSION = 1
const STORE_NAME = 'uploads'

/* ─── IndexedDB helpers ─────────────────────────────────────── */

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB is not available'))
      return
    }
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' })
      }
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

async function saveToIndexedDB(id: string, dataUrl: string): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    tx.objectStore(STORE_NAME).put({ id, dataUrl, createdAt: Date.now() })
    tx.oncomplete = () => resolve()
    tx.onerror = () => reject(tx.error)
  })
}

async function getFromIndexedDB(id: string): Promise<string | null> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly')
    const req = tx.objectStore(STORE_NAME).get(id)
    req.onsuccess = () => resolve(req.result?.dataUrl ?? null)
    req.onerror = () => reject(req.error)
  })
}

/* ─── Image processing ──────────────────────────────────────── */

const MAX_WIDTH = 1200
const JPEG_QUALITY = 0.8

function supportsWebP(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return canvas.toDataURL('image/webp').startsWith('data:image/webp')
  } catch {
    return false
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Failed to load image'))
    img.src = src
  })
}

async function processImage(file: File): Promise<{ dataUrl: string; width: number; height: number }> {
  const reader = new FileReader()
  const dataUrl = await new Promise<string>((resolve, reject) => {
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })

  const img = await loadImage(dataUrl)
  let { width, height } = img

  // Resize if wider than MAX_WIDTH
  if (width > MAX_WIDTH) {
    height = Math.round((height / width) * MAX_WIDTH)
    width = MAX_WIDTH
  }

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(img, 0, 0, width, height)

  // Prefer WebP, fallback to JPEG
  const mimeType = supportsWebP() ? 'image/webp' : 'image/jpeg'
  const quality = mimeType === 'image/jpeg' ? JPEG_QUALITY : undefined
  const processedDataUrl = canvas.toDataURL(mimeType, quality)

  return { dataUrl: processedDataUrl, width, height }
}

/* ─── Public API ────────────────────────────────────────────── */

export type UploadProgressCallback = (progress: number) => void

export interface UploadResult {
  url: string
  width: number
  height: number
}

/**
 * Upload an image file. Resizes, compresses, and stores locally (IndexedDB).
 * Pass `onProgress` to track upload progress (0-100).
 *
 * @example
 * ```ts
 * const result = await uploadImage(file, (p) => console.log(`${p}%`))
 * // result.url → data:image/webp;base64,...
 * ```
 */
export async function uploadImage(
  file: File,
  onProgress?: UploadProgressCallback,
): Promise<UploadResult> {
  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Format file tidak didukung. Gunakan JPG, PNG, WebP, atau GIF.')
  }

  // Validate file size (5MB)
  const maxSize = 5 * 1024 * 1024
  if (file.size > maxSize) {
    throw new Error('Ukuran file terlalu besar. Maksimal 5MB.')
  }

  onProgress?.(10)

  // Process image (resize + compress)
  const { dataUrl, width, height } = await processImage(file)
  onProgress?.(60)

  // Generate a unique ID for this upload
  const id = `upload_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`

  // Store in IndexedDB (local fallback)
  // TODO: Replace with R2 upload when credentials are available:
  //   const formData = new FormData()
  //   formData.append('file', file)
  //   const res = await fetch('/api/upload', { method: 'POST', body: formData })
  //   const { url } = await res.json()
  await saveToIndexedDB(id, dataUrl)
  onProgress?.(100)

  return { url: dataUrl, width, height }
}

/**
 * Retrieve a previously uploaded image URL by its ID.
 */
export async function getUploadedUrl(id: string): Promise<string | null> {
  return getFromIndexedDB(id)
}
