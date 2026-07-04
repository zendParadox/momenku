import { NextRequest, NextResponse } from 'next/server'

/**
 * POST /api/upload
 *
 * Server-side upload endpoint.
 * Currently a placeholder — the client handles local storage via IndexedDB.
 *
 * When Cloudflare R2 credentials are configured, this route will:
 *   1. Accept multipart form data
 *   2. Validate file type and size
 *   3. Upload to R2 bucket
 *   4. Return the public URL
 */

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_SIZE = 5 * 1024 * 1024 // 5MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json(
        { error: 'File tidak ditemukan.' },
        { status: 400 },
      )
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Format file tidak didukung. Gunakan JPG, PNG, WebP, atau GIF.' },
        { status: 400 },
      )
    }

    // Validate file size
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: 'Ukuran file terlalu besar. Maksimal 5MB.' },
        { status: 400 },
      )
    }

    // TODO: Upload to Cloudflare R2
    //
    // Example when R2 is configured:
    //
    // import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
    //
    // const r2 = new S3Client({
    //   region: 'auto',
    //   endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    //   credentials: {
    //     accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    //     secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    //   },
    // })
    //
    // const key = `uploads/${Date.now()}-${file.name}`
    // const buffer = Buffer.from(await file.arrayBuffer())
    //
    // await r2.send(new PutObjectCommand({
    //   Bucket: process.env.R2_BUCKET_NAME!,
    //   Key: key,
    //   Body: buffer,
    //   ContentType: file.type,
    // }))
    //
    // const url = `${process.env.R2_PUBLIC_URL}/${key}`

    // Placeholder: return a mock URL
    const placeholderUrl = `data:${file.type};base64,`

    return NextResponse.json({
      url: placeholderUrl,
      message: 'Upload berhasil (mode placeholder). Konfigurasi R2 untuk produksi.',
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Gagal mengunggah file.' },
      { status: 500 },
    )
  }
}
