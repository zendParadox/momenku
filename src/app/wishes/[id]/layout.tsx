import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Ucapan & Doa — MomenKu',
  description: 'Kirim ucapan dan doa untuk kedua mempelai',
}

export default function WishesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-dvh bg-gradient-to-br from-stone-50 via-white to-stone-100 flex items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-lg">
        {children}
      </div>
    </div>
  )
}
