'use client'

import { useEffect } from 'react'
import { mountToaster } from 'gooey-toast'
import 'gooey-toast/styles.css'

export default function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    mountToaster({
      position: 'top-right',
      options: {
        duration: 3000,
      },
    })
  }, [])

  return <>{children}</>
}
