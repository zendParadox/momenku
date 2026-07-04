import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Undangan — MomenKu',
  description: 'Undangan digital MomenKu',
}

export default function InvitationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
