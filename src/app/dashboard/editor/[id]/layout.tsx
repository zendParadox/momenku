'use client'

import Toolbar from '@/components/editor/Toolbar'

export default function EditorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-stone-100">
      <Toolbar />
      <div className="flex-1 flex overflow-hidden">{children}</div>
    </div>
  )
}
