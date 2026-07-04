'use client'

import { useEffect, useRef, useState } from 'react'
import QRCodeLib from 'qrcode'
import { Download } from 'lucide-react'

interface QrCodeProps {
  value: string
  size?: number
  showDownload?: boolean
  className?: string
}

export default function QrCode({
  value,
  size = 64,
  showDownload = false,
  className = '',
}: QrCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || !canvasRef.current) return
    QRCodeLib.toCanvas(canvasRef.current, value, {
      width: size,
      margin: 1,
      color: {
        dark: '#1c1917',
        light: '#ffffff',
      },
    })
  }, [mounted, value, size])

  function handleDownload() {
    if (!canvasRef.current) return
    const link = document.createElement('a')
    link.download = `qrcode-${value.slice(-8)}.png`
    link.href = canvasRef.current.toDataURL('image/png')
    link.click()
  }

  if (!mounted) {
    return (
      <div
        className={`animate-pulse rounded-lg bg-stone-100 ${className}`}
        style={{ width: size, height: size }}
      />
    )
  }

  return (
    <div className={`inline-flex flex-col items-center gap-1 ${className}`}>
      <canvas ref={canvasRef} className="rounded-lg" />
      {showDownload && (
        <button
          onClick={handleDownload}
          className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-700"
        >
          <Download className="h-3 w-3" />
          Download
        </button>
      )}
    </div>
  )
}
